#!/usr/bin/env python3
"""Animated success check for the contact-form modal. Design tokens only:
paper bg, navy disc, teal ring sweep, gold check draw. Output: public/success.gif
Requires: Pillow
"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public" / "success.gif"
SIZE = 160
PAPER = (252, 252, 251)
NAVY = (14, 39, 64)
TEAL = (42, 168, 168)
GOLD = (217, 164, 65)

CX, CY, R = SIZE // 2, SIZE // 2, 58


def frame(ring_frac, check_frac):
    im = Image.new("RGB", (SIZE, SIZE), PAPER)
    d = ImageDraw.Draw(im)
    d.ellipse([CX - R, CY - R, CX + R, CY + R], fill=NAVY)
    if ring_frac > 0:
        d.arc([CX - R, CY - R, CX + R, CY + R], start=-90,
              end=-90 + 360 * ring_frac, fill=TEAL, width=7)
    # check: short arm (60,84)->(74,98), long arm (74,98)->(104,60)
    segs = [((60, 84), (74, 98)), ((74, 98), (104, 60))]
    remaining = check_frac * len(segs)
    for (x0, y0), (x1, y1) in segs:
        if remaining <= 0:
            break
        f = min(1.0, remaining)
        d.line([(x0, y0), (x0 + (x1 - x0) * f, y0 + (y1 - y0) * f)],
               fill=GOLD, width=11, joint="curve")
        remaining -= 1
    return im


frames = []
for i in range(8):  # ring sweep
    frames.append(frame((i + 1) / 8, 0))
for i in range(6):  # check draw
    frames.append(frame(1.0, (i + 1) / 6))
frames += [frames[-1]] * 6  # hold

frames[0].save(OUT, save_all=True, append_images=frames[1:],
               duration=70, loop=0)
print(f"wrote {OUT} ({OUT.stat().st_size} bytes, {len(frames)} frames)")
