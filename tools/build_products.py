#!/usr/bin/env python3
"""Turn data/catalog.csv into products.js for the storefront.

Usage:  python3 tools/build_products.py

Photos: add an "Image" column with a direct image link or a file path such as
images/cerave-cleanser.jpg. Products without one show a drawn bottle.

Price: the shop price is the middle of the "Typical Nigeria price range",
rounded to the nearest ₦500. To set your own price, add a "Price" column
to the CSV (plain number, e.g. 25000) and it will be used instead.
"""
import csv
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "catalog.csv"
OUT = ROOT / "products.js"

# CSV category -> (shop section, sub-category label, bottle illustration)
CATEGORY = {
    "Cleanser":    ("skincare", "Cleansers",    "pump"),
    "Moisturiser": ("skincare", "Moisturisers", "jar"),
    "Sunscreen":   ("skincare", "Sunscreens",   "tube"),
    "Serum":       ("skincare", "Serums",       "dropper"),
    "Exfoliant":   ("skincare", "Serums",       "oil"),
    "Body care":   ("body",     "Body Care",    "pump"),
    "Perfume":     ("perfume",  "Fragrances",   "flacon"),
    "Body mist":   ("perfume",  "Body Mists",   "pump"),
    "Perfume oil": ("perfume",  "Perfume Oils", "oil"),
}

# Longest names first so "La Roche-Posay" wins over shorter matches.
BRANDS = sorted([
    "CeraVe", "Cetaphil", "Simple", "Garnier", "Neutrogena", "COSRX", "La Roche-Posay",
    "PanOxyl", "Nivea", "Aveeno", "Estée Lauder", "Lancôme", "Beauty of Joseon", "Skin1004",
    "EltaMD", "The Ordinary", "Good Molecules", "SkinCeuticals", "Dove", "Vaseline", "AmLactin",
    "L’Occitane", "Lattafa", "Armaf", "Afnan", "Maison Alhambra", "Rasasi", "Swiss Arabian",
    "Avon", "Dior", "Chanel", "YSL", "Gucci", "Versace", "Carolina Herrera", "MFK",
    "Parfums de Marly", "Xerjoff", "Amouage", "Victoria’s Secret", "Bath & Body Works", "Attar",
], key=len, reverse=True)

# Bottle colours: (background, bottle) per section and tier, cycled for variety.
PALETTES = {
    "skincare": [("#ece2d3", "#f6efe3"), ("#e6d6be", "#d8b98c"), ("#e3dbd0", "#c9d3d6"), ("#eadfd2", "#e8c9b5")],
    "body":     [("#e7d4b6", "#c99a5b"), ("#e4d6c5", "#f1e6d6"), ("#dccab0", "#a4794f")],
    "perfume":  [("#e9d3cb", "#c98d86"), ("#e3cba6", "#b07a3a"), ("#e6dccf", "#d9c6a5"), ("#dcd3e0", "#a28bb0")],
    "luxury":   [("#2a211b", "#1a1410"), ("#1e1814", "#3a2a20"), ("#2b2420", "#6b1f2a")],
}


def slug(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def naira(text):
    return int(re.sub(r"[^\d]", "", text))


def main():
    rows = list(csv.DictReader(SRC.open(encoding="utf-8")))
    products, counters = [], {}
    for row in rows:
        name = (row.get("Product") or "").strip()
        if not name:
            continue
        cat = row["Category"].strip()
        section, sub, shape = CATEGORY.get(cat, ("skincare", cat, "jar"))
        tier = row["Tier"].strip()
        low, high = [naira(p) for p in re.split(r"[–-]", row["Typical Nigeria price range"])]
        price = int(row["Price"]) if row.get("Price", "").strip() else round((low + high) / 2 / 500) * 500
        # Product photo: a direct image link (https://…/photo.jpg) or a file in images/ (e.g. images/cerave.jpg).
        # Google search pages are not photos, so they are ignored and the drawn bottle is shown instead.
        image = (row.get("Image") or "").strip()
        if "google." in image and "/search" in image:
            image = ""
        brand = next((b for b in BRANDS if name.startswith(b)), "")

        luxe = tier in ("Luxury", "Ultra-luxury") and section == "perfume"
        if section == "perfume" and cat == "Perfume" and not luxe and tier == "Basic":
            shape = "round"
        key = "luxury" if luxe else section
        i = counters[key] = counters.get(key, -1) + 1
        bg, color = PALETTES[key][i % len(PALETTES[key])]

        products.append({
            "id": slug(name), "name": name, "brand": brand or name.split()[0],
            "category": section, "type": sub, "tier": tier,
            "price": price, "priceRange": [low, high],
            "shape": shape, "bg": bg, "color": color,
            **({"image": image} if image else {}),
        })

    OUT.write_text(
        "/* Generated from data/catalog.csv by tools/build_products.py — edit the CSV, then re-run. */\n"
        "const PRODUCTS = " + json.dumps(products, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(products)} products to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
