import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { tokens } from "../theme";
import { Eyebrow, Display, Body, Caption } from "./Typography";
import { TextLink, PillButton } from "./Button";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { Section } from "./Layout";
import { useLanguage } from "../context/LanguageContext";

/**
 * MomentBand — full-bleed dark image band with a single caption line. The
 * photo starts slightly zoomed in and eases down to its resting scale the
 * first time the band scrolls into view, giving it a subtle "settling in"
 * feel rather than popping in flat.
 */
export function MomentBand({ caption = "Moments, not poses.", image }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} sx={{ position: "relative", height: { xs: 380, md: 560 }, overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          transform: visible ? "scale(1)" : "scale(1.14)",
          transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
          willChange: "transform",
        }}
      >
        <ImagePlaceholder label="moment photo" aspect="auto" src={image} sx={{ height: "100%" }} />
      </Box>
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: tokens.gradients.sectionFadeUp }} />
      <Container maxWidth="xxl" sx={{ position: "relative", height: "100%" }}>
        <Stack justifyContent="flex-end" sx={{ height: "100%", pb: 5 }}>
          <Eyebrow sx={{ color: tokens.color.onDark }}>{caption}</Eyebrow>
        </Stack>
      </Container>
    </Box>
  );
}

/**
 * StudioAbout — portrait + heading/prose split, with a two-row stat grid
 * and a "more about" link. Pass `paragraphs` as an array of strings (each
 * renders as its own block), `imageCaption` for the small credit line
 * under the portrait, and `stats` as `[{ label, value }]` (six items read
 * best, laid out three per row).
 */
export function StudioAbout({
  index = "05 / The studio",
  title,
  paragraphs = [],
  image,
  imageCaption,
  stats = [],
  linkLabel = "MORE ABOUT VARELLE",
  href = "#about",
}) {
  const { direction } = useLanguage();
  const arrow = direction === "rtl" ? "←" : "→";
  return (
    <Section spacing="band">
      <Eyebrow>{index}</Eyebrow>
      <Grid container spacing={{ xs: 4, md: 8 }} sx={{ mt: 2 }}>
        <Grid item xs={12} md={5}>
          <ImagePlaceholder label="studio portrait" aspect="4 / 5" src={image} />
          {imageCaption && (
            <Caption sx={{ display: "block", mt: 2 }}>{imageCaption}</Caption>
          )}
        </Grid>
        <Grid item xs={12} md={7}>
          {title && (
            <Display size="sm" sx={{ maxWidth: 560 }}>
              {title}
            </Display>
          )}
          <Stack spacing={3} sx={{ mt: title ? 4 : 0, maxWidth: 540 }}>
            {paragraphs.map((p, i) => (
              <Body key={i}>{p}</Body>
            ))}
          </Stack>

          <Box sx={{ borderTop: "1px solid rgba(25,25,23,0.12)", mt: 5, pt: 4 }}>
            <Grid container rowSpacing={3} columnSpacing={4}>
              {stats.map((s) => (
                <Grid item xs={6} sm={4} key={s.label}>
                  <Caption>{s.label}</Caption>
                  <Box sx={{ mt: 0.5 }}>{s.value}</Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Link
            href={href}
            underline="none"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              mt: 4,
              fontSize: 12,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: tokens.color.primary,
              cursor: "pointer",
              "& .studio-arrow": {
                transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
              },
              "&:hover .studio-arrow": {
                transform: "translateX(4px)",
              },
            }}
          >
            {linkLabel}
            <Box component="span" className="studio-arrow" sx={{ fontSize: 15, lineHeight: 1 }}>
              {arrow}
            </Box>
          </Link>
        </Grid>
      </Grid>
    </Section>
  );
}

/**
 * Filmstrip — a full-bleed, continuously auto-scrolling row of image
 * frames ("fragments" gallery). Images loop seamlessly and drift right-
 * to-left on their own; hovering the strip pauses it so a frame can
 * actually be looked at. Pass `images` as an array (5–8 reads best).
 */
export function Filmstrip({
  index = "06 / Fragments",
  note,
  images = [],
}) {
  const track = images.length ? [...images, ...images] : [];
  return (
    <Box sx={{ py: { xs: 3, md: 4 } }}>
      <Container maxWidth="xxl">
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Eyebrow>{index}</Eyebrow>
          {note && <Eyebrow sx={{ display: { xs: "none", sm: "block" } }}>{note}</Eyebrow>}
        </Stack>
      </Container>

      <Box
        sx={{
          overflow: "hidden",
          width: "100%",
          "&:hover .filmstrip-track": { animationPlayState: "paused" },
        }}
      >
        <Box
          className="filmstrip-track"
          sx={{
            display: "flex",
            gap: "6px",
            width: "max-content",
            animation: `filmstrip-scroll ${Math.max(images.length * 6, 24)}s linear infinite`,
            "@keyframes filmstrip-scroll": {
              from: { transform: "translateX(0)" },
              to: { transform: "translateX(-50%)" },
            },
          }}
        >
          {track.map((src, i) => (
            <Box key={i} sx={{ width: { xs: 220, md: 264 }, flexShrink: 0 }}>
              <ImagePlaceholder
                label={`frame ${(i % images.length) + 1}`}
                aspect="3 / 4"
                src={src}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * ClosingCTA — full-bleed dark photo band with a large closing statement,
 * a short availability line, a "Start a conversation" text CTA, and a
 * hairline-divided three-column contact strip (email / response time /
 * enquiry window). This is the system's one deliberately inverted section
 * (`onDark` text over a darkened photo).
 */
export function ClosingCTA({
  children,
  tagline = "Available for selected weddings in Europe and worldwide.",
  ctaLabel = "Start a conversation",
  href = "#inquire",
  image,
  meta = [
    { label: "Email", value: "hello@varelle.studio" },
    { label: "Response", value: "Within two working days" },
    { label: "Enquiries for", value: "2026 & 2027" },
  ],
}) {
  const { direction } = useLanguage();
  const arrow = direction === "rtl" ? "←" : "→";
  return (
    <Box sx={{ position: "relative", py: { xs: 10, md: 16 } }}>
      <Box sx={{ position: "absolute", inset: 0 }}>
        <ImagePlaceholder label="closing photo" aspect="auto" src={image} sx={{ height: "100%" }} />
      </Box>
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: tokens.gradients.sectionSolid }} />

      <Container maxWidth="xxl" sx={{ position: "relative", color: tokens.color.onDark }}>
        <Box sx={{ maxWidth: 620 }}>
          <Box
            sx={{
              fontSize: { xs: 36, md: 56 },
              lineHeight: 1,
              letterSpacing: "-1.5px",
              textTransform: "uppercase",
            }}
          >
            {children}
          </Box>

          {tagline && (
            <Body sx={{ mt: 3, maxWidth: 360, fontSize: 14, color: tokens.color.onDark, opacity: 0.7 }}>
              {tagline}
            </Body>
          )}

          <Link
            href={href}
            underline="none"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              mt: 4,
              pb: 3,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: tokens.color.onDark,
              cursor: "pointer",
              "& .cta-arrow": {
                transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
              },
              "&:hover .cta-arrow": {
                transform: "translateX(4px)",
              },
            }}
          >
            {ctaLabel}
            <Box component="span" className="cta-arrow" sx={{ fontSize: 14, lineHeight: 1 }}>
              {arrow}
            </Box>
          </Link>

          <Box sx={{ borderTop: `1px solid ${tokens.color.onDark}33`, pt: 3 }}>
            <Grid container spacing={4}>
              {meta.map((m) => (
                <Grid item xs={12} sm={4} key={m.label}>
                  <Caption sx={{ color: `${tokens.color.onDark}99` }}>{m.label}</Caption>
                  <Box sx={{ mt: 0.5, fontSize: 13, fontWeight: 600, color: tokens.color.onDark }}>
                    {m.value}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}