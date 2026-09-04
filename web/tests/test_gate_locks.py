#!/usr/bin/env python3
"""Locks for the draft lead-gen gate. No invented numbers or doctor names."""

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

DOCTOR_TITLE = "Talk to a doctor."
DOCTOR_BODY = (
    "This is not advice — you need advice. Talk to a qualified doctor before you "
    "decide anything about peptides. We rank whether a shop’s report is checkable. "
    "We don’t tell you what to take, or whether to take anything."
)
DOCTOR_QUIET = "Informational only. Research use. We don’t sell peptides."

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
    seed_mg = {
        (row["vendor_name"], row["product_name"], row.get("size_label"), row.get("listed_price_usd")): row.get(
            "price_per_mg_usd"
        )
        for row in SEED["rows"]
    }
    for row in LISTINGS["rows"]:
        if not row["price_stated"]:
            assert row["listed_price_usd"] is None
            continue
        assert row["size_label"]
        assert row["listed_price_usd"] is not None
        pair = (
            row["vendor_name"],
            row["product_name"],
            row["size_label"],
            row["listed_price_usd"],
        )
        assert pair in seed_pairs
        if row.get("price_per_mg_usd") is not None:
            assert row["price_per_mg_usd"] == seed_mg[pair]


def test_public_copy_walls():
    blob = "\n".join(path.read_text() for path in PUBLIC_FILES)
    assert "See which research peptide companies have a report you can check." in blob
    assert "Check the report. See the $/mg." in blob
    assert "See where your pep company ranks" in blob
    assert "How does your peptide company rank?" in blob
    assert "Get the names" in blob
    assert "Unlock the names" in blob
    assert re.search(r"<h1>we don’t sell peptides\.?</h1>", blob, re.I) is None
    assert "women-first" not in blob.lower()
    assert "Glow, NAD, glutathione" not in blob
    assert "89 US research-use" not in blob
    assert "96 US research-use" not in blob
    assert "4/13/26/16/7" not in blob
    assert re.search(r"\blot\b", blob, re.I) is None
    assert re.search(r"add to cart", blob, re.I) is None
    assert "buy now" not in blob.lower()
    assert "buy for human use" not in blob.lower()
    for col in ["#", "Vendor", "Tier", "Score", "Lab", "Methods", "Trustpilot", "COA status"]:
        assert col in blob


def test_doctor_cta_verbatim():
    app = (ROOT / "js" / "app.js").read_text()
    assert f'const DOCTOR_TITLE = "{DOCTOR_TITLE}";' in app
    assert DOCTOR_BODY in app
    assert f'const DOCTOR_QUIET = "{DOCTOR_QUIET}";' in app
    assert "—" in DOCTOR_BODY
    assert "shop’s" in DOCTOR_BODY
    assert "don’t" in DOCTOR_BODY
    assert "Dr." not in app
    assert "telehealth ranking" not in app.lower()
    home = (ROOT / "index.html").read_text()
    ranks = (ROOT / "rankings.html").read_text()
    assert 'id="doctor-cta"' in home
    assert 'id="doctor-cta"' in ranks
    assert 'id="ranked-table"' in home
    assert home.index('id="ranked-table"') < home.index('id="doctor-cta"') or 'rank-aside' in home
    assert "rank-aside" in home
    assert "rank-layout" in home


def test_no_doctor_directory_or_telehealth_mix():
    blob = "\n".join(path.read_text() for path in PUBLIC_FILES)
    assert "not a doctor directory" in blob.lower()
    assert re.search(r"Dr\.\s+[A-Z]", blob) is None
    assert "clinic directory" not in blob.lower()
    industry = (ROOT / "industry.html").read_text()
    assert "not a telehealth ranking" in industry


if __name__ == "__main__":
    test_live_original_table()
    test_listings_prices_are_seed_facts()
    test_public_copy_walls()
    test_doctor_cta_verbatim()
    test_no_doctor_directory_or_telehealth_mix()
    print("gate locks ok")
