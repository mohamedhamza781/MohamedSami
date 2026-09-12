import * as React from "react";

// ---------------------------------------------------------------------------
// LanguageContext — controls which language the PUBLIC site renders in, and
// therefore its text direction. This only affects the public-facing pages
// (Home / Navbar / Footer / etc.) — the Admin Dashboard's own interface
// stays in English/LTR regardless, since it's an internal tool; the
// dashboard has its own separate "which language am I editing" toggle
// (see AdminDashboard.jsx) that reads/writes the same bilingual content but
// doesn't need to flip its own layout.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "varelle_language";
const LanguageContext = React.createContext(null);

export const SUPPORTED_LANGUAGES = {
  en: { label: "English", direction: "ltr" },
  ar: { label: "العربية", direction: "rtl" },
};

function loadInitialLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES[stored]) return stored;
  } catch {
    // ignore storage errors — fall through to default
  }
  return "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = React.useState(loadInitialLanguage);

  const setLanguage = React.useCallback((next) => {
    if (!SUPPORTED_LANGUAGES[next]) return;
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors — the in-memory switch still works this visit
    }
  }, []);

  const toggleLanguage = React.useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === "en" ? "ar" : "en";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const direction = SUPPORTED_LANGUAGES[language].direction;

  const value = React.useMemo(
    () => ({ language, direction, setLanguage, toggleLanguage }),
    [language, direction, setLanguage, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside a LanguageProvider");
  return ctx;
}