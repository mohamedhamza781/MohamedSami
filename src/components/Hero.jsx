import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { tokens } from "../theme";
import { Eyebrow, Body } from "./Typography";
import { TextLink } from "./Button";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { useLanguage } from "../context/LanguageContext";

/**
 * Hero — full-bleed opening band: brand mark, tagline, and primary CTAs
 * over a photo (or the system placeholder). Gradient overlay uses the
 * measured `tokens.gradients.hero` value. A hairline mid-row (`region` /
 * "Scroll") sits roughly two-thirds down, above the closing brand block.
 */
export function Hero({
  brand = "",
  eyebrow = "",
  tagline = "",
  region = "",
  scrollLabel = "Scroll",
  workCtaLabel = "View the work",
  inquireLabel = "Inquire",
  cvUrl = "",
  cvLabel = "Download CV",
  image,
  video,
}) {
  const { direction } = useLanguage();
  const arrow = direction === "rtl" ? "←" : "→";
  const navLinkSx = {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
  };

  return (
    <Box sx={{ position: "relative", height: { xs: 560, md: 760 } }}>
      <Box sx={{ position: "absolute", inset: 0 }}>
        {video ? (
          <Box
            component="video"
            src={video}
            autoPlay
            muted
            loop
            playsInline
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImagePlaceholder label="hero photo" aspect="auto" src={image} sx={{ height: "100%" }} priority />
        )}
      </Box>
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: tokens.gradients.hero }} />

      {/* mid-row: region label / scroll cue, on a full-width hairline */}
      <Box sx={{ position: "absolute", left: 0, right: 0, top: { xs: "58%", md: "63%" } }}>
        <Container maxWidth="xxl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ borderTop: `1px solid ${tokens.color.onDark}4D`, pt: 2 }}
          >
            <Eyebrow sx={{ color: tokens.color.onDark }}>{region}</Eyebrow>
            <Eyebrow
              component="a"
              href="#discover"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("discover")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              sx={{ color: tokens.color.onDark, textDecoration: "none", cursor: "pointer" }}
            >
              {scrollLabel} ↓
            </Eyebrow>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="xxl"
        sx={{ position: "relative", height: "100%", pointerEvents: "none" }}
      >
        <Stack
          justifyContent="flex-end"
          sx={{ height: "100%", pb: { xs: 5, md: 7 }, pointerEvents: "none" }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "flex-end" }}
            spacing={3}
            sx={{ pointerEvents: "auto" }}
          >
            <Box>
              <Box
                sx={{
                  fontSize: { xs: 42, md: 68, xl: 96 },
                  lineHeight: 0.95,
                  letterSpacing: "-1.5px",
                  textTransform: "uppercase",
                  color: tokens.color.onDark,
                }}
              >
                {brand}
              </Box>
              <Eyebrow sx={{ mt: 1, color: tokens.color.onDark }}>{eyebrow}</Eyebrow>
            </Box>
            <Stack direction="row" spacing={4} alignItems="center">
              <Body sx={{ maxWidth: 220, fontSize: 14, color: tokens.color.onDark }}>{tagline}</Body>
              <TextLink href="#work" sx={{ color: tokens.color.onDark, ...navLinkSx }}>
                {workCtaLabel} {arrow}
              </TextLink>
              <TextLink href="#inquire" sx={{ color: tokens.color.onDark, ...navLinkSx }}>
                {inquireLabel}
              </TextLink>
              {cvUrl && (
                <TextLink
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  sx={{ color: tokens.color.onDark, ...navLinkSx }}
                >
                  {cvLabel} ↓
                </TextLink>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}