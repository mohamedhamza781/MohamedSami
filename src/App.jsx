import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { ContentProvider } from "./context/ContentContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { tokens, createAppTheme } from "./theme";
import { cacheLtr } from "./emotionCache";
import Home from "./pages/Home";

// ---------------------------------------------------------------------------
// App — top-level router. `/` is the public marketing site, `/login` is the
// admin sign-in page, and `/admin` is the protected dashboard used to edit
// the site's content (hero tagline, approach copy, the studio profile
// section, contact details). ContentProvider/AuthProvider wrap everything so
// both the public site and the dashboard share the same live content.
//
// PERFORMANCE: Home is imported eagerly since it's what almost every visitor
// loads first. Login and AdminDashboard are code-split with React.lazy —
// they pull in extra form/accordion UI that the public site never needs, so
// keeping them out of the main bundle measurably shrinks the JS a first-time
// visitor has to download and parse before the homepage is interactive.
// ---------------------------------------------------------------------------

const Login = React.lazy(() => import("./pages/Login"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

// The public site's language toggle can switch the whole app's theme to
// RTL — but /login and /admin are an internal tool with English-only
// labels, so forcing them to always render LTR (regardless of whatever
// the public toggle is currently set to) avoids an English interface
// sitting in a mirrored, RTL-flowing layout. The bilingual *content* being
// edited is unaffected — this only pins the dashboard's own layout.
//
// Both the theme's `direction` AND the emotion cache need to be
// overridden here — the cache is what actually flips physical CSS
// properties (margin-left/padding-right/etc.) via the RTL stylis plugin,
// so overriding only the theme while leaving the outer RTL cache active
// would still mirror the dashboard's CSS even with dir="ltr" on the page.
const forcedLtrTheme = createAppTheme("ltr");

function ForceLtr({ children }) {
  return (
    <CacheProvider value={cacheLtr}>
      <ThemeProvider theme={forcedLtrTheme}>
        <Box dir="ltr">{children}</Box>
      </ThemeProvider>
    </CacheProvider>
  );
}

function RouteFallback() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: tokens.color.canvas,
        color: tokens.color.muted,
        fontSize: 13,
        letterSpacing: "1px",
        textTransform: "uppercase",
      }}
    >
      Loading…
    </Box>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <React.Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <ForceLtr>
                    <Login />
                  </ForceLtr>
                }
              />
              <Route
                path="/admin"
                element={
                  <ForceLtr>
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  </ForceLtr>
                }
              />
              <Route path="*" element={<Home />} />
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}