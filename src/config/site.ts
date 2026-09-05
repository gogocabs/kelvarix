/** Identity, contact and navigation. Content lives in `content.ts`. */

export const site = {
  name: "Kelvarix",
  tagline: "Value, realized",
  description:
    "Kelvarix builds AI agents that absorb business busywork — follow-ups, chasing, copy-paste — inside the tools you already use.",
  // TODO: replace with the real handle/address before launch.
  whatsapp: "https://wa.me/910000000000",
  email: "hello@kelvarix.com",
} as const;

export const navLinks = [
  { href: "#operations", label: "Operations" },
  { href: "#how", label: "How it works" },
  { href: "#industries", label: "Industries" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Canonical logo files in `public/brand/`. Never recoloured or upscaled. */
export const brand = {
  mark: "brand/kelvarix_icon_transparent.png",
  markPaper: "brand/kelvarix_icon_offwhite.png",
  wordmark: "brand/kelvarix_wordmark_transparent.png",
  wordmarkPaper: "brand/kelvarix_wordmark_offwhite.png",
  /** Reference lockup only — has a card frame baked in, do not use in the UI. */
  lockupReference: "brand/kelvarix_logo_type_refined.png",
  /** Intrinsic pixel sizes, for correct `width`/`height` attributes. */
  markSize: { w: 500, h: 500 },
  wordmarkSize: { w: 794, h: 331 },
} as const;
