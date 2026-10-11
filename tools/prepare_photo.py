#!/usr/bin/env python3
"""Tidy a product photo so every product appears the same size in the shop.

Usage:  python3 tools/prepare_photo.py <photo> images/<product-id>.jpg

Trims the white border around the product, centres it on a white square
with a small margin, and saves a JPEG. Needs Pillow (pip install pillow).
"""
import sys
from PIL import Image, ImageChops

MARGIN = 0.06  # space around the product, as a share of the square
MAX_SIZE = 1000


def prepare(src, dest):
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        white = Image.new("RGB", im.size, "white")
        white.paste(im, mask=im.split()[-1])
        im = white
    else:
        im = im.convert("RGB")

    # Anything clearly darker than near-white counts as the product.
    diff = ImageChops.difference(im, Image.new("RGB", im.size, "white")).convert("L")
    box = diff.point(lambda v: 255 if v > 18 else 0).getbbox()
    if box:
        im = im.crop(box)

    side = int(max(im.size) / (1 - 2 * MARGIN))
    square = Image.new("RGB", (side, side), "white")
    square.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    if side > MAX_SIZE:
        square = square.resize((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    square.save(dest, quality=88, optimize=True)
    print(f"Saved {dest} ({square.width}×{square.height})")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    prepare(sys.argv[1], sys.argv[2])
