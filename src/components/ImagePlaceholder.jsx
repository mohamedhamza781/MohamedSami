import * as React from "react";
import Box from "@mui/material/Box";
import { tokens } from "../theme";

/**
 * ImagePlaceholder — stands in for photography. No stock/generated images
 * are pulled in; this renders a flat surface + diagonal hatch so the layout
 * reads correctly and the slot is obviously meant for a real photo later.
 * Pass `src` to swap in a real image once available.
 */
export function ImagePlaceholder({ label, aspect = "4 / 5", src, sx, className, priority = false }) {
  if (src) {
    return (
      <Box
        className={className}
        component="img"
        src={src}
        alt={label || ""}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchpriority={priority ? "high" : "auto"}
        sx={{
          width: "100%",
          aspectRatio: aspect,
          objectFit: "cover",
          display: "block",
          ...sx,
        }}
      />
    );
  }
  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        bgcolor: tokens.color.muted + "22",
        border: "1px solid rgba(25,25,23,0.15)",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(25,25,23,0.06) 0px, rgba(25,25,23,0.06) 1px, transparent 1px, transparent 14px)",
        display: "flex",
        alignItems: "flex-end",
        p: 1.5,
        ...sx,
      }}
    >
      {label && (
        <Box sx={{ fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: tokens.color.muted }}>
          {label}
        </Box>
      )}
    </Box>
  );
}