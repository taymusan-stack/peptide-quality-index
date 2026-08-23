# PQI machine-readable drafts (2026-08-22.1)

Informational directory drafts for peptide-quality-index ingest. Not medical/legal advice. No invented COA numbers.

## Files
- `enforcement_watch.json` — full rows + enums + meta (18 rows)
- `enforcement_watch.csv` — flat table (allegation_types and product_classes pipe-separated)
- `lab_method_catalog.json` — Janoshik / MZ / Colmaric defaults
- `lab_method_catalog.csv` — summary table
- `shortage_copy_eligibility_context.json` — tirzepatide + semaglutide context objects (bonus for schema)

## Schema locks (from PQI Chief)
1. `verification_status` enum: `verified_on_lab_portal` | `vendor_pdf` | `client_pdf_only` | `unverified`. `vendor_pdf` is first-class. Do not collapse it to `client_pdf_only`.
2. Derived `verified` / verified badge is true only when `verification_status == verified_on_lab_portal`. Never pharmacy-listing sense.
3. Separate `pharmacy_lists_peptide` for pharmacy-site listing only.
4. Enforcement rows require `confidence`: full-text | excerpt-only | title-only.
5. Score only analytes present; null purity / null analyte != pass; `commissioning_party` first-class. Informational only.
6. `shortage_copy_eligibility_context` is regulatory context only.

## Held
- No Sep 2025 50+ full crawl yet
- No product/lot scrape until C Wall greenlights data ops
