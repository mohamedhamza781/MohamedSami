import * as React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "./theme";
import { cacheLtr, cacheRtl } from "./emotionCache";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import App from "./App";

// ThemedApp reads the active language/direction and rebuilds the MUI theme
// + emotion cache to match — this is what actually makes the whole public
// site flip to RTL (and swap fonts) when the language toggle changes. It
// has to live *inside* LanguageProvider (so it can read the language) but
// *outside* App (so the direction-aware theme wraps everything, including
// the Admin Dashboard's own always-LTR pages — MUI's `direction` only
// affects layout, and pages that don't want it can opt out per-component
// if ever needed).
function ThemedApp() {
  const { direction, language } = useLanguage();
  const theme = React.useMemo(() => createAppTheme(direction), [direction]);
  const cache = direction === "rtl" ? cacheRtl : cacheLtr;

  React.useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemedApp />
    </LanguageProvider>
  </React.StrictMode>
);