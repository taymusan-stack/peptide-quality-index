# PQI Phase 1 — RUO test-depth field notes

**Pack:** `v2026-08-22.4-phase1-test-depth`  
**As of:** 2026-08-22 (pilot scrape UTC `2026-08-22T23:59:13Z`; portal recheck UTC `2026-08-23T00:16:49Z`)  
**Audience:** Chief / Strategist  
**Posture:** Informational directory only. No medical advice. No invented COAs / purity / endotoxin / lot numbers. `null ≠ pass`.

**Primary evidence**
- Lab defaults: `/workspace/pqi-briefs/machine-readable/lab_method_catalog.json` (+ `02-lab-method-catalog.md`)
- Pilot: `v2026-08-22.2/product_lot_coa_pilot.json` + `pilot_coverage.md`
- Portal merge: `v2026-08-22.2-portal/product_lot_coa_pilot_merged.json` + `portal_recheck.md`
- Competitor framing: `03-competitor-hygiene.md`
- Counts: sibling `phase1_summary.json`

**Seed vendors (186 rows):** Panda Peptides (34), Prime Peptides (43), BioInfinity Lab (47), Evolabs Research (62).  
**Default labs (catalog):** Janoshik, MZ Biolabs, Colmaric. **MZ and Colmaric have zero seed-vendor report rows in this pilot.**

Lab-page refresh this pass: MZ COA + techniques pages re-fetched (claims unchanged vs catalog). Colmaric peptide blog re-fetched (TLC/HPLC/MS). Janoshik `/services/` blocked by Cloudflare on refresh — catalog v2026-08-22.1 retained. Sep 2025 crawl OFF; no mass vendor scrape.

---

## 1) Methods / analytes that actually show up on seed-vendor reports (by lab)

What vendors *publish* is thinner than what default labs *advertise*. Counts = rows where the method/analyte appears in `methods_present` / `analytes_present` (stated on hub card, library table, or opened PDF — not inferred).

| Lab on reports | Rows | Methods seen | Analytes stated | Notes |
|----------------|-----:|--------------|-----------------|-------|
| **Janoshik Analytical** | 97 | HPLC 82; MS 33; empty methods 15 | purity 48; endotoxin 41; amount 6; identity 4; heavy_metals 1 | Dominates Panda+Prime verified set; Evolabs hub claims Janoshik on 33 lots but **no Task#+key** → stayed `vendor_pdf`, analytes empty, purity null |
| **Verum Analytics** | 46 | HPLC-UV 46; MS 46 | purity 46 only | BioInfinity library table; individual PDFs not opened; endotoxin **not** listed on library |
| **Kovera Labs** | 28 | HPLC 27; MS 26; LC-MS 1 | only 1 opened PDF has analytes (purity/net_content/identity/endotoxin) | Evolabs hub; 27/28 purity null (hub “99%+” ignored) |
| **ILS Laboratories** | 3 | HPLC 3 | purity 3 | Panda current lots; Janoshik portal N/A |
| **Prime misc. (non-default)** | Bioviridian 3, Freedom 3, Horizon 1, Accumark 1, Vanguard 1 | HPLC (all) | purity + some endotoxin | Skipped for Janoshik portal recheck |
| **MZ Biolabs / Colmaric** | **0** | — | — | Catalog defaults only this pass; no seed COA rows |

**Catalog vs reports (skeptical read)**
- Janoshik *catalog* sells HPLC base + LAL / TAMC+TYMC / HM / TFA / pH / CHNS / LCMS contamination as add-ons. *Reports in pilot:* mostly HPLC ± MS; endotoxin often stated on Panda/Prime cards; sterility almost never (`sterility_status`: unknown 151, not_tested 34, tested 1). CHNS / USP&lt;71&gt; / TAMC+TYMC do **not** appear as stated methods on seed rows.
- MZ *catalog/page* (refreshed): HPLC-UV + MS identity; purity COA **explicitly excludes** activity, sterility/endotoxins, heavy metals, pH; USP&lt;85&gt; / USP&lt;71&gt; are separate add-ons. Zero seed rows to score.
- Colmaric *catalog/page* (refreshed): TLC / HPLC / MS for manufacturer/distributor QC; no public portal. Zero seed rows.

**Practical takeaway:** Score what is on the row. Do not score catalog add-ons as present. HPLC on a card ≠ MS identity ≠ endotoxin ≠ sterility.

---

## 2) Portal vs `vendor_pdf` vs `client_pdf_only` — counts and when each applies

Ladder used in pilot+portal (strongest → weakest):  
`verified_on_lab_portal` > `client_pdf_only` > `vendor_pdf` > `unverified`.

| Status | Count | When it applies (observed) |
|--------|------:|----------------------------|
| **verified_on_lab_portal** | **63** | Task# + unique key submitted to Janoshik verification; report title/image confirmed. Panda 31 + Prime 32. Prior pack had **0**. |
| **vendor_pdf** | **120** | COA card/hub/library/PDF link attributed to a lab, but **no** successful lab-portal key match this pass. Includes: BioInfinity Verum table (46); Evolabs Janoshik/Kovera hubs without keys/opened PDFs (60); Panda ILS (3); Prime non-Janoshik or key-missing (11). |
| **client_pdf_only** | **1** | Lab-issued PDF opened and fields read, portal not re-checked. Evolabs BPC-157 / Kovera `KVR-2026-423BF8` (batch `EVO5212026`, purity **99.749% as printed**). |
| **unverified** | **2** | Non-peptide accessories (BAC/recon water) with `product_price_only` — not peptide COA rows. |

**Portal recheck mechanics (Panda+Prime Janoshik only):** 77 attempts → 63 match / 0 fail / 2 key_missing / 12 skipped_non_janoshik. Captcha: none observed.  
**Not portal-verified this pass:** BioInfinity (Verum), Evolabs (no extractable Janoshik keys; Kovera access-code portal held), Prime cards from Horizon/Bioviridian/Freedom/Accumark/Vanguard.

Soft schema note: locked README enum was `verified_on_lab_portal | client_pdf_only | unverified`; pilot correctly inserted **`vendor_pdf`** as the common middle rung. Keep it.

---

## 3) `commissioning_party` patterns

| Value | Count |
|-------|------:|
| `vendor` | **186 / 186** |
| `buyer` / `group` / `unknown` | **0** |

Every seed COA is vendor-commissioned (or treated as such): vendor ships sample / publishes hub PDF. No buyer- or group-commissioned independent lots in this pack.  
Trust implication (from lab catalog): client-issued model means portal verify proves **lab record for that task**, not that every retail vial matches, and not buyer independence. Keep `commissioning_party` first-class on ingest; do not silently upgrade vendor-commissioned portal matches to “independent third-party tested.”

---

## 4) Where nulls appear (esp. purity when portal is PNG-only)

| Field | Null / empty | Pattern |
|-------|-------------:|---------|
| `purity_pct` | **78 / 186** | Evolabs 61/62 null (hub marketing 99%+ discarded). Portal-verified: 16/63 still null (blends, amount-only cards, BAC water). **Portal never supplies structured purity** — `portal_fields` has task/key/report image URL only; note: “report image (not structured purity/date); purity/date not OCR’d — not invented.” Where purity is present on a portal-verified row, it came from the **vendor hub card**, not OCR of the PNG. |
| `endotoxin` | **134 / 186** | Present mainly on Panda/Prime Janoshik cards (~42 Janoshik non-null). BioInfinity library: absent. Evolabs: almost absent except opened Kovera PDF. |
| `analytes_present` empty | **64** | Mostly Evolabs hub rows (61). |
| `methods_present` empty | **18** | Blends / amount-only / accessories. |
| `sterility_status` | unknown 151 / not_tested 34 / tested 1 | Sterility is not a scored analyte in practice for this seed set. |
| `pharmacy_lists_peptide` | **186 null** | N/A for RUO; field reserved so it cannot be confused with verification. |
| `janoshik_task_number` / `unique_key` | **123 null** | Only the 63 portal matches have both set. |

**Rule for Copy/Product:** Portal match upgrades *provenance*, not assay completeness. A green “verified on lab portal” tile with `purity_pct = null` is correct — do not invent a number from the PNG.

---

## 5) Diff vs Merit Verified COA-catalog framing and BatchGuild pharmacy “Verified”

(Source: `03-competitor-hygiene.md` + PQI schema locks.)

| Frame | What “Verified” means there | PQI Phase 1 stance |
|-------|-----------------------------|--------------------|
| **Merit Verified** | Vendor Merit Score + COA-on-file index (Lab-direct / Vendor-published / Aggregated). Large COA counters; weak null≠pass; thin RUO vs 503A/503B tagging; doesn’t index endotoxin/HM/microbes yet. | We do **not** score “COA exists.” We score **ladder rung + analytes present**. Null analyte ≠ pass. Entity-type = RUO on every seed row. |
| **BatchGuild pharmacy “Verified”** | Pharmacy publicly **lists** a peptide on its site — explicitly **not** lot/COA verified. | Separate field: `pharmacy_lists_peptide`. Always null in this RUO pilot. **Never** alias to `verification_status`. |
| **PQI** | Lot/batch + lab match on ladder: lab-portal key > lab/client PDF > vendor PDF > unverified. `commissioning_party` first-class. Enforcement flags separate. Informational directory — not affiliate-ranked trust UI. | This pack: 63 portal, 1 client PDF, 120 vendor PDF, 2 unverified accessories. |

Cross-cut competitor hygiene already states: most “verified” language = document presence / lab-link / editorial inclusion — **not** safe, **not** all-analytes-passed, **not** 503B/cGMP. Phase 1 data confirms the gap is real: even portal-verified Janoshik rows often lack MS, endotoxin, and/or numeric purity.

---

## Gaps / held (do not over-claim)

1. Evolabs Janoshik lots lack published keys → cannot portal-verify without new scrape.
2. Kovera verify portal (access code) and BioInfinity individual Verum PDFs held.
3. MZ / Colmaric unused by seed vendors — defaults remain catalog-only until A-tier/other packs attach rows.
4. No OCR of Janoshik report PNGs (by design).
5. Sep 2025 50+ letter crawl OFF; A-tier pack exists separately (`v2026-08-22.3-atier`) — out of Phase 1 seed scope.

## Files this pack
- `phase1_field_notes.md` (this file)
- `copy_glossary.md`
- `phase1_summary.json`
