# PQI Copy glossary — Phase 1 (RUO test depth)

**For:** Copy & Design  
**As of:** 2026-08-22  
**Tone:** Plain language. Skeptical. No marketing fluff. No purity numbers invented for examples.  
**Scope:** Informational directory. Not medical advice. Not “safe to inject.” Not FDA-approved / cGMP claims.

Use these terms consistently on tiles, tooltips, and footnotes. Prefer the **ladder word** (`verified_on_lab_portal`, etc.) over the vague English word “verified” alone.

---

## Verification status ladder

Strongest → weakest. A row gets **one** status.

| Status (machine) | Plain-language label (suggested) | Means | Does **not** mean |
|------------------|----------------------------------|-------|-------------------|
| `verified_on_lab_portal` | **Matched on lab portal** | Lot/task + key checked on the lab’s own verification site; report record found. | Every retail vial matches; all analytes passed; buyer-independent test; “pharma grade.” |
| `client_pdf_only` | **Lab PDF opened** | We read fields from a lab-issued PDF; portal not re-checked (or portal needs a code we don’t have). | Portal-confirmed; complete panel. |
| `vendor_pdf` | **Vendor-published COA** | Vendor hub/card/library links a COA attributed to a lab; we did **not** confirm on the lab portal this pass. | Lab portal match; independent audit. |
| `unverified` | **Unverified** | No usable COA for this row (e.g. accessory SKU without peptide report). | “Failed test.” |

**Copy don’ts**
- Don’t say “Lab Verified” as a vague badge — say which rung.
- Don’t collapse the ladder into a single green check.
- Don’t use BatchGuild-style pharmacy “Verified” language here (see below).

---

## `pharmacy_lists_peptide` ≠ verified

| Term | Meaning |
|------|---------|
| `pharmacy_lists_peptide` | A pharmacy **website lists** that peptide. Listing only. |
| `verification_status` | Lot/COA provenance ladder above. |

**Competitor trap:** BatchGuild marks pharmacies “Verified” when they publicly list a peptide — **not** when a lot COA is confirmed. Merit Verified’s COA catalog is “COA on file / scored vendor,” not our ladder.  
**PQI rule:** Never reuse the word “Verified” for pharmacy listing. In this RUO pilot the field is always null — hide or N/A, don’t imply pharmacy status.

---

## What `null` means

| Situation | User-facing meaning |
|-----------|---------------------|
| `purity_pct` is null | **No numeric purity on the sources we used.** Common when: hub shows only “99%+” marketing (ignored); blend/amount-only card; portal returns a **PNG image** with no structured fields and we do **not** OCR. |
| Analyte missing from `analytes_present` | **That test was not stated** on the report/card we saw. |
| `endotoxin` / sterility null or unknown | **Not reported here** — not “passed,” not “failed.” |
| `methods_present` empty | Method tags not extractable from the card/hub this pass. |

**Hard rule for UI:** `null ≠ pass`. Never fill a blank with a guess, a competitor’s number, or an OCR fantasy. Portal match upgrades **where the document lives**, not the assay table.

---

## Methods (how the lab says it measured)

| Term | Plain language | Caveat |
|------|----------------|--------|
| **HPLC** | High-performance liquid chromatography — separates components; often used for **purity %** and amount. | Alone does not always prove molecular identity (that’s what MS is for). |
| **HPLC-UV** | HPLC with ultraviolet detector (common on purity COAs). | Same family as HPLC; UV is the detector, not a second identity proof. |
| **MS** | Mass spectrometry — measures mass; supports **identity**. | “MS on the catalog” ≠ “MS on this lot’s card.” |
| **LC-MS** | Liquid chromatography + mass spec (often identity + related impurities). | Seen rarely in seed rows (e.g. one opened Kovera PDF). |
| **LAL** | Limulus Amebocyte Lysate — classic **endotoxin** screen (Janoshik-style add-on language). | Add-on; not automatic on every peptide SKU. |
| **USP &lt;85&gt;** | Pharmacopeia chapter for bacterial endotoxins (MZ-style add-on language). | Separate from MZ’s standard purity COA. |
| **USP &lt;71&gt;** | Pharmacopeia chapter for **sterility** tests. | Slow / expensive; almost never present on seed RUO cards (`tested` sterility ≈ 1 row). |
| **TAMC / TYMC** | Total aerobic microbial count / total yeast & mold count — bioburden-style screen (Janoshik sterility add-on framing). | Not the same as full USP&lt;71&gt; sterility; still an add-on. |
| **CHNS** | Elemental analysis (carbon/hydrogen/nitrogen/sulfur) — sometimes used for amount/composition of raw material. | Catalog add-on; **not** observed on seed-vendor method tags this pass. |
| **TLC** | Thin-layer chromatography — quick identity / major impurity screen (Colmaric framing). | Not seen on seed rows (Colmaric unused by seed vendors). |
| **PCR** (microbial) | DNA amplification screen for certain microbes. | Rare accessory-adjacent; not a purity method. |

**One-liner for tooltips:** “Method = how it was measured. Missing method = we don’t claim that measurement.”

---

## Analytes (what was claimed present on the report)

| Analyte | Plain language | Seed-pack reality check |
|---------|----------------|-------------------------|
| **purity** | How much of the peak/signal is the target vs impurities (usually HPLC %). | Often missing even when portal-matched (blends, amount-only, PNG-only portal). |
| **identity** | Evidence the molecule is what the label says (often MS / LC-MS). | Sparse on hub cards; don’t assume from HPLC alone. |
| **amount / net_content / quantity** | How much material is in the vial (mg). | Sometimes present when purity % is not (e.g. NAD+, blends). |
| **endotoxin** | Bacterial endotoxin level (EU/vial or similar). | Common on some Panda/Prime Janoshik cards; rare on Evolabs/BioInfinity hubs. |
| **sterility** | Whether a sterility protocol was run. | Effectively absent in seed data. |
| **heavy_metals** | As/Cd/Pb/Hg-style screen. | Essentially absent (≈1 stated). |
| **TFA / pH / residual solvents** | Other chemistry panels labs may offer. | Catalog/add-on territory; don’t imply present. |

**Score only analytes present.** A row with purity but no endotoxin is not an “endotoxin pass.”

---

## Labs (defaults + what seed vendors actually used)

| Lab | Role in PQI | Public verify? | Seed-vendor footprint |
|-----|-------------|----------------|-----------------------|
| **Janoshik Analytical** | Default | Yes — Task# + unique key | Dominant on Panda/Prime; many Evolabs claims without keys |
| **MZ Biolabs** | Default | No public portal observed (client PDF) | **0** seed rows |
| **Colmaric Analyticals** | Default | No public portal observed | **0** seed rows |
| Verum / Kovera / ILS / others | Appear on vendor hubs | Varies; often none | Present in pilot; not PQI “defaults” |

**Commissioning party:** In this pilot every row is `vendor` (vendor paid/shipped the sample). That is **not** the same as a buyer-commissioned retest. Say “vendor-commissioned COA” when you need the distinction.

---

## Competitor words to avoid copying

| Their phrase | Risk | PQI substitute |
|--------------|------|----------------|
| Merit “Verified” / COA catalog count | Sounds like full panel pass | Ladder status + analytes listed |
| PeptideWiki “Lab Verified” count | Aggregate, not per-row gate | Per-row ladder |
| PeptiDex “Pass Rate” | Can hide nulls | Show present analytes; null = not scored |
| BatchGuild pharmacy “Verified” | Listing ≠ lot COA | `pharmacy_lists_peptide` only |

---

## Safe microcopy examples

- “Matched on Janoshik portal (Task + key). Purity not stated on sources we used.”
- “Vendor-published COA (Verum library). Endotoxin not listed.”
- “Lab PDF opened (Kovera). Portal not re-checked.”
- “Unverified — no peptide COA for this SKU.”
- “Pharmacy listing status: N/A (RUO).”

## Unsafe microcopy (do not ship)

- “Independently verified pure / sterile / endotoxin-free.”
- “99%+” when no numeric `purity_pct`.
- “Lab Verified” without naming the ladder rung.
- “Same as pharmacy Verified.”
