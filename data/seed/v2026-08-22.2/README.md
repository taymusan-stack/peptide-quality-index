# PQI RUO product/lot COA pilot (2026-08-22.2)

Informational directory ingest only. RUO vendors. No dosing, no medical claims, no UI, no grokbot.

This version is `RUO` only. `503A`, `503B`, `telehealth_clinic`, and `other` stay out of this pack.

Contracts:

- Schema locks: [`docs/schema.md`](../../../docs/schema.md)
- Marketing data contract: [`docs/for-marketing.md`](../../../docs/for-marketing.md)
- Enforcement / lab catalog / shortage context stay in [`../v2026-08-22.1/`](../v2026-08-22.1/)

## Grain

**vendor × SKU × size × price × $/mg × lot × lab × methods × COA URL**

Same scoreable unit as schema: a specific size of a specific SKU from a specific lot, tied to a specific lab report. Price and $/mg ride along as listing facts. They are not a quality score.

## Files

- `product_lot_coa_pilot.json`: 186 rows + meta (`v2026-08-22.2-portal`)
- `product_lot_coa_pilot.csv`: same rows, flat

## Counts

186 rows. All `entity_type=RUO`.

Verification mix:

- `verified_on_lab_portal` 63
- `vendor_pdf` 120
- `client_pdf_only` 1
- `unverified` 2

`verification_status` enum is locked: `verified_on_lab_portal` | `vendor_pdf` | `client_pdf_only` | `unverified`. `vendor_pdf` is first-class. Do not collapse it to `client_pdf_only`.

Derived `verified` / verified badge is true only when `verification_status == verified_on_lab_portal`. 63 true / 123 false. Matches the portal count. A vendor PDF is not the badge.

Vendors in this pack:

- Panda Peptides (`panda_peptides`) 34 rows, 31 portal
- Prime Peptides (`prime_peptides`) 43 rows, 32 portal
- BioInfinity Lab (`bioinfinity_lab`) 47 rows, 0 portal
- Evo Labs Research (`evolabs_research`) 62 rows, 0 portal

BioInfinity and Evolabs are not in the portal pass. Janoshik portal re-check covered extractable Panda + Prime Task#+key pairs. BioInfinity Verum PDFs were not opened. Evolabs was not re-scraped. One Evolabs Kovera PDF is `client_pdf_only` (portal verify needs an access code).

## Portal PNG and purity

Pack meta: portal recheck is PNG-only, so purity from that pass is left null. `null` is not a pass. Score only analytes present on that report.

Some rows still carry a `purity_pct` from a vendor hub or library table. That is not a portal-extracted number.

## Schema locks used here

1. `verification_status` enum: `verified_on_lab_portal` | `vendor_pdf` | `client_pdf_only` | `unverified`. `vendor_pdf` is first-class. Do not collapse it to `client_pdf_only`.
2. Derived `verified` / verified badge is true only when `verification_status == verified_on_lab_portal`. Never a pharmacy-listing sense.
3. `pharmacy_lists_peptide` stays null on these RUO rows.
4. Score only analytes present. `null` purity / `null` analyte != pass. `commissioning_party` is first-class (`vendor` on every row here). Informational only.
5. Enforcement `confidence` is not on product rows. Join [`../v2026-08-22.1/enforcement_watch.json`](../v2026-08-22.1/enforcement_watch.json).

## Held

- No invented COA numbers, lot IDs, lab results, or prices
- No vendor scrape beyond this delivered pack
- No UI
- No 503A / 503B / telehealth / other entities
- Kovera portal re-verify with access codes
- BioInfinity individual Verum Analytics COA PDF opens
- Sep 2025 50+ FDA warning letter full crawl
