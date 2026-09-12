import * as React from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { tokens } from "../theme";

/**
 * PillButton — the system's primary CTA shape: 100px radius, transparent
 * fill, primary-colored border and text. Use for "Inquire", "Start your
 * inquiry", etc.
 */
export function PillButton({ children, variant = "outlined", sx, ...props }) {
  const filled = variant === "filled";
  return (
    <Button
      variant={filled ? "contained" : "outlined"}
      sx={{
        borderRadius: "100px",
        padding: "12px 22px",
        fontSize: 12,
        letterSpacing: "0.84px",
        textTransform: "none",
        borderColor: tokens.color.primary,
        color: filled ? tokens.color.canvas : tokens.color.primary,
        backgroundColor: filled ? tokens.color.primary : "transparent",
        "&:hover": {
          backgroundColor: filled ? tokens.color.body : "rgba(25,25,23,0.06)",
          borderColor: tokens.color.primary,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

/**
 * TextLink — flat inline hyperlink with a "flip" hover: the label slides
 * up and out while an identical copy slides up into its place, as if the
 * text rotated. Pure CSS (two stacked lines inside an overflow-hidden,
 * fixed-height box) — no JS. Use inside prose or nav ("WORK", "VIEW THE
 * WORK", etc).
 */
export function TextLink({ children, sx, ...props }) {
  return (
    <Link
      underline="none"
      sx={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
        height: "1.4em",
        fontSize: 12,
        letterSpacing: "0.4px",
        color: tokens.color.link,
        cursor: "pointer",
        "& .tl-inner": {
          display: "flex",
          flexDirection: "column",
          height: "200%",
          transition: "transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)",
        },
        "& .tl-line": {
          height: "50%",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        },
        "&:hover .tl-inner": {
          transform: "translateY(-50%)",
        },
        ...sx,
      }}
      {...props}
    >
      <span className="tl-inner">
        <span className="tl-line">{children}</span>
        <span className="tl-line" aria-hidden="true">
          {children}
        </span>
      </span>
    </Link>
  );
}