import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { tokens } from "../theme";
import { PillButton, TextLink } from "./Button";
import { Caption } from "./Typography";
import { Rule } from "./Layout";
import { useContent } from "../context/ContentContext";

// Section ids that the header/footer navigation scrolls to. Keeping this in
// one place means Navbar and Footer always agree on where "Work", "About",
// "Services" and "Inquire" point.
const SECTION_IDS = {
  Work: "work",
  About: "about",
  Services: "services",
  Inquire: "inquire",
};

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Navbar — fixed to the viewport top so it stays visible while the page
 * scrolls beneath it. A soft dark-to-transparent gradient (no blur, no
 * hard edge) keeps its (always `onDark`/light) text legible without ever
 * reading as a "bar" sitting on the page. Pass `links` to override the
 * defaults.
 */
export function Navbar({
  links = ["Work", "About", "Services"],
  onInquire,
  color = tokens.color.onDark,
}) {
  const { content } = useContent();
  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        height: 130,
        display: "flex",
        alignItems: "flex-start",
        pt: "24px",
        backgroundImage: tokens.gradients.navbar,
        pointerEvents: "none",
        "& > *": { pointerEvents: "auto" },
      }}
    >
      <Container maxWidth="xxl" sx={{ width: "100%" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            sx={{ fontSize: 13, letterSpacing: "2px", color }}
          >
            {content.brand.name}
          </Link>
          <Stack direction="row" spacing={4} sx={{ display: { xs: "none", md: "flex" } }}>
            {links.map((l) => (
              <TextLink
                key={l}
                href={`#${SECTION_IDS[l] ?? l.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(SECTION_IDS[l] ?? l.toLowerCase());
                }}
                sx={{ color }}
              >
                {l.toUpperCase()}
              </TextLink>
            ))}
          </Stack>
          <PillButton
            onClick={onInquire ?? (() => scrollToSection("inquire"))}
            sx={{ borderColor: color, color, textTransform: "uppercase" }}
          >
            Inquire ↗
          </PillButton>
        </Stack>
      </Container>
    </Box>
  );
}

/**
 * Footer — sits flush with the page canvas (no inversion): ink-colored
 * headings on the same light background as the rest of the system.
 * `columns` lets you pass your own link groups (MENU / SOCIAL / CONTACT
 * read best); the bottom hairline row carries the copyright + credit,
 * a region label, and a "Top ↑" back-to-top link.
 */
export function Footer({
  developer = "Mohamed Faik Alnazly",
  developerUrl = "https://portifolio-ylii.onrender.com/",
}) {
  const { content } = useContent();
  const { contact, brand } = content;

  const columns = [
    {
      title: "MENU",
      items: ["Work", "About", "Services", "Inquire"].map((l) => ({
        label: l,
        onClick: (e) => {
          e.preventDefault();
          scrollToSection(SECTION_IDS[l]);
        },
        href: `#${SECTION_IDS[l]}`,
      })),
    },
    {
      title: "SOCIAL",
      items: [
        { label: "Instagram", href: contact.instagram, external: true },
        { label: "Pinterest", href: contact.pinterest, external: true },
      ],
    },
    {
      title: "CONTACT",
      items: [
        { label: contact.email, href: `mailto:${contact.email}` },
        { label: contact.location },
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: tokens.color.canvas, color: tokens.color.primary, py: { xs: 8, md: "104px" } }}>
      <Container maxWidth="xxl">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                fontSize: { xs: 32, md: 42 },
                lineHeight: 1,
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              {brand.name}
            </Box>
            <Box
              sx={{
                fontSize: 12,
                mt: 2,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: tokens.color.muted,
              }}
            >
              {brand.footerTagline}
            </Box>
          </Grid>
          {columns.map((col) => (
            <Grid item xs={6} md={2} key={col.title}>
              <Caption sx={{ display: "block", mb: 1.5, color: tokens.color.muted }}>
                {col.title}
              </Caption>
              {col.items.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={item.onClick}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    underline="none"
                    sx={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                      py: 0.5,
                      color: tokens.color.primary,
                      "&:hover": { color: tokens.color.muted },
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Box
                    key={item.label}
                    sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.3px", py: 0.5, color: tokens.color.primary }}
                  >
                    {item.label}
                  </Box>
                )
              )}
            </Grid>
          ))}
        </Grid>

        <Rule sx={{ my: 5, borderColor: "rgba(25,25,23,0.1)" }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1.5, sm: 2 }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box sx={{ fontSize: 11, letterSpacing: "0.6px", color: tokens.color.muted }}>
            © {new Date().getFullYear()} {brand.name}
            {developer && (
              <>
                {" "}
                ·{" "}
                <Link
                  href={developerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{ color: tokens.color.muted, "&:hover": { color: tokens.color.primary } }}
                >
                  Developed by {developer}
                </Link>
              </>
            )}
          </Box>

          <Box
            sx={{
              fontSize: 11,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: tokens.color.muted,
            }}
          >
            {contact.region}
          </Box>

          <Stack direction="row" spacing={3} alignItems="center">
            <Link
              component={RouterLink}
              to="/login"
              underline="none"
              sx={{
                fontSize: 11,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: tokens.color.muted,
                "&:hover": { color: tokens.color.primary },
              }}
            >
              Admin
            </Link>

            <Link
              href="#top"
              underline="none"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: 11,
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: tokens.color.muted,
                cursor: "pointer",
                "&:hover": { color: tokens.color.primary },
              }}
            >
              Top ↑
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}