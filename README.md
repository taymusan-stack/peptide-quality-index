# Peptide Quality Index

Informational directory for research-use (RUO) peptide vendors, 503A / 503B compounding pharmacies, and telehealth pathways. COA-first: Certificates of Analysis before marketing claims.

This repo is the index data, schema, taxonomy, and verification store. It is not grokbot. It is not the marketing front-end.

- Schema v1 locks: [`docs/schema.md`](docs/schema.md)
- Marketing data contract: [`docs/for-marketing.md`](docs/for-marketing.md)
- USP hypothesis (v1): [`docs/usp.md`](docs/usp.md)
- Methodology first ship: [`docs/methodology-first-ship.md`](docs/methodology-first-ship.md)
- RUO product/lot COA pilot: [`data/seed/v2026-08-22.2/`](data/seed/v2026-08-22.2/) (186 rows, 63 portal-verified)
- Enforcement, lab catalog, shortage context: [`data/seed/v2026-08-22.1/`](data/seed/v2026-08-22.1/)
- Phase 1 RUO test-depth / glossary pack: [`data/seed/v2026-08-22.4/`](data/seed/v2026-08-22.4/) (field notes, Copy glossary, summary, lab catalog CSV; informational, not COA rows)
- Phase 2 503A/503B commercial map: [`data/seed/v2026-08-22.5/`](data/seed/v2026-08-22.5/) (informational; Coming→later boards; not the first-ship RUO pin)
- Vercel draft, reference/example only: https://peptide-quality-index.vercel.app/rankings

Draft women-first face (not live until C Wall says ship): [`web/`](web/). It sits on the live original eight-column ranking. It is not a cart and not a 503/pharmacy list mixed into that table.

Marketing owns the public UI rebuild. The Vercel draft is not the product.

No dosing. No medical claims. Not a pharmacy and not affiliated with any vendor.
