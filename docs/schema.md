# PQI schema v1 locks

Engineering contract for the Peptide Quality Index. This repo is an informational directory. No dosing. No medical claims. Do not invent COA numbers.

The seed pack that implements these locks lives at [`data/seed/v2026-08-22.1/`](../data/seed/v2026-08-22.1/). Read that pack before adding rows or scorecard code.

## Entity types stay on separate scorecards

Every entity is one of:

- `RUO`
- `503A`
- `503B`
- `telehealth_clinic`
- `other`

These get separate scorecards. Never one blended ranking. A 503B and an RUO vendor can list a peptide with the same name. They do not share a leaderboard.

`entity_type_hint` on enforcement rows uses the same enum. It is a hint about the letter target, not a reason to mix scorecards.

## Grain

One index row is:

**vendor/pharmacy × product SKU × size × lot × lab report**

"Vendor carries BPC-157" is not a row. "Pharmacy compounds tirzepatide" is not a row. Those are listing facts. The scoreable unit is a specific size of a specific SKU from a specific lot, tied to a specific lab report.

## `verified` is not a pharmacy listing

`verified` means lot/batch ID plus a lab match on this ladder, first hit wins:

1. lab-portal key
2. lab PDF
3. vendor PDF

Never use BatchGuild's pharmacy-listing sense of "verified." A pharmacy page that names a peptide is not a verified lot.

`pharmacy_lists_peptide` is the field for pharmacy-site listing only. Keep it off the `verified` path.

Lab catalog `verification_status` is a different enum (`verified_on_lab_portal` | `client_pdf_only` | `unverified`). It describes how the report was checked, not whether a pharmacy lists the SKU.

## Enforcement rows

Every enforcement row requires `confidence`:

- `full-text`
- `excerpt-only`
- `title-only`

Do not invent `allegation_type` values from titles. Use the enum in `data/seed/v2026-08-22.1/enforcement_watch.json` `meta.allegation_type_enum`:

- `unapproved_new_drug`
- `misbranding_labeling`
- `misbranding_compounded_promo`
- `intended_use_despite_ruo`
- `bac_water_injection_pairing`
- `coded_glp_aliases`
- `oral_or_device_glp_knockoff`
- `deceptive_pricing`
- `unsubstantiated_weight_loss_claims`
- `fake_testimonials`
- `fake_or_manipulated_reviews`
- `hidden_membership_terms`
- `unauthorized_billing_or_efta`
- `cancel_refund_obstruction`
- `false_compounder_identity`

Agency enum in the same meta is `FDA_CDER` | `FTC`.

## Lab defaults

Default labs are Janoshik Analytical, MZ Biolabs, and Colmaric Analyticals (`janoshik` | `mz_biolabs` | `colmaric`).

`commissioning_party` is first-class: `vendor` | `buyer` | `group` | `unknown`. Who ordered the test matters more than a clean-looking PDF.

Score only analytes present on that report. `null` is not a pass. A missing endotoxin line does not mean the lot passed endotoxin.

## Shortage copy eligibility

`shortage_copy_eligibility_context` holds regulatory context for APIs (tirzepatide, semaglutide). Dated shortage-list and discretion-window facts only. Never treat `shortage_copy_window_open: true` as "safe to compound."

Keep 503A and 503B ends on separate fields. Recompute `shortage_copy_window_open` from those dates. Do not hard-code the boolean.

## Held

- No product/lot scrape until the product owner greenlights data ops.
- Sep 2025 50+ compounder letter crawl is held. The seed has exemplars only.
