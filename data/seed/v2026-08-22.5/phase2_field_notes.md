# Phase 2 field notes — 503A / 503B commercial map

**Run:** restart fresh 2026-08-22 (PT) / v2026-08-22.5-phase2-503  
**Prior stall:** mid-fetch with no output dir — this run created `/workspace/pqi-briefs/machine-readable/v2026-08-22.5-phase2-503/` first and wrote files before finish.  
**SoT:** `/workspace/pqi-briefs/phase2-503a-503b-commercial-map-brief.md` (LOCKED N=12)  
**Informational only.** Listing ≠ verified. No invented prices/COAs/registration.

## Method
1. Seed check: `enforcement_watch.json` — **zero** usable 503A/503B seeds (RUO / telehealth_clinic / other only). Skipped RUO/telehealth.
2. Discovery hint only: [BatchGuild pharmacies](https://batchguild.com/pharmacies/) — names only; **re-verified entity_type on facility sites** (BatchGuild mislabeled Hallandale as 503B; facility about page self-IDs **503A**).
3. Facility websites + public about/503A/503B/product pages. FDA registered outsourcing facilities list: **HTTP 401** from research env → mark `needs_fda_repull` on 503B rows; do not invent registration.
4. Stop rule: reached **N=12** with sell-direct/price signal on every included row (provider portal / quote / office-use order path). Did **not** hit 5 consecutive no-signal failures.

## Counts
| Slice | N |
|-------|---|
| 503A | 6 |
| 503B | 6 |
| **Total** | **12** |
| Rows with `pharmacy_lists_peptide=true` | 9 |
| Public dollar prices captured | **0** (all `quote_only` or `not_public`) |

## 503A rows (sourced)

| id | Primary URL | Sell-direct | Price | Peptides named on site |
|----|-------------|-------------|-------|------------------------|
| 503a-hallandale-pharmacy-fl | https://hallandalerx.com/ | provider_only | not_public | semaglutide, tirzepatide, sermorelin |
| 503a-belmar-pharmacy | https://www.belmarpharmasolutions.com/discover/about-belmar/belmar-503a-compounding-pharmacy/ | provider_only | quote_only | peptides/GLPs (category language) |
| 503a-olympia-pharmacy | https://www.olympiapharmacy.com/503a-pharmacy/ | patient_via_provider | not_public | none on 503A page sample |
| 503a-tailor-made-compounding-ky | https://tailormadecompounding.com/ | provider_only | not_public | peptide therapies (category) |
| 503a-red-rock-compounding-ut | https://redrockhomepharmacy.com/ | patient_via_provider | not_public | sermorelin |
| 503a-anazaohealth-tampa | https://anazaohealth.com/ | provider_only | quote_only | sermorelin acetate (503A list) |

### Key 503A evidence URLs
- Hallandale 503A self-ID: https://hallandalerx.com/about/
- Hallandale peptide category: http://hallandalerx.com/products/?_product_categories=peptide-therapy
- Belmar 503A: https://www.belmarpharmasolutions.com/discover/about-belmar/belmar-503a-compounding-pharmacy/
- Olympia 503A: https://www.olympiapharmacy.com/503a-pharmacy/
- Tailor Made homepage 503A badge: https://tailormadecompounding.com/
- Red Rock quality/503A: https://redrockhomepharmacy.com/quality
- Anazao IV lists 503A patient-specific: https://anazaohealth.com/iv-therapy

## 503B rows (sourced)

| id | Primary URL | Sell-direct | Price | Peptides named on site |
|----|-------------|-------------|-------|------------------------|
| 503b-empower-pharmacy-tx | https://empowerpharmacy.com/ | provider_only | quote_only | tirzepatide, semaglutide, GHK-Cu, sermorelin, gonadorelin, NAD+ |
| 503b-olympia-pharmaceuticals | https://olympiapharmacy.com/ | provider_only | not_public | NAD+ (+ Peptides category) |
| 503b-anazaohealth-las-vegas | https://anazaohealth.com/ | provider_only | quote_only | NAD+ (503B office-use list) |
| 503b-belmar-select-outsourcing | https://www.belmarpharmasolutions.com/discover/about-belmar/belmar-503b-outsourcing-facility/ | provider_only | quote_only | none (hormone pellets / T cyp blends) |
| 503b-wells-pharmacy-network | https://wellsrx.com/ | provider_only | not_public | sermorelin |
| 503b-farmakeio-outsourcing-tx | https://farmakeio.com/ | provider_only | quote_only | none on homepage sample |

### Key 503B evidence URLs
- Empower peptides + dual 503A/503B: https://www.empowerpharmacy.com/compound-medication/peptides/
- Empower compounding catalog posture: https://www.empowerpharmacy.com/compounding-pharmacy/
- Olympia Pharmaceuticals homepage 503B claim: https://olympiapharmacy.com/
- Anazao about (LV 503B + Tampa 503A): https://anazaohealth.com/
- Belmar Select 503B: https://www.belmarpharmasolutions.com/discover/about-belmar/belmar-503b-outsourcing-facility/
- Wells about dual facilities: https://wellsrx.com/about-wells-compounding-pharmacy/
- Wells 503A vs 503B explainer: https://wellsrx.com/503a-vs-503b-compounding-pharmacies/
- FarmaKeio 503B bulk pellets: https://farmakeio.com/

## FDA outsourcing list
- Attempted: https://www.fda.gov/drugs/human-drug-compounding/registered-outsourcing-facilities → **401** (curl + WebFetch).  
- Action: `fda_registration_posture` = self-claim language only; `fda_source_url` retained; flag **needs_fda_repull** in notes/data_quality. Do not treat self-claim as verified FDA registration.

## Candidates reviewed / skipped (not invented into N)
| Candidate | Why skipped / deferred |
|-----------|------------------------|
| Strive Pharmacy | Strong peptide listing + Rx required, but homepage/about sample lacked explicit "503A" self-ID string; prefer explicit self-ID rows. |
| Fagron Sterile Services | Clear 503B hospital/OR sterile; weak peptide/commercial-map fit vs selected set. |
| Leiters Health | Clear 503B hospital/ophtho; no peptide listing on homepage sample. |
| BPI Labs (bpi-labs.com) | Sterile injectable manufacturer posture; BatchGuild 503B peptide hint not corroborated as peptide compounder on sampled site. |
| redrockrx.com | Wrong entity (LTC pharmacy); correct Red Rock is redrockhomepharmacy.com. |
| bpilabs.com (beauty CMO) | Wrong entity vs BPI Labs LLC Largo. |
| All enforcement_watch RUO / telehealth / FormPour / etc. | Hard wall: not 503A/503B. |

## Gaps / caveats
- **No public retail prices** found across the 12 — boards should default to quote_only / not_public.
- Dual-operator brands appear as **separate typed rows** when facilities are clearly split (Anazao Tampa 503A + LV 503B; Belmar Pharmacy 503A + Belmar Select 503B; Olympia Pharmacy 503A + Olympia Pharmaceuticals 503B). Empower and Wells are single brand pages claiming both; typed to **503B** for OF map with dual noted.
- Tailor Made fetch included unrelated spam text in page body — confidence **medium**.
- BatchGuild is discovery only; never used as verification of type or peptide listing.
- Phase 3 telehealth cost map OFF; no RUO re-scrape; no Sep 2025 letter crawl; no mass lot scrape.

## Deliverables in this directory
1. `phase2_field_notes.md` (this file)
2. `commercial_map_503a.json` + `.csv`
3. `commercial_map_503b.json` + `.csv`
4. `commercial_map_503_all.json`
5. `copy_glossary_phase2_addendum.md`
