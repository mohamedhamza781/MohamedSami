import * as React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Fragment } from "react";
import { Eyebrow, Display, Body, Caption } from "./Typography";
import { Section, Rule } from "./Layout";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { tokens } from "../theme";
import { useLanguage } from "../context/LanguageContext";

/**
 * ServiceList — numbered rows (n / title / description). Pass `items` as
 * `[{ n, title, copy, image }]`. On hover (desktop) a thumbnail slides in
 * from the right, just before the arrow, and the arrow kicks outward.
 */
export function ServiceList({ index = "03 / Services", title, items = [] }) {
  const { direction } = useLanguage();
  const arrow = direction === "rtl" ? "↖" : "↗";
  return (
    <Section>
      <Eyebrow>{index}</Eyebrow>
      <Display size="sm" sx={{ mt: 1, maxWidth: 640 }}>
        {title}
      </Display>

      <Stack sx={{ mt: 6 }}>
        {items.map((s, i) => (
          <Fragment key={s.n}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 1, md: 4 }}
              alignItems={{ md: "center" }}
              sx={{
                py: 1.75,
                cursor: "pointer",
                "&:hover .service-thumb": {
                  width: { md: 64 },
                  opacity: 1,
                  marginLeft: { md: "24px" },
                },
                "&:hover .service-arrow": {
                  transform: "translate(3px, -3px)",
                  color: tokens.color.primary,
                },
              }}
            >
              <Caption sx={{ width: 48, flexShrink: 0 }}>{s.n}</Caption>
              <Body sx={{ fontSize: 20, color: "inherit", width: { md: 260 }, flexShrink: 0 }}>
                {s.title}
              </Body>
              <Body sx={{ fontSize: 15, flexGrow: 1 }}>{s.copy}</Body>

              {/* Thumbnail — always visible on mobile (no hover exists on
                  touch, so hiding it there would mean the photo never
                  shows at all); on desktop it stays collapsed until the
                  row is hovered, as before. */}
              <Box
                className="service-thumb"
                sx={{
                  width: { xs: "100%", md: 0 },
                  height: { xs: 160, md: 72 },
                  opacity: { xs: 1, md: 0 },
                  mt: { xs: 1, md: 0 },
                  ml: 0,
                  overflow: "hidden",
                  flexShrink: 0,
                  transition:
                    "width 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, margin-left 0.45s cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                <ImagePlaceholder
                  src={s.image}
                  label={null}
                  aspect="auto"
                  sx={{ width: "100%", height: { xs: 160, md: 72 } }}
                />
              </Box>

              <Box
                className="service-arrow"
                sx={{
                  flexShrink: 0,
                  fontSize: 16,
                  color: tokens.color.muted,
                  transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), color 0.35s ease",
                }}
              >
                {arrow}
              </Box>
            </Stack>
            {i < items.length - 1 && <Rule />}
          </Fragment>
        ))}
      </Stack>
    </Section>
  );
}

/**
 * ProcessSteps — a 4-up (responsive) numbered step grid. Pass `items` as
 * `[{ n, title, copy }]`.
 */
export function ProcessSteps({ index = "04 / Process", title, items = [] }) {
  return (
    <Section>
      <Eyebrow>{index}</Eyebrow>
      <Display size="sm" sx={{ mt: 1, maxWidth: 480 }}>
        {title}
      </Display>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {items.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.n}>
            <Caption>{s.n}</Caption>
            <Body sx={{ fontSize: 20, mt: 1, color: "inherit" }}>{s.title}</Body>
            <Body sx={{ fontSize: 14, mt: 1 }}>{s.copy}</Body>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}