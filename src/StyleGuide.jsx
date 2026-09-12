import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { tokens } from "./theme";
import { Eyebrow, Display, Body, Caption } from "./components/Typography";
import { PillButton, TextLink } from "./components/Button";
import { Section, Rule, ColorSwatch } from "./components/Layout";
import { Navbar, Footer } from "./components/Chrome";

const colors = [
  { name: "Canvas", hex: tokens.color.canvas },
  { name: "Primary", hex: tokens.color.primary },
  { name: "Body", hex: tokens.color.body },
  { name: "Muted", hex: tokens.color.muted },
  { name: "Link", hex: tokens.color.link },
  { name: "Dark", hex: tokens.color.dark },
  { name: "On Dark", hex: tokens.color.onDark },
];

const spacingEntries = Object.entries(tokens.spacing);

export default function StyleGuide() {
  return (
    <Box sx={{ bgcolor: tokens.color.canvas, minHeight: "100vh" }}>
      <Navbar color={tokens.color.primary} />

      {/* ---- Intro ---- */}
      <Section spacing="band">
        <Eyebrow>Varelle / Design system</Eyebrow>
        <Display size="lg" sx={{ mt: 2 }}>
          Tokens, not templates.
        </Display>
        <Body sx={{ mt: 3, maxWidth: 560 }}>
          This page renders every measured token and component directly —
          colors, type scale, spacing ladder, gradients, and the two system
          components (Navbar / Footer) — so the system can be reviewed on
          its own, without stand-in photography.
        </Body>
      </Section>

      <Rule />

      {/* ---- Color ---- */}
      <Section>
        <Eyebrow>Color</Eyebrow>
        <Display size="sm" sx={{ mt: 1, mb: 4 }}>
          Palette
        </Display>
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
          {colors.map((c) => (
            <ColorSwatch key={c.name} {...c} />
          ))}
        </Stack>
      </Section>

      <Rule />

      {/* ---- Typography ---- */}
      <Section>
        <Eyebrow>Typography</Eyebrow>
        <Display size="sm" sx={{ mt: 1, mb: 4 }}>
          Type scale
        </Display>
        <Stack spacing={3}>
          <Box>
            <Display size="lg">Display / lg</Display>
            <Caption>96px · Inter Variable 400 · -1.15px tracking</Caption>
          </Box>
          <Box>
            <Display size="md">Display / md</Display>
            <Caption>68px · Inter Variable 400</Caption>
          </Box>
          <Box>
            <Display size="sm">Display / sm</Display>
            <Caption>42px · Inter Variable 400</Caption>
          </Box>
          <Box>
            <Body sx={{ maxWidth: 480 }}>
              Body / lg — 17px, 1.58 line-height. Used for prose and
              descriptive copy throughout the system.
            </Body>
          </Box>
          <Box>
            <Eyebrow>Eyebrow / caption-sm — 12px tracked uppercase label</Eyebrow>
          </Box>
        </Stack>
      </Section>

      <Rule />

      {/* ---- Spacing ---- */}
      <Section>
        <Eyebrow>Spacing</Eyebrow>
        <Display size="sm" sx={{ mt: 1, mb: 4 }}>
          Spacing ladder
        </Display>
        <Stack spacing={1.5}>
          {spacingEntries.map(([name, px]) => (
            <Stack direction="row" alignItems="center" spacing={2} key={name}>
              <Caption sx={{ width: 80 }}>{name}</Caption>
              <Box sx={{ width: px, height: 12, bgcolor: tokens.color.body }} />
              <Caption>{px}px</Caption>
            </Stack>
          ))}
        </Stack>
      </Section>

      <Rule />

      {/* ---- Gradients ---- */}
      <Section>
        <Eyebrow>Elevation</Eyebrow>
        <Display size="sm" sx={{ mt: 1, mb: 4 }}>
          Gradient overlays
        </Display>
        <Grid container spacing={3}>
          {Object.entries(tokens.gradients).map(([name, value]) => (
            <Grid item xs={12} sm={6} md={3} key={name}>
              <Box
                sx={{
                  height: 140,
                  backgroundColor: tokens.color.canvas,
                  backgroundImage: value,
                }}
              />
              <Caption sx={{ display: "block", mt: 1 }}>{name}</Caption>
            </Grid>
          ))}
        </Grid>
      </Section>

      <Rule />

      {/* ---- Components ---- */}
      <Section>
        <Eyebrow>Components</Eyebrow>
        <Display size="sm" sx={{ mt: 1, mb: 4 }}>
          Buttons & links
        </Display>
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" useFlexGap>
          <PillButton>Inquire</PillButton>
          <PillButton variant="filled">Start your inquiry</PillButton>
          <TextLink href="#">VIEW THE WORK →</TextLink>
        </Stack>
      </Section>

      <Footer />
    </Box>
  );
}