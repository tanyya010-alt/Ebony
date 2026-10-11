#!/usr/bin/env python3
"""Tidy a product photo so every product appears the same size in the shop.

Usage:  python3 tools/prepare_photo.py <photo> images/<product-id>.jpg

Makes an off-white background pure white (only background touching the
photo's edges, so white products are left alone), trims the empty space,
and centres the product on a white square with a small margin.
Needs Pillow (pip install pillow).
"""
import sys
from PIL import Image, ImageChops, ImageDraw

MARGIN = 0.06       # space around the product, as a share of the square
MAX_SIZE = 900
BACKGROUND = 24     # most a background may differ from pure white and still be cleared (0–255)


def prepare(src, dest):
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        white = Image.new("RGB", im.size, "white")
        white.paste(im, mask=im.split()[-1])
        im = white
    else:
        im = im.convert("RGB")

    # Near-white pixels, then keep only those connected to the photo's edges.
    diff = ImageChops.difference(im, Image.new("RGB", im.size, "white")).convert("L")
    w, h = im.size
    # Match the actual background: a pure-white photo gets a tight limit so pale parts
    # of the product are kept; a cream or grey one gets just enough to clear it.
    corners = [diff.getpixel(c) for c in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]
    limit = min(BACKGROUND, sorted(corners)[1] + 6)
    mask = diff.point(lambda v: 255 if v <= limit else 0)
    edge = [(x, y) for x in range(0, w, 4) for y in (0, h - 1)] + [(x, y) for y in range(0, h, 4) for x in (0, w - 1)]
    for point in edge:
        if mask.getpixel(point) == 255:
            ImageDraw.floodfill(mask, point, 128)
    im.paste("white", mask=mask.point(lambda v: 255 if v == 128 else 0))

    product_mask = ImageChops.difference(im, Image.new("RGB", im.size, "white")).convert("L")
    box = product_mask.point(lambda v: 255 if v > 18 else 0).getbbox()
    product = im.crop(box) if box else im

    side = int(max(product.size) / (1 - 2 * MARGIN))
    square = Image.new("RGB", (side, side), "white")
    square.paste(product, ((side - product.width) // 2, (side - product.height) // 2))
    if side > MAX_SIZE:
        square = square.resize((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    square.save(dest, quality=90, optimize=True)
    print(f"Saved {dest} ({square.width}×{square.height})")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    prepare(sys.argv[1], sys.argv[2])
