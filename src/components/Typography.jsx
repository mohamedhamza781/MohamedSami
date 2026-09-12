import * as React from "react";
import Typography from "@mui/material/Typography";
import { tokens } from "../theme";

/**
 * Eyebrow — small tracked-out uppercase label used for section numbers /
 * captions across the system. e.g. "01 / Approach"
 */
export function Eyebrow({ children, sx, ...props }) {
  return (
    <Typography
      component="p"
      sx={{
        fontSize: 12,
        lineHeight: 1,
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        color: tokens.color.muted,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

/**
 * Display — the large headline role. `size` maps to the measured scale:
 * sm (42px) / md (68px) / lg (96px), each responsive by default.
 */
export function Display({ children, size = "md", sx, ...props }) {
  const scale = {
    sm: { xs: 32, md: 42 },
    md: { xs: 36, md: 68 },
    lg: { xs: 42, md: 68, xl: 96 },
  }[size];

  return (
    <Typography
      component="h2"
      sx={{
        fontWeight: 400,
        lineHeight: 0.98,
        letterSpacing: "-1.3px",
        color: tokens.color.primary,
        fontSize: scale,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

/** Body — standard prose role (17px / 1.58 line-height / body color). */
export function Body({ children, muted = false, sx, ...props }) {
  return (
    <Typography
      component="p"
      sx={{
        fontSize: 17,
        lineHeight: 1.58,
        color: muted ? tokens.color.muted : tokens.color.body,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}

/** Caption — smallest uppercase role, used for meta rows (dates, tags). */
export function Caption({ children, sx, ...props }) {
  return (
    <Typography
      component="span"
      sx={{
        fontSize: 11,
        letterSpacing: "1.65px",
        textTransform: "uppercase",
        color: tokens.color.muted,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
