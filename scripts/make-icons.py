#!/usr/bin/env python3
"""Render the Tune app icon to all required PNG sizes.

Design: warm-dark background, three horizontal slider tracks, three dot
handles at varied positions (echoing the slider FAB and the brand name).
One dot in the indigo accent for character.
"""
from PIL import Image, ImageDraw
import os

# Output sizes used by the manifest + apple-touch-icon + favicon
SIZES = [32, 72, 96, 128, 144, 152, 180, 192, 384, 512]
OUT_ICONS_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")
OUT_ROOT_DIR  = os.path.join(os.path.dirname(__file__), "..")
os.makedirs(OUT_ICONS_DIR, exist_ok=True)

# Colors
BG        = (22, 19, 13, 255)       # warm dark (matches dark-mode bg ~)
TRACK     = (253, 251, 246, 38)     # cream @ 15% alpha
DOT_CREAM = (253, 251, 246, 255)    # cream
DOT_ACCENT= (129, 140, 248, 255)    # indigo-400 (accent)

# Layout in normalized units (0..1) so we can render any size cleanly.
# Three horizontal sliders, each with a dot at a different position.
# y positions (center) and x position of the dot (0..1 along the track).
TRACKS = [
    (0.345, 0.22),  # top track,    dot near left
    (0.500, 0.74),  # middle track, dot near right  (accent)
    (0.655, 0.50),  # bottom track, dot near middle
]
ACCENT_INDEX = 1  # which dot uses the accent color

TRACK_START_X = 0.16
TRACK_END_X   = 0.84
TRACK_THICK_R = 0.018   # relative to size
DOT_RADIUS_R  = 0.075   # relative to size
CORNER_R      = 0.225   # iOS-style rounded corner

def render(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Rounded square background
    corner = int(size * CORNER_R)
    draw.rounded_rectangle([(0, 0), (size, size)], radius=corner, fill=BG)

    track_x0 = size * TRACK_START_X
    track_x1 = size * TRACK_END_X
    track_thick = max(2, int(size * TRACK_THICK_R))
    dot_r = max(3, int(size * DOT_RADIUS_R))

    for i, (yr, dx) in enumerate(TRACKS):
        y = size * yr
        # Track (rounded line)
        draw.rounded_rectangle(
            [(track_x0, y - track_thick / 2),
             (track_x1, y + track_thick / 2)],
            radius=track_thick / 2,
            fill=TRACK,
        )
        # Dot handle
        cx = track_x0 + (track_x1 - track_x0) * dx
        color = DOT_ACCENT if i == ACCENT_INDEX else DOT_CREAM
        draw.ellipse(
            [(cx - dot_r, y - dot_r), (cx + dot_r, y + dot_r)],
            fill=color,
        )

    return img

def main():
    # Render the master at 1024 then downsample for crisper small sizes
    master = render(1024)
    for s in SIZES:
        img = master.resize((s, s), Image.LANCZOS)
        if s == 32:
            out = os.path.join(OUT_ROOT_DIR, "favicon.png")
        elif s == 180:
            out = os.path.join(OUT_ROOT_DIR, "apple-touch-icon.png")
        else:
            out = os.path.join(OUT_ICONS_DIR, f"icon-{s}.png")
        img.save(out, "PNG", optimize=True)
        print(f"wrote {out} ({s}x{s})")

if __name__ == "__main__":
    main()
