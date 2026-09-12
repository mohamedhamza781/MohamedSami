import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import { ContentProvider } from "./context/ContentContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { tokens } from "./theme";
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
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
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