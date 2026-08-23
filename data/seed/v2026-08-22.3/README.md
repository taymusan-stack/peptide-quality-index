# PQI RUO A-tier product/lot COA pack (2026-08-22.3)

Informational directory ingest only. RUO vendors. No dosing, no medical claims, no UI, no grokbot.

This version is the A-tier RUO pack. S-tier stays in [`../v2026-08-22.2/`](../v2026-08-22.2/). `503A`, `503B`, `telehealth_clinic`, and `other` stay out of this pack.

Contracts:

- Schema locks: [`docs/schema.md`](../../../docs/schema.md)
- Marketing data contract: [`docs/for-marketing.md`](../../../docs/for-marketing.md)
- Enforcement / lab catalog / shortage context stay in [`../v2026-08-22.1/`](../v2026-08-22.1/)
- Vendor and lab coverage notes: [`atier_coverage.md`](atier_coverage.md)

## Grain

**vendor × SKU × size × price × $/mg × lot × lab × methods × COA URL**

Same scoreable unit as schema: a specific size of a specific SKU from a specific lot, tied to a specific lab report. Price and $/mg ride along as listing facts. They are not a quality score.

## Files

- `product_lot_coa_atier.json`: 293 rows + meta
- `product_lot_coa_atier.csv`: same rows, flat
- `atier_coverage.md`: vendor/lab coverage notes for this pack

## Counts

293 rows. All `entity_type=RUO`.

Verification mix:

- `verified_on_lab_portal` 13
- `vendor_pdf` 279
- `unverified` 1

`verified` is derived. True only when `verification_status==verified_on_lab_portal`. 13 true / 280 false. Matches the portal count.

`vendor_pdf` is a first-class verification status. It is not a failure and it is not portal-verified.

`confidence` is stripped from product rows. Join [`../v2026-08-22.1/enforcement_watch.json`](../v2026-08-22.1/enforcement_watch.json).

## Schema locks used here

1. `verified` means lot/batch ID plus a lab match on the ladder (lab-portal key > lab PDF > vendor PDF). Never a pharmacy-listing sense.
2. `pharmacy_lists_peptide` stays null on these RUO rows.
3. Score only analytes present. `null != pass`. `commissioning_party` is first-class.
4. Enforcement `confidence` is not on product rows.

## Held

- No invented COA numbers, lot IDs, lab results, or prices
- No mass vendor scrape
- Sep 2025 50+ FDA warning letter full crawl
- Mile High deferred
- No UI
- No 503A / 503B / telehealth / other entities
- S-tier remains in v2026-08-22.2
