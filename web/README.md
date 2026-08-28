# Draft women-first face

Not live until C Wall says ship.

This is a face on the existing informational US research-use rankings. It is not a new product, not a cart, and not a 503/pharmacy list mixed into the table.

## What it uses

- Live original 8-column table frozen from https://peptide-quality-index.vercel.app/rankings (`web/data/rankings.json`). Research/Tech has not refreshed ranks. Top 10 stays Panda through PureRawz.
- Listing prices only from `data/seed/v2026-08-22.2/product_lot_coa_pilot.json`, and only when both `size_label` and `listed_price_usd` exist. Missing is not stated.

## Counts

If a count is printed: **89 US research-use**. Quiet optional: 96 listed · 89 research-use. Never “96 US research-use.” No 4/13/26/16/7 mix on this face.

## Preview

```bash
python3 web/serve.py
```

Open http://127.0.0.1:4173/

## Locks

Informational. Research use. No dosing. No medical claims. No checkout. Public copy says batch.
