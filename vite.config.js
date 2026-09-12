import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ---------------------------------------------------------------------------
// PERFORMANCE: manualChunks splits large, rarely-changing vendor code
// (React, MUI, Supabase, the router) into its own file, separate from our
// own application code. Browsers then cache that vendor chunk with a
// long-lived, content-hashed filename and only need to re-download it when
// a dependency actually changes — app code changes (which happen far more
// often) no longer invalidate it.
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // A single vendor chunk for all third-party code. Splitting React
        // and MUI into separate chunks looks appealing on paper, but they
        // reference each other internally and Rollup ends up emitting a
        // circular chunk (a real correctness risk, not just a warning) —
        // so they're kept together. This still gets the main win: vendor
        // code (which rarely changes) is cached separately from our own
        // app code (which changes on every deploy).
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "@mui/material", "@emotion/react", "@emotion/styled", "@supabase/supabase-js"],
        },
      },
    },
  },
});