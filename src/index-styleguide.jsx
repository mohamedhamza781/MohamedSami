import * as React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";
import StyleGuide from "./StyleGuide";
import { ContentProvider } from "./context/ContentContext";
import { LanguageProvider } from "./context/LanguageContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <ContentProvider>
          <BrowserRouter>
            <StyleGuide />
          </BrowserRouter>
        </ContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);