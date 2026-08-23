# Methodology first ship

Strategist / Chief skeleton for the public methodology page and the home teaser. Informational only. No dosing. No medical claims. No buy-for-human-use copy.

Engineering locks: [`schema.md`](schema.md). Positioning: [`usp.md`](usp.md). Marketing contract: [`for-marketing.md`](for-marketing.md).

The Vercel draft methodology (vendor tiers, S/A/B/C/D, "How we score a peptide vendor") is not this page. Do not ship it.

---

## Home teaser

Homepage copy for first ship. Say what PQI shows, then send the reader to an RUO lot table.

**Line.** PQI shows what was tested, how, and how the match was proven. First ship is research-use lots. It is not a vendor scoreboard.

**Visible chips.** `Verified · Lab portal` / `Vendor PDF` / `Client PDF` / `Unverified`

**Proof on the home page.** An S-tier RUO lot table. Click-through opens lot detail. That page shows methods on this report, analytes present, verification ladder, and who commissioned the test. Price and $/mg sit next to the listing. They are not a quality score.

**Not on the home page.** Vendor tiers. One blended rank across RUO, 503A, 503B, and telehealth. A pharmacy-listing "Verified" badge. 503A / 503B / telehealth depth. Those lanes are Coming stubs.

Seed pin for first ship: [`v2026-08-22.2`](../data/seed/v2026-08-22.2/) lots plus [`v2026-08-22.1`](../data/seed/v2026-08-22.1/) labs and enforcement.

---

## 1. Informational only

This is a directory of sourced test evidence. It is not a pharmacy, not a vendor, and not medical advice.

Do not write dosing. Do not write "safe to inject," "pharma grade," "cGMP," or "FDA-approved" as a PQI conclusion. Do not tell anyone to buy peptides for human use.

A clean COA is not a recommendation.

---

## 2. Entity walls

Every entity is one of `RUO` | `503A` | `503B` | `telehealth_clinic` | `other`.

Each type gets its own scorecard. Never one blended leaderboard. A 503B pharmacy and an RUO vendor can list the same peptide name. They do not share a rank.

First ship ships the RUO lane. Other types stay Coming stubs. Do not fill those stubs with Vercel draft vendor scores.

---

## 3. Lot grain

Quality evidence is scored at:

**entity × product SKU × size × lot × lab report**

"Vendor carries BPC-157" is a listing fact. It is not a quality row.

Vendor tiers are out of first ship. They are not derived from a listing, and they are not invented as a vendor-level score.

---

## 4. Verification chips

Visible chips, label freeze:

`Verified · Lab portal` / `Vendor PDF` / `Client PDF` / `Unverified`

Machine map:

| Visible chip | `verification_status` | Badge |
| --- | --- | --- |
| Verified · Lab portal | `verified_on_lab_portal` | `Verified` is true only on this rung |
| Vendor PDF | `vendor_pdf` | not the Verified badge |
| Client PDF | `client_pdf_only` | not the Verified badge |
| Unverified | `unverified` | not the Verified badge |

`vendor_pdf` is first-class. Do not collapse it into `client_pdf_only`.

Tooltip lock for `client_pdf_only`: **Client-supplied PDF only**. Fuller strings live in tooltips. Do not replace the visible Client PDF chip with a longer label.

Match order, first hit wins:

1. lab-portal key → `verified_on_lab_portal`
2. lab PDF → `client_pdf_only`
3. vendor PDF → `vendor_pdf`

No match is `unverified`.

This is not BatchGuild pharmacy-listing "Verified." A pharmacy page that names a peptide is `pharmacy_lists_peptide`. Keep that field off the verified path.

---

## 5. Methods on this report

Show the methods named on this lot's report. HPLC, MS, LC-MS, and the rest are tags from that report, not from the lab's catalog menu.

A method on the catalog is not a method on this lot. Missing method means we do not claim that measurement.

---

## 6. Analytes present

Score only analytes present on that report. `null` is not a pass.

A missing endotoxin line does not mean the lot passed endotoxin. A `null` purity field does not mean 99%. An empty identity tag does not mean the molecule was confirmed.

Show what was tested. Show what was not on the report. Leave the blank a blank.

---

## 7. Who commissioned the test

`commissioning_party` is first-class: `vendor` | `buyer` | `group` | `unknown`.

Who ordered the test matters more than a clean-looking PDF. A vendor-commissioned portal match proves a lab record for that task. It does not prove a buyer retest, and it does not prove every retail vial matches.

Do not silently upgrade a vendor-commissioned row to "independent third-party tested."

---

## 8. Price is a listing fact

Price and $/mg are listing facts. They sit beside the lot. They do not move a verification chip, fill a null analyte, or create a vendor tier.

First ship has no vendor tiers and no vendor-level score.

---

## 9. Limits

Portal match upgrades where the document lives. It does not upgrade assay completeness. A Lab portal row with `purity_pct = null` is correct.

Do not OCR a portal PNG or a PDF image into numbers. If the source has no structured field, the field stays null. No OCR inventing numbers.

Do not invent COA numbers, lot IDs, or analyte results.

Held until the product owner greenlights data ops: product and lot scrapes, and the Sep 2025 50+ compounder letter crawl.

Shortage fields are dated regulatory context. An open window is not "safe to compound."

Informational only.
