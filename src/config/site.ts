/** Identity, contact and navigation. Content lives in `content.ts`. */

export const site = {
  name: "Kelvarix",
  tagline: "Value, realized",
  description:
    "We build the agents that run your business — custom AI agents, your own CRM and MCP, on infrastructure you own. Convert your business to AI with Kelvarix.",
  keywords: [
    "convert your business to AI with Kelvarix",
    "Kelvarix",
    "AI agents",
    "custom AI agents",
    "AI operations studio",
    "own your CRM one-time cost",
    "MCP Telegram stock",
    "business automation",
    "AI follow-up agent",
    "CRM automation",
    "WhatsApp automation",
    "AI invoicing",
    "lead response",
  ],
  whatsapp:
    "https://wa.me/918220769919?text=Hi%20Kelvarix%2C%20I%20want%20to%20start%20immediately.",
  whatsappDisplay: "+91 82207 69919",
  email: "enquiry@kelvarix.in",
  leadsApi: "https://kelvarix-leads.admin-yaazh-ai.workers.dev",
  gaId: "G-DB5YTF51Y2",
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
