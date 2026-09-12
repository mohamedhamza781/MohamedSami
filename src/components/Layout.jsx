import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { tokens } from "../theme";

/**
 * Section — the standard vertical-rhythm wrapper. `spacing` picks from the
 * measured spacing ladder ("section" = 40px default, "band" = 44px for
 * major breaks).
 */
export function Section({ children, spacing = "section", maxWidth = "xxl", sx, ...props }) {
  const py = tokens.spacing[spacing] ?? tokens.spacing.section;
  return (
    <Container maxWidth={maxWidth} sx={{ py: { xs: py * 0.7, md: py * 1.3 }, ...sx }} {...props}>
      {children}
    </Container>
  );
}

/** Rule — a hairline divider at the system's measured 12% opacity. */
export function Rule({ sx, ...props }) {
  return <Divider sx={{ borderColor: "rgba(25,25,23,0.12)", ...sx }} {...props} />;
}

/**
 * ColorSwatch — a labeled color chip, used by the style-guide page and
 * useful anywhere a token needs to be shown rather than photography.
 */
export function ColorSwatch({ name, hex }) {
  return (
    <Box sx={{ width: 140 }}>
      <Box
        sx={{
          width: "100%",
          height: 88,
          bgcolor: hex,
          border: "1px solid rgba(25,25,23,0.15)",
        }}
      />
      <Box sx={{ mt: 1, fontSize: 12 }}>{name}</Box>
      <Box sx={{ fontSize: 11, color: tokens.color.muted }}>{hex}</Box>
    </Box>
  );
}