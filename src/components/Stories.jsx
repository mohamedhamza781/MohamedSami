import * as React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Eyebrow, Display, Body, Caption } from "./Typography";
import { TextLink } from "./Button";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Section } from "./Layout";
import { Reveal } from "./Reveal";
import { tokens } from "../theme";

/**
 * Intro — large statement + supporting paragraph + "about" link, used right
 * under the hero. Maps to the "01 / Approach" block in the reference
 * design: heading on the left, a short paragraph and an underlined link
 * (with an arrow that nudges right on hover) stacked on the right. Each
 * piece reveals in on its own light stagger as it scrolls into view.
 */
export function Intro({
  index = "01 / Approach",
  statement = "Quietly documenting the moments that deserve to be remembered.",
  description,
  linkLabel = "ABOUT VARELLE",
  href = "#about",
}) {
  return (
    <Section id="discover" sx={{ scrollMarginTop: "110px" }}>
      <Reveal>
        <Eyebrow>{index}</Eyebrow>
      </Reveal>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={7}>
          <Reveal delay={0.08}>
            <Display size="sm">{statement}</Display>
          </Reveal>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <Reveal delay={0.16}>
            <Box>
              {description && (
                <Body sx={{ fontSize: 17 }}>{description}</Body>
              )}
              <Link
                href={href}
                underline="none"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  mt: description ? 4 : 0,
                  pb: "6px",
                  fontSize: 12,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  color: tokens.color.primary,
                  borderBottom: `1px solid ${tokens.color.primary}`,
                  "& .intro-arrow": {
                    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
                  },
                  "&:hover .intro-arrow": {
                    transform: "translateX(4px)",
                  },
                }}
              >
                {linkLabel}
                <Box component="span" className="intro-arrow" sx={{ fontSize: 15, lineHeight: 1 }}>
                  →
                </Box>
              </Link>
            </Box>
          </Reveal>
        </Grid>
      </Grid>
    </Section>
  );
}

/**
 * StoryCard — a single portfolio entry: image slot + title + meta row.
 * The image sits inside a clipped frame and scales up slightly on hover.
 */
export function StoryCard({ title, meta, image, aspect = "4 / 5" }) {
  return (
    <Box>
      <Box sx={{ overflow: "hidden", "&:hover .story-media": { transform: "scale(1.06)" } }}>
        <ImagePlaceholder
          label={title}
          aspect={aspect}
          src={image}
          className="story-media"
          sx={{ transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </Box>
      <Box sx={{ mt: 2, fontSize: 20 }}>{title}</Box>
      <Caption sx={{ display: "block", mt: 0.5 }}>{meta}</Caption>
    </Box>
  );
}

/**
 * StoryGrid — section header + one full-bleed feature card + a responsive
 * grid of supporting cards. Pass `feature` and `items` (array of
 * `{ title, meta, image }`) to drive content. The feature card and each
 * grid card reveal on their own stagger as they scroll into view.
 */
export function StoryGrid({
  index = "02 / Selected work",
  title = "Recent stories",
  description,
  feature,
  items = [],
}) {
  return (
    <Section>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "flex-end" }}
        spacing={2}
      >
        <Reveal>
          <Box>
            <Eyebrow>{index}</Eyebrow>
            <Display size="sm" sx={{ mt: 1 }}>
              {title}
            </Display>
          </Box>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <Body sx={{ maxWidth: 360, fontSize: 14 }}>{description}</Body>
          </Reveal>
        )}
      </Stack>

      {feature && (
        <Reveal delay={0.12} sx={{ mt: 6 }}>
          <StoryCard {...feature} aspect="16 / 7" />
        </Reveal>
      )}

      <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: 1 }}>
        {items.map((s, i) => (
          <Grid item xs={12} sm={6} key={s.title}>
            <Reveal delay={0.08 * (i % 2)}>
              <StoryCard {...s} />
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}