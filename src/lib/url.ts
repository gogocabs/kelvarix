/**
 * Base-aware URL helpers.
 *
 * The site deploys to GitHub Pages under `base: '/kelvarix/'`, so any
 * root-absolute path written by hand (`/og.png`) 404s in production.
 * Everything public-facing must go through these helpers.
 */

const BASE = import.meta.env.BASE_URL; // always has a trailing slash in Astro

/** Resolve a file in `public/` to a served path: `asset("og.png")`. */
export function asset(path: string): string {
  return `${BASE}${path.replace(/^\/+/, "")}`;
}

/** Absolute URL, required for OG/Twitter tags and canonical links. */
export function absolute(path: string, origin: string | URL): string {
  return new URL(asset(path), origin).href;
}
