import * as React from "react";
import Box from "@mui/material/Box";

/**
 * Reveal — fades + lifts its children in when they scroll into view, and
 * (by default) fades them back out when they scroll out of view, so the
 * effect replays every time the section is revisited. Pure
 * IntersectionObserver, no scroll-jank.
 *
 * Props:
 *  - delay:     stagger, in seconds (e.g. 0.1 for the 2nd item in a row)
 *  - y:         px the content lifts up from as it appears (default 24)
 *  - once:      if true, plays only the first time and then stays visible
 *  - threshold: how much of the element must be visible to trigger (0–1)
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = false,
  threshold = 0.15,
  sx,
  ...props
}) {
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
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition:
          `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, ` +
          `transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: "opacity, transform",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}