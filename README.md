# Kelvarix

Marketing site for Kelvarix — *value, realized*. Astro 7 + Tailwind CSS 4,
built as a static site and deployed to GitHub Pages under `/kelvarix/`.

**Read [`DESIGN.md`](./DESIGN.md) before changing anything visual.** It is the
binding spec: sampled brand colours, type scale, component contracts and logo
usage rules.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the build locally |
| `python3 scripts/brand-assets.py` | Regenerate favicons, OG image and manifest from `public/brand/` |

Dev server runs in background mode — manage it with `astro dev stop`,
`astro dev status`, `astro dev logs`.

## Structure

```text
public/
  brand/            canonical logos — used verbatim, never edited
  favicon*  apple-touch-icon.png  og.png  site.webmanifest   (generated)
src/
  components/
    brand/          Logo lockup
    layout/         Header, Footer, Section, Container
    ui/             Button, Card, Eyebrow, Stat, Accordion, Field
    sections/       page sections, one file each
  config/
    site.ts         identity, nav, brand asset paths
    content.ts      all page copy
  layouts/Base.astro  head, SEO, OG/Twitter, JSON-LD, reveal observer
  lib/url.ts        base-aware asset helper
  styles/
    tokens.css      design tokens (@theme)
    global.css      base layer + primitives
scripts/brand-assets.py
DESIGN.md
```

## Conventions

- **Tokens only.** No raw hex, no arbitrary Tailwind values. Add a token first.
- **Copy lives in `src/config/content.ts`**, never inline in components.
- **Asset paths go through `asset()`** from `src/lib/url.ts` — the site is served
  from a sub-path, so root-absolute paths 404 in production.
- **Logos are used as supplied.** No recolouring, no upscaling past the source
  resolution. See `DESIGN.md` §7.

## Before launch

`src/config/site.ts` still holds placeholder contact details:

```ts
whatsapp: "https://wa.me/910000000000",
email: "hello@kelvarix.com",
```

Replace both with the real handle and address.
