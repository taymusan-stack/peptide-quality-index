# Copy glossary addendum — Phase 2 (503A / 503B commercial map)

**As of:** 2026-08-22 · **Dataset:** v2026-08-22.5-phase2-503  
**Use:** Board stubs → live copy. Informational only. Not medical/legal advice.

## Entity walls (never blend)
| Term | Meaning for PQI boards |
|------|------------------------|
| **503A** | Traditional compounding pharmacy; patient-specific prescription; primarily state BOP / USP. Separate scorecard from 503B / RUO / telehealth. |
| **503B** | FDA-registered outsourcing facility (when registration confirmed); office-use / larger batches under cGMP posture. Separate scorecard. |
| **RUO** | Research-use-only vendors — Phase 1 lane. Never mix into 503 boards. |
| **Telehealth clinic** | Phase 3 cost map — queued after Phase 2. Not a pharmacy scorecard. |

## Sell-direct vocabulary
| Label | Board meaning | Copy do / don't |
|-------|---------------|-----------------|
| **provider_only** | Account / portal / Rx submit for licensed providers or clinics; no public patient cart for compounds. | Do: "Providers order via portal." Don't: "Buy online now" for sterile compounds. |
| **patient_via_provider** | Patient path exists but requires a partner clinician / Rx. | Do: "Available through your provider / partner clinic." Don't: imply DTC drug checkout. |
| **unclear** | Site does not make channel clear. | Do: "Channel unclear — check with pharmacy." Don't: invent DTC or office-use. |

## Price posture
| Label | Meaning |
|-------|---------|
| **public_sku** | Named SKU/size with a dollar amount on a public page (rare in this pilot — **0 of 12**). |
| **quote_only** | Formulary/catalog visible or implied; dollars only after contact / account. |
| **not_public** | Products named; no pricing mechanism disclosed beyond Rx/partner flow. |

**Hard rule:** Never invent prices. Empty `example_public_prices` means none observed.

## Listing ≠ verified
| Field / phrase | Correct use |
|----------------|-------------|
| **pharmacy_lists_peptide** | Facility **names** a peptide on its own site. Boolean listing fact only. |
| **Verified** | **Forbidden** as a synonym for listing. Do not say "verified peptide pharmacy" from Phase 2 rows. |
| **peptides_listed** | Observational string list from public pages — not an endorsement or eligibility claim. |

## FDA registration posture (copy-safe)
| Safe phrasing | Avoid |
|---------------|--------|
| "Pharmacy **states** it operates as a 503A / 503B facility on its website." | "FDA-approved compounding pharmacy." |
| "FDA outsourcing-facility list **not re-pulled** this run (needs_fda_repull)." | Inventing "currently registered" from BatchGuild or blogs. |
| "Self-claimed FDA-registered 503B — confirm on FDA list." | Treating discovery directories as registration proof. |

## Coming → live stubs
| Stub state | When to flip live |
|------------|-------------------|
| **Coming — 503A board** | Enough Phase 2 rows with `entity_type=503A`, hard walls in UI, listing≠verified disclaimer. |
| **Coming — 503B board** | Same for 503B; show `needs_fda_repull` where FDA HTML blocked. |
| **Do not flip** | If row lacks sell-direct/price signal and was only a name hint; if entity is RUO/telehealth. |

## Hygiene / COA language
- `coa_hygiene_note` is **observe-only** (facility claims testing/COA/lot verification).
- Not a RUO portal verify; not a PQI COA attestation.
- Copy: "Pharmacy describes batch testing / COA release" ≠ "PQI verified this lot."

## Disallowed copy (Phase 2)
- Dosing, medical claims, "safe to compound," buy-for-human-use CTAs.
- Vendor tiers / "best pharmacy."
- Shortage/discretion as endorsement.
- Blended 503A+503B+RUO rankings.
