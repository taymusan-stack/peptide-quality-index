# Phase 2 — 503A / 503B commercial map (brief for Chief lock)

**Status:** LOCKED by Chief 2026-08-22 — N=12
**Author:** PQI Strategist
**As of:** 2026-08-22

## Goal
Informational map so 503A and 503B Coming stubs can become real boards later without blending into RUO or each other.

## Hard walls
- Separate scorecards: 503A ≠ 503B ≠ RUO ≠ telehealth. No blended ranking.
- `pharmacy_lists_peptide` ≠ verified. Listing is listing only.
- Informational only: no dosing, medical claims, buy-for-human-use, or "safe to compound."
- No invented prices, COAs, or registration claims.

## Questions (every row tagged entity_type 503A or 503B)
1. **Who** — legal/trade name, public FDA registration posture if stated, state(s), primary URL.
2. **Sell direct?** — public patient-facing storefront / provider-only / unclear (evidence URL).
3. **Prices** — only publicly listed SKU/size/price or program fee; else `quote_only` / `not_public`.
4. **Peptide listing facts** — peptides publicly named on site (future `pharmacy_lists_peptide`; never Verified).
5. **Optional hygiene note** — any public lot/COA language (observe only; not RUO portal verify).

## Sample size (proposed — Chief may trim)
- **Pilot N:** 12 facilities total, split roughly even 503A vs 503B if inventory allows.
- **Seed preference:** start from any 503A/503B names already in enforcement_watch / prior briefs; fill gaps from public FDA registration lists + pharmacy sites.
- **Stop rule:** stop at N or when 5 consecutive candidates lack any public sell-direct/price signal — document gaps, do not invent.

## Sources (allowed)
- Facility own website (about, compounding, peptide/GLP pages, price lists).
- Public FDA registration / outsourcing facility pages where applicable.
- State board of pharmacy public lookups if needed for identity.
- Existing PQI seed/enforcement rows for name hints only.

## Disallowed / out of scope
- Telehealth cost map (Phase 3 — queued after Phase 2).
- RUO depth (Phase 1 done).
- Inventing COAs; treating listing as verified.
- RUO vendor re-scrape; Sep 2025 letter crawl; mass product/lot scrape.
- Vendor tiers / "best pharmacy."
- Shortage/discretion as endorsement copy.

## Deliverables
1. `phase2_field_notes.md` (sourced URLs).
2. Machine-readable draft with hard `entity_type` (prefer separate 503A / 503B files).
3. Copy glossary addendum: sell-direct / quote-only / listing≠verified / Coming→live stubs.

## Success
Strategist can specify board columns; Copy can write stubs→live; Tech can stub schema without invented rows.

## Start condition
Research may start.
