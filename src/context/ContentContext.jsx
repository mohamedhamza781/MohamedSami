import * as React from "react";
import { defaultContent } from "../content";
import { supabase, CONTENT_ROW_ID } from "../lib/supabaseClient";
import { useLanguage } from "./LanguageContext";

const ContentContext = React.createContext(null);

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

// Deep-merges a stored/partial object onto defaults so newly added fields
// (added in a later version of the app) are never missing just because an
// older saved row in the database predates them. Arrays and primitives
// from `stored` fully replace the default value; plain objects merge key
// by key, recursively.
function mergeContent(defaults, stored) {
  if (!isPlainObject(stored)) return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (!(key in stored)) continue;
    const defaultValue = defaults[key];
    const storedValue = stored[key];
    if (isPlainObject(defaultValue) && isPlainObject(storedValue)) {
      result[key] = mergeContent(defaultValue, storedValue);
    } else if (storedValue !== undefined) {
      result[key] = storedValue;
    }
  }
  return result;
}

// The content shape gained an { en, ar } split after shipping with a flat
// (single-language) shape. If a row saved under the old shape is loaded
// (no `en`/`ar` keys at all, but other real keys present), treat it as
// legacy English content and carry it forward into the `en` slot rather
// than silently discarding it.
function normalizeStored(stored) {
  if (!isPlainObject(stored)) return defaultContent;
  if ("en" in stored || "ar" in stored) {
    return {
      en: mergeContent(defaultContent.en, stored.en),
      ar: mergeContent(defaultContent.ar, stored.ar),
    };
  }
  if (Object.keys(stored).length > 0) {
    return {
      en: mergeContent(defaultContent.en, stored),
      ar: defaultContent.ar,
    };
  }
  return defaultContent;
}

export function ContentProvider({ children }) {
  const [tree, setTree] = React.useState(defaultContent); // { en: {...}, ar: {...} }
  const [loading, setLoading] = React.useState(true);
  const [storageError, setStorageError] = React.useState("");

  const treeRef = React.useRef(tree);
  React.useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", CONTENT_ROW_ID)
        .single();

      if (cancelled) return;
      if (error) {
        setStorageError("تعذّر تحميل محتوى الموقع من قاعدة البيانات — يتم عرض المحتوى الافتراضي مؤقتًا.");
      } else {
        setTree(normalizeStored(data?.data));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = React.useCallback(async (nextTree) => {
    const { error } = await supabase
      .from("site_content")
      .update({ data: nextTree, updated_at: new Date().toISOString() })
      .eq("id", CONTENT_ROW_ID);

    if (error) {
      setStorageError(
        error.code === "42501" || error.message?.toLowerCase().includes("permission")
          ? "ما قدرت أحفظ — لازم تكون مسجّل دخول كأدمن عشان تعدّل محتوى الموقع."
          : "تعذّر حفظ التغييرات بقاعدة البيانات. تأكد من الاتصال وحاول مرة ثانية."
      );
      return false;
    }
    setStorageError("");
    return true;
  }, []);

  function makeApiForLang(lang) {
    const updateContent = async (patch) => {
      const nextLangSlice = mergeContent(treeRef.current[lang], patch);
      const nextTree = { ...treeRef.current, [lang]: nextLangSlice };
      setTree(nextTree);
      treeRef.current = nextTree;
      await persist(nextTree);
    };

    const resetContent = async () => {
      const nextTree = { ...treeRef.current, [lang]: defaultContent[lang] };
      setTree(nextTree);
      treeRef.current = nextTree;
      await persist(nextTree);
    };

    return { content: tree[lang], updateContent, resetContent, storageError, loading };
  }

  const value = React.useMemo(
    () => ({ tree, makeApiForLang: (lang) => makeApiForLang(lang), storageError, loading }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tree, storageError, loading]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/**
 * useContent(langOverride?) — reads/writes one language's slice of the
 * bilingual content tree. Without an argument, it follows the site's
 * active public language (from LanguageContext) — this is what every
 * public-facing component uses, so switching the language toggle just
 * works everywhere with no other code changes. Pass an explicit "en"/"ar"
 * to read or edit a specific language regardless of the public toggle —
 * this is what the Admin Dashboard's own EN/AR editing switch uses.
 */
export function useContent(langOverride) {
  const ctx = React.useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside a ContentProvider");
  const { language: activeLanguage } = useLanguage();
  const lang = langOverride ?? activeLanguage;
  return ctx.makeApiForLang(lang);
}