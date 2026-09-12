import { createTheme } from "@mui/material/styles";

// ---------------------------------------------------------------------------
// Design tokens lifted directly from the Varelle design-system spec.
// Canvas is a warm off-white, primary ink is near-black, body copy is a
// warm grey, everything else recedes. `dark` / `onDark` are the inverted
// pair used for full-bleed dark bands (hero photo, closing CTA) that sit
// on top of the otherwise light system. No border-radius anywhere except
// the 100px pill used on CTA links.
// ---------------------------------------------------------------------------

export const tokens = {
  color: {
    canvas: "#F4F4F2",
    primary: "#191917",
    body: "#80807E",
    muted: "#8E8E8C",
    link: "#0000EE",
    dark: "#101010",
    onDark: "#F4F4F2",
  },
  spacing: {
    xxs: 8,
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
    xxxl: 36,
    section: 40,
    band: 44,
  },
  gradients: {
    navbar:
      "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0) 100%)",
    hero:
      "linear-gradient(rgba(15,15,15,0.52) 0%, rgba(15,15,15,0.12) 32%, rgba(15,15,15,0.22) 60%, rgba(15,15,15,0.68) 100%)",
    sectionFadeDown:
      "linear-gradient(rgba(10,10,10,0.52) 0%, rgba(10,10,10,0.3) 62%, rgba(10,10,10,0) 100%)",
    sectionFadeUp:
      "linear-gradient(rgba(14,14,14,0.28) 0%, rgba(14,14,14,0.16) 42%, rgba(14,14,14,0.76) 100%)",
    sectionSolid:
      "linear-gradient(rgba(19,19,19,0.46) 0%, rgba(19,19,19,0.78) 100%)",
  },
};

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: tokens.color.canvas,
      paper: tokens.color.canvas,
    },
    primary: {
      main: tokens.color.primary,
      contrastText: tokens.color.canvas,
    },
    text: {
      primary: tokens.color.primary,
      secondary: tokens.color.body,
      disabled: tokens.color.muted,
    },
    divider: "rgba(25,25,23,0.12)",
    // "link" isn't a default MUI palette key, so it's added as a custom
    // extension below and consumed via theme.palette.link.main
  },
  typography: {
    fontFamily: '"Inter Variable", "Inter", sans-serif',
    // Display sizes step 42 -> 68 -> 96 across breakpoints; base values
    // here are the small (mobile) sizes, scaled up via component overrides.
    h1: {
      fontWeight: 400,
      fontSize: "42px",
      lineHeight: 0.95,
      letterSpacing: "-1.15px",
    },
    h2: {
      fontWeight: 400,
      fontSize: "44px",
      lineHeight: 1.28,
      letterSpacing: "-1.06px",
    },
    h3: {
      fontWeight: 400,
      fontSize: "24px",
      lineHeight: 1.25,
      letterSpacing: "-0.38px",
    },
    body1: {
      fontWeight: 400,
      fontSize: "17px",
      lineHeight: 1.58,
      letterSpacing: "0px",
      color: tokens.color.body,
    },
    body2: {
      fontWeight: 400,
      fontSize: "15px",
      lineHeight: 1.4,
      letterSpacing: "3.3px",
      textTransform: "uppercase",
      color: tokens.color.muted,
    },
    caption: {
      fontWeight: 400,
      fontSize: "11px",
      lineHeight: 1.2,
      letterSpacing: "1.65px",
      textTransform: "uppercase",
      color: tokens.color.muted,
    },
    button: {
      fontWeight: 400,
      fontSize: "12px",
      letterSpacing: "0.84px",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 0, // sharp by default; pills are opted into explicitly
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1440,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          padding: "12px 22px",
          textTransform: "none",
          fontSize: "12px",
          letterSpacing: "0.84px",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: tokens.color.link,
          textDecoration: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          backgroundColor: tokens.color.canvas,
          color: tokens.color.primary,
        },
        // Respect the OS-level "reduce motion" setting: collapse every
        // animation/transition to effectively instant and drop smooth
        // scrolling, instead of forcing motion on people who've explicitly
        // asked their system to avoid it. This is an accessibility
        // requirement (WCAG 2.3.3) and, as a side effect, removes a good
        // amount of animation-driven layout/paint work for those users.
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": {
            animationDuration: "0.01ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "0.01ms !important",
            scrollBehavior: "auto !important",
          },
        },
      },
    },
  },
});

export default theme;