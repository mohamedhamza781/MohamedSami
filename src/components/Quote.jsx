import * as React from "react";
import Box from "@mui/material/Box";
import { Display, Caption } from "./Typography";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Section } from "./Layout";

/** PullQuote — centered statement with a framed image beneath it. */
export function PullQuote({ children, caption, image }) {
  return (
    <Section maxWidth="md" sx={{ textAlign: "center" }}>
      <Display size="sm">{children}</Display>
      <Box sx={{ mt: 6, mx: "auto", width: { xs: "100%", md: "60%" } }}>
        <ImagePlaceholder label="framed photo" aspect="4 / 3" src={image} />
      </Box>
      {caption && <Caption sx={{ display: "block", mt: 2 }}>{caption}</Caption>}
    </Section>
  );
}

/** Testimonial — a single centered quote, with an optional name + meta attribution below it. */
export function Testimonial({ children, name, meta }) {
  return (
    <Section maxWidth="md" spacing="xl" sx={{ textAlign: "center", pb: { xs: 3, md: 4 } }}>
      <Box sx={{ fontSize: { xs: 26, md: 34 }, lineHeight: 1.3 }}>&ldquo;{children}&rdquo;</Box>
      {(name || meta) && (
        <Box sx={{ mt: 4 }}>
          {name && (
            <Box sx={{ fontSize: 12, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              {name}
            </Box>
          )}
          {meta && <Caption sx={{ display: "block", mt: 0.5 }}>{meta}</Caption>}
        </Box>
      )}
    </Section>
  );
}