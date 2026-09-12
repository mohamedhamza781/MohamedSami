import * as React from "react";
import { defaultContent } from "../content";
import { supabase, CONTENT_ROW_ID } from "../lib/supabaseClient";

const ContentContext = React.createContext(null);

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

// Deep-merges a stored/partial content object onto the defaults so newly
// added fields (added in a later version of the app) are never missing
// just because an older saved row in the database predates them. Arrays
// and primitives from `stored` fully replace the default value; plain
// objects are merged key by key, recursively.
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

export function ContentProvider({ children }) {
  const [content, setContent] = React.useState(defaultContent);
  const [loading, setLoading] = React.useState(true);
  const [storageError, setStorageError] = React.useState("");

  // Always-current copy of `content`, so updateContent can merge against the
  // latest value without needing `content` in its own dependency array.
  const contentRef = React.useRef(content);
  React.useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Load the live row from Supabase once on mount.
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
        setContent(mergeContent(defaultContent, data?.data));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = React.useCallback(async (next) => {
    const { error } = await supabase
      .from("site_content")
      .update({ data: next, updated_at: new Date().toISOString() })
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

  const updateContent = React.useCallback(
    async (patch) => {
      const next = mergeContent(contentRef.current, patch);
      setContent(next);
      contentRef.current = next;
      await persist(next);
    },
    [persist]
  );

  const resetContent = React.useCallback(async () => {
    setContent(defaultContent);
    await persist(defaultContent);
  }, [persist]);

  const value = React.useMemo(
    () => ({ content, updateContent, resetContent, storageError, loading }),
    [content, updateContent, resetContent, storageError, loading]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = React.useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside a ContentProvider");
  return ctx;
}