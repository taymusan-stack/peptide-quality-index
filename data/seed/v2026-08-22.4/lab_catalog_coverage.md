# Lab method catalog coverage — v2026-08-22.4

**Pack:** `v2026-08-22.4-lab-catalog`  
**As of:** 2026-08-22 (refresh UTC ~2026-08-23T02:00Z → **PT 2026-08-22 evening**)  
**Supersedes:** machine-readable `lab_method_catalog.json` v2026-08-22.1  
**Posture:** Informational directory only. No invented COAs. No medical advice. No 503/telehealth. No mass vendor scrape / Sep crawl.

## USP label disclaimer

USP chapter titles (e.g. USP <85>, USP <71>, USP <201>) appear in this catalog as method_label / usp_chapter_label strings only when a lab portal uses that language. They do NOT claim that any RUO lot, vendor product, or directory row meets a USP monograph, is sterile, is endotoxin-compliant, or is pharmaceutical-grade. Never treat a USP label as a pass.

## What refreshed this pass

| Source | Status |
|--------|--------|
| Janoshik `/services/`, `/verification/`, `/c/peptides/`, pricelist SKUs (BPC-157, GLP-1 blind, AOD LCMS+CHNS, LAL endotoxin, TAMC+TYMC, heavy metals, CHNS) | **Refreshed via curl** (WebFetch timed out on services; curl returned live HTML — **not** Cloudflare-blocked this pass; Phase 1 had noted CF block) |
| MZ COA testing | Refreshed (WebFetch) — HPLC-UV+MS; purity excludes activity/sterility/endotoxins/HM/pH |
| MZ techniques | Refreshed — Waters Acquity / Bruker QTOF / Thermo LTQ Velos Pro |
| MZ coming-soon | Refreshed — USP `<85>` endotoxin **now available**; USP `<71>` sterility early-2025 framing |
| MZ about / home | Refreshed — DEA RP0584676; Tucson address |
| Colmaric home / about / peptide blog | Refreshed — TLC/HPLC/MS peptide framing; ISO/IEC claim on home |
| Colmaric dietary-supplements (USP `<201>` etc.) | **WebFetch timeout** — retain as medium-confidence site claim; scope unverified |

## Phase 1 seed vs catalog (skeptical)

| Lab | Seed rows | What actually appeared | Catalog add-ons still mostly absent on cards |
|-----|----------:|------------------------|-----------------------------------------------|
| **Janoshik** | 97 | HPLC 82; MS 33; purity 48; endotoxin 41; amount 6; identity 4; HM 1 | TAMC+TYMC / CHNS / TFA / pH / contamination screens **catalog_only** on seed tags; sterility_status tested=0 for Janoshik |
| **MZ Biolabs** | **0** | — | All assays `catalog_only` until rows attach |
| **Colmaric** | **0** | — | All assays `catalog_only` / quantity `unknown` |

**Rule:** Score what is on the row. HPLC ≠ MS identity ≠ endotoxin ≠ sterility. Portal match upgrades provenance, not assay completeness.

## Schema field map summary

| Directory field | Populated when assay present | Remains null when |
|-----------------|------------------------------|-------------------|
| `methods_present` | Method tag stated (HPLC, MS, HPLC-UV, …) | Empty / not extractable |
| `analytes_present` | Analyte tag stated (purity, identity, endotoxin, amount, …) | Empty / not stated |
| `purity_pct` | Numeric purity on sources used | Marketing-only %; blend purity omitted; portal PNG not OCR'd |
| `endotoxin` | Endotoxin value/statement on sources used | Add-on not run / not stated |
| `sterility_status` | `tested` / `not_tested` / `unknown` from evidence | Default `unknown`; never invent pass |
| `strength_mg` | Numeric amount/content stated | Amount not stated |
| `peptide_identity` | Labeled peptide on row | Non-peptide / unknown |
| `janoshik_task_number` / `janoshik_unique_key` | Published Task#+key | Non-Janoshik or unpublished |
| `verification_status` | Ladder rung (`verified_on_lab_portal` | `vendor_pdf` | `client_pdf_only` | `unverified`) | Use `unverified` — do not leave blank |
| `commissioning_party` | Who commissioned | `unknown` |
| `pharmacy_lists_peptide` | Pharmacy listing only | Always null in RUO pilot — **≠** verified |

No dedicated directory scalars for TFA / pH / heavy_metals / raw_data — those map only via `analytes_present` (or not at all).

## verification_status_enum (unchanged)

`verified_on_lab_portal` | `vendor_pdf` | `client_pdf_only` | `unverified`

(Includes `vendor_pdf` middle rung used in Phase 1 pilot.)

## Files

- `lab_method_catalog.json` — version `2026-08-22.4`
- `lab_method_catalog.csv` — flat assay rows (25 assays)
- `lab_catalog_coverage.md` — this file
