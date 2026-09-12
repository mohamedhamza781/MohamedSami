import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { useAuth } from "../context/AuthContext";
import { tokens } from "../theme";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
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
        Checking session…
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}