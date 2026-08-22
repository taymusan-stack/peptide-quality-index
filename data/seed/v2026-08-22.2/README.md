# PQI RUO product/lot COA pilot (2026-08-22.2)

Empty pack. Research will drop RUO product/lot COA rows here. Do not invent COA numbers.

This version is `RUO` only. `503A`, `503B`, `telehealth_clinic`, and `other` stay out of this pack.

Contracts:

- Schema locks: [`docs/schema.md`](../../../docs/schema.md)
- Marketing data contract: [`docs/for-marketing.md`](../../../docs/for-marketing.md)

Informational directory ingest only. No UI in this pack. No vendor scrape.

## Expected grain

**vendor × SKU × size × price × $/mg × lot × lab × methods × COA URL**

Same scoreable unit as schema: a specific size of a specific SKU from a specific lot, tied to a specific lab report. Price and $/mg ride along as listing facts. They are not a quality score.

## Files

None yet. No CSV or JSON until Research delivers rows.

## Held

- No invented COA numbers, lot IDs, lab results, or prices
- No vendor scrape
- No UI
- No 503A / 503B / telehealth / other entities in this pack
