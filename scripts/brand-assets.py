#!/usr/bin/env python3
"""Generate derived brand assets from the canonical logos in public/brand/.

The originals are never modified. Derived files are written to public/.
Transparent padding is trimmed before resizing so small icons render the mark
at full optical size; the artwork itself is never recoloured or distorted.

Usage:  python3 scripts/brand-assets.py
Requires: Pillow
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "public" / "brand"
OUT = ROOT / "public"

NAVY = (23, 59, 87)
NAVY_900 = (14, 39, 64)
GOLD = (217, 164, 65)
TEAL = (28, 140, 140)
PAPER = (252, 252, 251)

ICON = BRAND / "kelvarix_icon_transparent.png"
WORDMARK = BRAND / "kelvarix_wordmark_transparent.png"

FAVICON_SIZES = (16, 32, 48, 192, 512)


def trimmed(path: Path) -> Image.Image:
    """Open an RGBA logo and crop away its transparent padding."""
    im = Image.open(path).convert("RGBA")
    box = im.getchannel("A").getbbox()
    if box is None:
        raise SystemExit(f"{path.name} is fully transparent")
    return im.crop(box)


def square(im: Image.Image, size: int, pad: float, bg=None) -> Image.Image:
    """Fit `im` into a square canvas of `size`, leaving `pad` fraction as margin."""
    canvas = Image.new("RGBA", (size, size), (*bg, 255) if bg else (0, 0, 0, 0))
    inner = max(1, round(size * (1 - 2 * pad)))
    scale = min(inner / im.width, inner / im.height)
    art = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    canvas.alpha_composite(art, ((size - art.width) // 2, (size - art.height) // 2))
    return canvas


def build_favicons(mark: Image.Image) -> None:
    for size in FAVICON_SIZES:
        # Tiny sizes get less padding so the mark stays legible in a browser tab.
        pad = 0.02 if size <= 48 else 0.06
        square(mark, size, pad).save(OUT / f"favicon-{size}.png")
    ico = square(mark, 256, 0.02)
    ico.save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print(f"favicons: {', '.join(f'{s}px' for s in FAVICON_SIZES)} + favicon.ico")


def build_apple_touch(mark: Image.Image) -> None:
    # iOS composites onto black if the icon is transparent, so bake the paper bg in.
    square(mark, 180, 0.16, bg=PAPER).convert("RGB").save(OUT / "apple-touch-icon.png")
    print("apple-touch-icon.png: 180px on paper with safe-area inset")


def build_og(mark: Image.Image, wordmark: Image.Image) -> None:
    """1200x630 card: the lockup on paper, framed by a navy band and accent rule.

    The wordmark artwork is navy, so the card stays on the logo's intended
    off-white background rather than inverting anything.
    """
    w, h = 1200, 630
    card = Image.new("RGBA", (w, h), (*PAPER, 255))

    mark_h = 200
    mark_scaled = mark.resize(
        (round(mark.width * mark_h / mark.height), mark_h), Image.LANCZOS
    )
    # Optical pairing: cap height of the wordmark block against the mark.
    word_h = 150
    word_scaled = wordmark.resize(
        (round(wordmark.width * word_h / wordmark.height), word_h), Image.LANCZOS
    )

    gap = 56
    total = mark_scaled.width + gap + word_scaled.width
    x = (w - total) // 2
    cy = h // 2 - 18

    card.alpha_composite(mark_scaled, (x, cy - mark_scaled.height // 2))
    card.alpha_composite(
        word_scaled, (x + mark_scaled.width + gap, cy - word_scaled.height // 2)
    )

    # Accent rule under the lockup: gold weighted, teal tail.
    rule_y = cy + mark_scaled.height // 2 + 78
    rule_w, rule_x = 240, (w - 240) // 2
    for i, (color, start, end) in enumerate(
        [(GOLD, 0, 150), (TEAL, 160, rule_w)]
    ):
        for dy in range(4):
            for px in range(start, end):
                card.putpixel((rule_x + px, rule_y + dy), (*color, 255))

    # Navy foot band anchors the card and echoes the site's dark sections.
    band = Image.new("RGBA", (w, 18), (*NAVY_900, 255))
    card.alpha_composite(band, (0, h - 18))

    card.convert("RGB").save(OUT / "og.png", optimize=True)
    print("og.png: 1200x630 lockup card")


def build_manifest() -> None:
    (OUT / "site.webmanifest").write_text(
        """{
  "name": "Kelvarix",
  "short_name": "Kelvarix",
  "description": "Value, realized. AI agents that absorb business busywork.",
  "start_url": "/kelvarix/",
  "scope": "/kelvarix/",
  "display": "standalone",
  "theme_color": "#173B57",
  "background_color": "#FCFCFB",
  "icons": [
    { "src": "/kelvarix/favicon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/kelvarix/favicon-512.png", "sizes": "512x512", "type": "image/png" },
    {
      "src": "/kelvarix/favicon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
""",
        encoding="utf-8",
    )
    print("site.webmanifest")


def main() -> None:
    for path in (ICON, WORDMARK):
        if not path.exists():
            raise SystemExit(f"missing canonical asset: {path}")

    mark = trimmed(ICON)
    wordmark = trimmed(WORDMARK)
    print(f"source mark {mark.size}, wordmark {wordmark.size} (padding trimmed)")

    build_favicons(mark)
    build_apple_touch(mark)
    build_og(mark, wordmark)
    build_manifest()


if __name__ == "__main__":
    main()
