# Marketing data contract

This repo is data, schema, taxonomy, and verification. Marketing owns the public UI rebuild. [peptide-quality-index.vercel.app](https://peptide-quality-index.vercel.app) is a reference example only. Do not treat it as the product.

The public site is an informational peptide directory. No dosing. No medical claims. No copy that tells people to buy peptides for human use.

Engineering locks: [`docs/schema.md`](schema.md). Current seed: [`data/seed/v2026-08-22.1/`](../data/seed/v2026-08-22.1/).

## Who owns what

- This repo: data, schema, taxonomy, verification rules
- Marketing: public UI rebuild
- Vercel draft: reference / example only

## Pin a seed version

Seeds live at `data/seed/vYYYY-MM-DD.x/`.

Current pack: `v2026-08-22.1`

Pin a version in the UI build, or write down how you take latest. Do not silently switch packs.

## Entity types and scorecards

Every entity is one of `RUO` | `503A` | `503B` | `telehealth_clinic` | `other`.

Each type gets its own scorecard. Never one blended leaderboard across types. A 503B pharmacy and an RUO vendor can list the same peptide name. They do not share a ranking.

## Grain

Quality evidence is scored at:

**entity × product SKU × size × lot × lab report**

Vendor tiers come later. They are derived. Do not invent a vendor-level score from a listing.

"Vendor carries BPC-157" is a listing fact, not a quality row.

## Verified

`verified` means lot/batch ID plus a lab match on this ladder. First hit wins:

1. lab-portal key
2. lab PDF
3. vendor PDF

This is not BatchGuild pharmacy-listing "Verified." A pharmacy page that names a peptide is not a verified lot.

`pharmacy_lists_peptide` is the field for pharmacy-site listing. Keep it off the `verified` path.

## Enforcement

Every enforcement row needs `confidence`: `full-text` | `excerpt-only` | `title-only`.

Use `allegation_type` values from seed meta only. Do not invent flags from letter titles.

Enum source: `data/seed/v2026-08-22.1/enforcement_watch.json` → `meta.allegation_type_enum`.

## Labs

Default labs: Janoshik, MZ Biolabs, Colmaric.

`commissioning_party` is first-class: `vendor` | `buyer` | `group` | `unknown`. Who ordered the test matters more than a clean-looking PDF.

Score only analytes present on that report. `null` is not a pass. A missing endotoxin line does not mean the lot passed endotoxin.

## Shortage copy

`shortage_copy_eligibility_context` is regulatory context for APIs such as tirzepatide and semaglutide. Dated shortage-list and discretion-window facts only.

Never treat an open window as "safe to compound."

## Held until product owner greenlights

- Product and lot scrapes
- Sep 2025 50+ compounder letter crawl. Seed has exemplars only.

## Do / Don't

Do:

- Pin a seed version, or document how you take latest
- Keep scorecards split by entity type
- Show `verified` only when lot/batch ID plus a lab match exists
- Show `pharmacy_lists_peptide` as a listing fact
- Show enforcement with `confidence` and seed `allegation_type` enums
- Show lab results only for analytes on the report
- Treat shortage fields as dated regulatory context
- Keep copy informational and source-linked

Don't:

- Treat the Vercel draft as the product UI
- Blend RUO, 503A, 503B, telehealth, or other into one leaderboard
- Call a pharmacy listing "verified"
- Invent COA numbers or treat a missing analyte as a pass
- Invent allegation flags from titles
- Write dosing, medical claims, or buy-for-human-use copy
- Treat shortage context as "safe to compound"
- Scrape products, lots, or the Sep 2025 letter wave
- Build the marketing UI in this repo
