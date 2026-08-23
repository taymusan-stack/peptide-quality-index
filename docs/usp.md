# PQI USP (v1)

**One line.** PQI shows what was tested, how, and how the match was proven — by entity type. It is not a vendor scoreboard and not a pharmacy-listing badge.

**Who it’s for.** People comparing research-use lots (first), then later 503A / 503B / telehealth as separate directories. Informational only. No dosing. No medical claims. No buy-for-human-use copy.

**The wedge.** Testing transparency:
1. Methods on this report (HPLC, MS, etc.)
2. Analytes present (null ≠ pass)
3. Who commissioned the test
4. How verification was proven (lab portal badge vs vendor PDF vs client PDF vs unverified)
5. Hard walls between RUO / 503A / 503B / telehealth — never one blended rank

**Vs the field (hypothesis).**
- Merit Verified — largest RUO COA catalog + tools; leans vendor/COA-volume ranks. We win on ladder honesty, analyte presence, commissioning_party, entity split.
- PeptideWiki — testing DB + guides/deals. We win on lot-grain scorecard + portal-only Verified badge.
- PeptiDex — literature/compound index. Different job.
- BatchGuild — lab-mirrored COAs + pharmacy directory where Verified often means pharmacy lists a peptide. Our schema rejects that sense of verified.

**First-ship proof.** S-tier RUO lot table → lot detail emphasizing methods, analytes, verification ladder, commissioning_party. Price/$/mg as listing facts only. No vendor tiers. Other types = Coming stubs. Seed pin: v2026-08-22.2 + v2026-08-22.1.

**Not yet.** Breadth vs Merit, vendor scores, 503A/B/telehealth depth.

**Success check.** A reader can answer: what was tested, what wasn’t on the report, how we know the COA matches, and which entity lane they’re in — without us telling them what to buy.

**Visible verification chips (label freeze v0.7).** Verified · Lab portal (badge only) · Vendor PDF · Client PDF · Unverified. Fuller strings live in tooltips only (e.g. Client-supplied PDF only).
