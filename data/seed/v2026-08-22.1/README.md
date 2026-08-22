# PQI machine-readable drafts (2026-08-22.1)

Informational directory drafts for peptide-quality-index ingest. Not medical/legal advice. No invented COA numbers.

## Files
- `enforcement_watch.json` — full rows + enums + meta (18 rows)
- `enforcement_watch.csv` — flat table (allegation_types and product_classes pipe-separated)
- `lab_method_catalog.json` — Janoshik / MZ / Colmaric defaults
- `lab_method_catalog.csv` — summary table
- `shortage_copy_eligibility_context.json` — tirzepatide + semaglutide context objects (bonus for schema)

## Schema locks (from PQI Chief)
1. `verified` = lot/batch ID + lab match on ladder (lab-portal key > lab PDF > vendor PDF). Never pharmacy-listing sense.
2. Separate `pharmacy_lists_peptide` for pharmacy-site listing only.
3. Enforcement rows require `confidence`: full-text | excerpt-only | title-only.
4. Score only analytes present; null != pass; `commissioning_party` first-class.
5. `shortage_copy_eligibility_context` is regulatory context only.

## Held
- No Sep 2025 50+ full crawl yet
- No product/lot scrape until C Wall greenlights data ops
