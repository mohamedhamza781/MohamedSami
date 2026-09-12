import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

// Two emotion caches — one plain (LTR), one with the RTL stylis plugin
// (which auto-flips physical CSS properties like margin-left/padding-right
// into their logical opposite). MUI's `sx`/styled output goes through
// whichever cache is active via <CacheProvider>, so switching languages
// swaps this without touching component code.
export const cacheLtr = createCache({ key: "css" });

export const cacheRtl = createCache({
  key: "rtlcss",
  stylisPlugins: [prefixer, rtlPlugin],
});