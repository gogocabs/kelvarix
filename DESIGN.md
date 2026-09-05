# Kelvarix Design System

The binding spec for this site. Every component follows it. If a change can't be
expressed with the tokens below, the token set changes first — not the component.

**One hard rule: tokens only. No raw hex, no arbitrary Tailwind values
(`text-[#123456]`, `mt-[37px]`, `w-[423px]`).** The only exceptions are the
computed inline styles in `Logo.astro`, which exist to correct for padding baked
into the source PNGs and are derived arithmetically, not eyeballed.

---

## 1. Colour

Every brand value is **sampled from the logo artwork** in `public/brand/`, not
picked by eye. Regenerate with `python3 scripts/brand-assets.py` after any logo
change and re-verify.

### Core

| Token | Hex | Where it comes from | Use |
| :-- | :-- | :-- | :-- |
| `navy` | `#173B57` | Mark + wordmark body | Primary dark surface; body text on light |
| `gold` | `#D9A441` | The "x" in the wordmark | CTAs and numeric accents **only** |
| `teal` | `#1C8C8C` | Circuit nodes in the mark | Signal: live, active, connected, data |
| `slate` | `#5B7285` | "VALUE, REALIZED" | Muted/secondary text on light |
| `paper` | `#FCFCFB` | Logo background | Primary light surface |

### Derived

Tints and shades of the core only — **never introduce a new hue.**

| Token | Hex | Purpose |
| :-- | :-- | :-- |
| `navy-900` | `#0E2740` | Deepest band (hero, contact) |
| `navy-800` | `#173B57` | Standard dark band — same as `navy` |
| `navy-700` | `#1E4A69` | Raised element on dark |
| `navy-600` | `#2A5B7D` | Hover/border on dark |
| `paper-dim` | `#F2F1EC` | Alternate light band |
| `gold-600` | `#BE8B2E` | Gold hover |
| `teal-600` | `#16706F` | Teal **text on light** (5.7:1) |
| `teal-400` | `#2AA8A8` | Teal **text on dark** (5.1:1) |
| `slate-600` | `#475968` | **Small** muted text on light (7.0:1 / 6.3:1 on dim) |
| `slate-300` | `#A8BACB` | Muted text **on dark** (7.3:1) |
| `hairline` | `navy / 12%` | Rules on light |
| `hairline-dark` | `slate-300 / 16%` | Rules on dark |

### Contrast rules — these are not suggestions

Measured against the surface each is allowed on:

- **Gold never carries text on light.** `#D9A441` on paper is **2.2:1** — it
  fails. Gold is a *filled* button with `navy-900` text (**5.5:1**), or large
  display/numeric accents on dark (**6.4:1**).
- **Teal splits by surface.** Base `teal` on paper is **4.0:1**, which fails for
  body copy — use `teal-600` on light (**5.7:1**) and `teal-400` on dark
  (**5.1:1**). Base `teal` is for *strokes and fills*, not text.
- **Slate splits by surface and size.** `slate` on paper is **4.9:1** (passes),
  but on `paper-dim` it is only **4.42:1** — below AA. On `paper-dim`, or for
  anything at `text-label` size, use `slate-600`. On dark use `slate-300`
  (plain `slate` is **2.9:1** there and fails).
- Navy on paper is **10.5:1**; paper on `navy-900` is **14.4:1**.

**Never use an opacity modifier to soften text** (`text-slate-300/70`,
`opacity-60`). It silently breaks contrast — pick the token that already has the
right value. Opacity is fine on non-text decoration such as hairline rules.

---

## 2. Typography

Poppins for display (it echoes the geometric wordmark), Inter for everything
else. Loaded from Google Fonts with `display=swap`.

| Token | Size | Use |
| :-- | :-- | :-- |
| `text-display-lg` | 4.5rem | Hero h1, `md:` and up |
| `text-display` | 3.25rem | Hero h1, mobile |
| `text-h2` | 2rem | Section headings |
| `text-h3` | 1.25rem | Card/accordion headings |
| `text-lead` | 1.1875rem | Hero standfirst |
| `text-body` | 1.0625rem | Body copy (the `<body>` default) |
| `text-label` | 0.75rem | Eyebrows, meta, stats — uppercase, `0.12em` tracking |

Rules: display and h2 use `font-display` at weight 600. Never introduce a size
between these steps. Headings get `text-wrap: balance`, paragraphs
`text-wrap: pretty`. Measure caps at `max-w-prose` for long-form copy.

---

## 3. Layout

- **Grid**: 4px base (Tailwind default scale). No off-scale values.
- **Widths**: `max-w-content` (1120px) for sections, `max-w-prose` (704px) for
  reading columns. Both are `--container-*` tokens, so `max-w-*` utilities are
  generated automatically.
- **Section padding**: `py-24` mobile, `md:py-32`. Owned by `Section.astro` —
  don't set it per-section.
- **Gutters**: `px-6`, `md:px-8`. Owned by `Container.astro`.

### Band rhythm

The page alternates surfaces with hairline seams. **Header and footer are
always `paper`** — the wordmark artwork is navy, so a light frame keeps the logo
on its intended background instead of recolouring it.

```
header    paper
hero      navy-deep
sections  paper → paper-dim → navy → paper → paper-dim
contact   navy-deep
footer    paper
```

---

## 4. Elevation and borders

**There are no shadows in this system.** Depth comes from surface value and
hairline borders only.

- Cards: `rounded-lg` + 1px `hairline` (or `hairline-dark` on dark).
- Buttons and pills: `rounded-full`.
- Inputs: `rounded-md`, `hairline` border, `teal` on focus.
- No gradients, no blur except the header's `backdrop-blur-md`, no grain,
  no sticker offsets, no outline-shadow tricks.

---

## 5. Components

| Component | Contract |
| :-- | :-- |
| `layout/Section.astro` | Owns the band: `surface`, `width`, vertical padding. `navy`/`navy-deep` add `.surface-dark`. |
| `layout/Container.astro` | Owns max-width and gutters. Nothing else sets them. |
| `layout/Header.astro` | Sticky, `paper/85` + blur, hairline base. Always light. Inline nav from `md`; below that a disclosure menu holding the links and the CTA. |
| `layout/Footer.astro` | Always light. Lockup, nav, legal row. |
| `brand/Logo.astro` | The only approved lockup. `variant`, `size`. See §7. |
| `ui/Button.astro` | `primary` (gold fill/navy text), `ghost` (light), `ghost-dark` (dark). Sizes `md`/`lg`. |
| `ui/Card.astro` | Flat bordered panel, `surface` light/dark. |
| `ui/Eyebrow.astro` | Numbered section label + rule. `surface` picks `teal-600`/`teal-400`. |
| `ui/Stat.astro` | Gold display figure + `slate-300` caption. Dark bands only. |
| `ui/Accordion.astro` | Native `<details>`; works with JS disabled. |
| `ui/Field.astro` | Labelled input/textarea. **Always pass `autocomplete`** for identity fields. |

Content lives in `src/config/content.ts`. Components take structure, never copy.

**Gotcha:** don't pass `hidden` to `Button.astro` via `class`. Its base
`inline-flex` is in the same cascade layer, so stylesheet order decides the
winner and the button stays visible. Wrap it in a `<div class="hidden md:block">`
instead.

---

## 6. Motion

One reveal, one draw, one pulse. Nothing else moves.

- **Reveal**: `.reveal` → opacity + 8px rise, 220ms `--ease-brand`
  (`cubic-bezier(.2,.7,.3,1)`), triggered by IntersectionObserver in
  `Base.astro` and unobserved after firing. Add `.in` to opt out (above-the-fold
  content does this so it never flashes).
- **Trace**: `.trace` draws the hero circuit once via `stroke-dashoffset`.
  Set `--trace-len` per path. The diagram is `md`-only — its labels fall below
  legible size on phones, where the same channels render as chips instead.
- **Live dot**: `.live-dot` — the only looping animation on the site.
- `prefers-reduced-motion: reduce` disables all three and smooth scrolling.
  This is non-negotiable.

---

## 7. Logo usage

Canonical files live in `public/brand/` and are **used verbatim**. They are
raster PNGs; there is no vector master yet.

**Approved**

- `kelvarix_icon_transparent.png` — the mark (500×500).
- `kelvarix_wordmark_transparent.png` — wordmark + tagline (794×331).
- Both are composed into the horizontal lockup by `Logo.astro`.

**Never**

- Recolour, invert, add effects, or apply CSS filters.
- Stretch. `Logo.astro` sets width *and* height from the source aspect ratio and
  applies `max-w-none` — Tailwind preflight's `img { max-width: 100% }` would
  otherwise squash the artwork horizontally.
- Render the mark above **500px** or the wordmark above **794px** wide. The
  source has no more resolution than that.
- Use `kelvarix_logo_type_refined.png` in the UI — it has a rounded card frame
  and border baked into the pixels. Reference only.
- Place the wordmark on a dark surface. It is navy `#173B57`.

**Geometry**

Both PNGs carry transparent padding (mark artwork is 304×328 inside 500×500).
`Logo.astro` upscales each image by its canvas/artwork ratio and applies
negative margins, so `size` refers to the **artwork**, not the file canvas.
Lockup proportions match the reference: wordmark = 0.75× mark height,
gap = 0.28× mark height. Clear space = 0.5× mark height.

---

## 8. Accessibility floor

- All text meets WCAG AA (4.5:1 body, 3:1 large) — see §1.
- Visible focus on everything interactive: 2px `teal` ring, `teal-400` on dark.
- Skip link is the first focusable element.
- The hero diagram is `aria-hidden` — its labels are duplicated as real text in
  Operations, so nothing is lost.
- Industry tabs implement the ARIA tabs pattern with roving tabindex and
  arrow-key navigation.
- FAQ uses native `<details>`, so it works without JavaScript.
- Decorative arrows and glyphs are `aria-hidden`.

---

## 9. Regenerating assets

```sh
python3 scripts/brand-assets.py   # requires Pillow
```

Reads `public/brand/`, writes favicons, `favicon.ico`, `apple-touch-icon.png`,
`og.png` (1200×630) and `site.webmanifest`. Padding is trimmed before resizing
so a 32px favicon shows a full-size mark rather than a small one adrift in
empty space.

All public paths must go through `src/lib/url.ts` (`asset()` / `absolute()`).
The site deploys under `base: '/kelvarix/'`, so hand-written root-absolute
paths break in production.
