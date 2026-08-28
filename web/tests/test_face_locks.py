#!/usr/bin/env python3
"""Locks for the draft women-first face. No invented numbers."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
RANKINGS = json.loads((ROOT / "data" / "rankings.json").read_text())
LISTINGS = json.loads((ROOT / "data" / "listings.json").read_text())
SEED = json.loads((REPO / "data" / "seed" / "v2026-08-22.2" / "product_lot_coa_pilot.json").read_text())

TOP10 = [
    "Panda Peptides",
    "BioInfinity Lab",
    "Evolabs Research",
    "Prime Peptides",
    "Sports Technology Labs",
    "Onyx Biolabs",
    "QSC Peptides",
    "Edge Peptides",
    "Pure Peptide Labs",
    "PureRawz",
]

PUBLIC_FILES = [
    ROOT / "index.html",
    ROOT / "rankings.html",
    ROOT / "industry.html",
    ROOT / "compare.html",
    ROOT / "methodology.html",
    ROOT / "vendor.html",
    ROOT / "js" / "app.js",
    ROOT / "css" / "pqi.css",
]


def test_live_original_table():
    rows = RANKINGS["rows"]
    assert len(rows) == 66
    assert [row["name"] for row in rows[:10]] == TOP10
    assert all(row["name"] not in {"Verified Peptides", "Prime Lab Peptides"} for row in rows[:10])
    assert {row["tier"] for row in rows} <= {"S", "A", "B", "C", "D"}
    assert all(row["score"] in {1, 2, 3, 4, 5} for row in rows)


def test_listings_prices_are_seed_facts():
    seed_pairs = {
        (row["vendor_name"], row["product_name"], row.get("size_label"), row.get("listed_price_usd"))
        for row in SEED["rows"]
    }
    for row in LISTINGS["rows"]:
        if not row["price_stated"]:
            assert row["listed_price_usd"] is None
            continue
        assert row["size_label"]
        assert row["listed_price_usd"] is not None
        assert (
            row["vendor_name"],
            row["product_name"],
            row["size_label"],
            row["listed_price_usd"],
        ) in seed_pairs


def test_tease_lock_names():
    assert LISTINGS["lead_teases"] == ["GLOW", "NAD+", "Glutathione"]
    assert LISTINGS["locked_10"] == [
        "BPC-157",
        "TB-500",
        "Semaglutide",
        "Tirzepatide",
        "Retatrutide",
        "GHK-Cu",
        "NAD+",
        "Tesamorelin",
        "Ipamorelin",
        "Semax",
    ]
    assert LISTINGS["stacks_named"] == [
        "CJC / Ipamorelin",
        "Tesamorelin / Ipamorelin",
        "GLOW",
        "KLOW",
    ]


def test_public_copy_walls():
    blob = "\n".join(path.read_text() for path in PUBLIC_FILES)
    assert "See which research peptide companies have a report you can check." in blob
    assert re.search(r"<h1>we don’t sell peptides\.?</h1>", blob, re.I) is None
    assert "96 US research-use" not in blob
    assert "89 US research-use" in blob
    assert "4/13/26/16/7" not in blob
    assert re.search(r"\blot\b", blob, re.I) is None
    assert re.search(r"\b(take|inject|dose of)\b", blob, re.I) is None
    assert re.search(r"add to cart", blob, re.I) is None
    assert "buy now" not in blob.lower()
    for col in ["#", "Vendor", "Tier", "Score", "Lab", "Methods", "Trustpilot", "COA status"]:
        assert col in blob


if __name__ == "__main__":
    test_live_original_table()
    test_listings_prices_are_seed_facts()
    test_tease_lock_names()
    test_public_copy_walls()
    print("face locks ok")
