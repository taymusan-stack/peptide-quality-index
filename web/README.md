# Draft lead-gen gate

Not live until C Wall says ship.

This is a face on the existing informational US research-use rankings. It is not a cart, not a women-first face, not a 503/pharmacy list mixed into the table, and not a doctor directory.

## What a stranger can say

See which shops have a checkable report — and the listed $/mg when a size and price already exist.

## Three hooks

1. Named Top 10 with S–D / 5–1, methods, and COA status.
2. Product specimens under a vendor: mark · rank · listed $ · $/mg, only from the pinned seed.
3. See where your pep company ranks — hit shows the row; miss captures email. No invented hit.

## Gate

- Free: result headline, boxed rule, named Top 10, search, specimen where listed size + $ exist, ask beside the table, Talk to a doctor.
- After email: rest of vendor names and sites, full vendor pages, locked 10 + stacks + public $/mg when they exist, come-back access.
- Phone after unlock. Not a wall in front of the table.

## Data

- Live original 8-column table frozen from https://peptide-quality-index.vercel.app/rankings (`web/data/rankings.json`). Research/Tech has not refreshed ranks. Top 10 stays Panda through PureRawz.
- Listing prices and `$/mg` only from `data/seed/v2026-08-22.2/product_lot_coa_pilot.json`, and only when those fields already exist. Missing is not stated.

## Preview

```bash
python3 web/serve.py
```

Open http://127.0.0.1:4173/

## Locks

Informational. Research use. No dosing. No medical claims. No checkout. Public copy says batch.
Talk to a doctor is a CTA only. Pointing to a doctor is not a prescription.
