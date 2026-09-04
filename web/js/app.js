const COLUMNS = ["#", "Vendor", "Tier", "Score", "Lab", "Methods", "Trustpilot", "COA status"];

const DOCTOR_TITLE = "Talk to a doctor.";
const DOCTOR_BODY =
  "This is not advice — you need advice. Talk to a qualified doctor before you decide anything about peptides. We rank whether a shop’s report is checkable. We don’t tell you what to take, or whether to take anything.";
const DOCTOR_QUIET = "Informational only. Research use. We don’t sell peptides.";

const UNLOCK_KEY = "pqi-gate-unlock";
const PHONE_KEY = "pqi-gate-phone";
const REQUESTS_KEY = "pqi-report-requests";
const REVEALED_KEY = "pqi-gate-revealed";

const COA_KIND = {
  "Portal verified": "portal",
  "Lab confirmed": "confirmed",
  Partial: "partial",
  "Failed verification": "fail",
};

const STATUS_LABEL = {
  verified_on_lab_portal: "Matched on lab portal",
  vendor_pdf: "Vendor-published COA",
  client_pdf_only: "Lab PDF opened",
  unverified: "Unverified",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function dataPrefix() {
  return "/data/";
}

function vendorHref(slug) {
  return `/vendor/${encodeURIComponent(slug)}`;
}

async function loadJson(name) {
  const response = await fetch(`${dataPrefix()}${name}`);
  if (!response.ok) throw new Error(`Missing ${name}`);
  return response.json();
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function isUnlocked() {
  const record = readJson(UNLOCK_KEY, null);
  return Boolean(record && record.email);
}

function unlock(record) {
  writeJson(UNLOCK_KEY, { ...record, at: new Date().toISOString() });
}

function revealedSlugs() {
  return new Set(readJson(REVEALED_KEY, []));
}

function revealSlug(slug) {
  const next = revealedSlugs();
  next.add(slug);
  writeJson(REVEALED_KEY, [...next]);
}

function nameIsOpen(row) {
  return isUnlocked() || row.rank <= 10 || revealedSlugs().has(row.slug);
}

function renderChrome(active) {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) {
    header.innerHTML = `
      <div class="draft-banner">
        <div class="wrap"><strong>Draft gate.</strong> Not live until C Wall says ship. Informational. Research use.</div>
      </div>
      <div class="site-header">
        <div class="wrap header-row">
          <a class="brand" href="/">
            <svg class="brand-mark" width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="1" y="1" width="30" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"></rect>
              <path d="M8 22 L8 10 L14 10 C17 10 18 12 18 14 C18 16 17 18 14 18 L8 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"></path>
              <circle cx="23" cy="10" r="1.5" fill="var(--gold)"></circle>
            </svg>
            <span>
              <span class="wordmark">Peptide Quality Index</span>
              <span class="wordmark-sub">Informational directory</span>
            </span>
          </a>
          <nav class="nav" aria-label="Primary">
            <a href="/rankings.html" ${active === "rankings" || active === "index" ? 'aria-current="page"' : ""}>Rankings</a>
            <a href="/industry.html" ${active === "industry" ? 'aria-current="page"' : ""}>Industry</a>
            <a href="/compare.html" ${active === "compare" ? 'aria-current="page"' : ""}>Compare</a>
            <a href="/methodology.html" ${active === "methodology" ? 'aria-current="page"' : ""}>Methodology</a>
          </nav>
        </div>
      </div>`;
  }
  if (footer) {
    footer.innerHTML = `
      <div class="wrap">
        ${escapeHtml(DOCTOR_QUIET)} Public copy says batch.
        No dosing. No medical claims. No buy-for-human-use. Not a cart and not a 503/pharmacy scorecard.
      </div>`;
  }
}

function renderDoctorCta() {
  const root = document.getElementById("doctor-cta");
  if (!root) return;
  root.className = "doctor-cta";
  root.innerHTML = `
    <h2>${escapeHtml(DOCTOR_TITLE)}</h2>
    <p>${escapeHtml(DOCTOR_BODY)}</p>
    <p class="doctor-quiet">${escapeHtml(DOCTOR_QUIET)}</p>`;
}

function renderUnlockCard() {
  const root = document.getElementById("unlock-card");
  if (!root) return;
  root.className = "unlock-card";
  if (isUnlocked()) {
    const record = readJson(UNLOCK_KEY, {});
    root.innerHTML = `
      <h2>Names unlocked</h2>
      <p>The rest of the vendor names and sites are open on this browser. Come back and they stay open.</p>
      <p class="footnote">Saved as ${escapeHtml(record.email || "your email")}. This list is not live until C Wall says ship.</p>`;
    return;
  }
  root.innerHTML = `
    <h2>Get the names</h2>
    <p>Named Top 10 is free. Unlock the rest of the names, sites, and full vendor pages.</p>
    <form id="unlock-form">
      <label for="unlock-name">Name</label>
      <input id="unlock-name" name="name" autocomplete="name" required>
      <label for="unlock-email">Email</label>
      <input id="unlock-email" name="email" type="email" autocomplete="email" required>
      <button class="btn" type="submit">Unlock the names</button>
    </form>`;
  document.getElementById("unlock-form").addEventListener("submit", (event) => {
    event.preventDefault();
    unlock({
      name: document.getElementById("unlock-name").value.trim(),
      email: document.getElementById("unlock-email").value.trim(),
      source: "unlock-names",
    });
    refreshGate();
  });
}

function renderPhoneCard() {
  const root = document.getElementById("phone-card");
  if (!root) return;
  if (!isUnlocked()) {
    root.innerHTML = "";
    return;
  }
  root.className = "phone-card";
  const saved = readJson(PHONE_KEY, null);
  if (saved && saved.phone) {
    root.innerHTML = `<h2>Phone saved</h2><p class="footnote">Optional. Not a wall in front of the table.</p>`;
    return;
  }
  root.innerHTML = `
    <h2>Phone after unlock</h2>
    <p>Optional. The table is already open. Leave a number if you want the report that way.</p>
    <form id="phone-form">
      <label for="phone-input">Phone</label>
      <input id="phone-input" name="phone" type="tel" autocomplete="tel">
      <button class="btn" type="submit">Save phone</button>
    </form>`;
  document.getElementById("phone-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const phone = document.getElementById("phone-input").value.trim();
    if (!phone) return;
    writeJson(PHONE_KEY, { phone, at: new Date().toISOString() });
    renderPhoneCard();
  });
}

function trustpilotCell(tp) {
  if (!tp || !tp.rating) return "—";
  if (tp.reviews) return `${escapeHtml(tp.rating)} / ${escapeHtml(tp.reviews)}`;
  return `${escapeHtml(tp.rating)} / —`;
}

function methodsCell(methods) {
  return `<div class="methods">${(methods || [])
    .map(
      (method) =>
        `<span class="method${method.stated ? " is-stated" : ""}">${escapeHtml(method.code)}</span>`
    )
    .join("")}</div>`;
}

function coaKind(status) {
  if (!status) return "";
  if (COA_KIND[status]) return COA_KIND[status];
  if (/portal/i.test(status)) return "portal";
  if (/confirmed/i.test(status)) return "confirmed";
  if (/partial/i.test(status)) return "partial";
  if (/fail/i.test(status)) return "fail";
  return "";
}

function renderRow(row, open) {
  const loc = open && row.location ? ` · ${escapeHtml(row.location)}` : "";
  const name = open
    ? `<a class="vendor-name" href="${vendorHref(row.slug)}">${escapeHtml(row.name)}</a>
       <div class="vendor-meta">${escapeHtml(row.domain || "")}${loc}</div>`
    : `<span class="grey-name">Name locked</span>
       <div class="vendor-meta">Unlock the names</div>`;
  const cls = open ? "is-open" : "is-gated";
  return `<tr class="${cls}" data-slug="${escapeHtml(row.slug)}" data-name="${escapeHtml(row.name)}" data-domain="${escapeHtml(row.domain || "")}" data-open="${open ? "1" : "0"}" ${open ? 'tabindex="0"' : ""}>
    <td class="num">${row.rank}</td>
    <td>${name}</td>
    <td><span class="tier-chip" data-tier="${escapeHtml(row.tier)}" aria-label="Tier ${escapeHtml(row.tier)}">${escapeHtml(row.tier)}</span></td>
    <td class="num">${row.score}</td>
    <td>${row.lab ? escapeHtml(row.lab) : "—"}</td>
    <td>${methodsCell(row.methods)}</td>
    <td>${trustpilotCell(row.trustpilot)}</td>
    <td><span class="coa" data-kind="${coaKind(row.coa_status)}"><i></i>${row.coa_status ? escapeHtml(row.coa_status) : "—"}</span></td>
  </tr>`;
}

function bindRowClicks(tbody) {
  tbody.querySelectorAll("tr[data-slug]").forEach((tr) => {
    if (tr.dataset.open !== "1") {
      tr.addEventListener("click", () => {
        document.getElementById("unlock-card")?.scrollIntoView({ block: "nearest" });
      });
      return;
    }
    const go = () => {
      window.location.href = vendorHref(tr.dataset.slug);
    };
    tr.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      go();
    });
    tr.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        go();
      }
    });
  });
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function findVendorMatches(rows, query) {
  const q = normalize(query);
  if (!q) return [];
  return rows.filter((row) => {
    const hay = [row.name, row.domain, row.slug].map(normalize).join(" ");
    return hay.includes(q);
  });
}

function renderTable(root, rows) {
  if (!root) return;
  root.innerHTML = `
    <div class="table-scroll">
      <table class="data-table" aria-label="Live original ranked directory">
        <thead>
          <tr>${COLUMNS.map((col) => `<th>${col}</th>`).join("")}</tr>
        </thead>
        <tbody>${rows.map((row) => renderRow(row, nameIsOpen(row))).join("")}</tbody>
      </table>
    </div>`;
  bindRowClicks(root.querySelector("tbody"));
}

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

function perMg(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const text = n.toFixed(4).replace(/\.?0+$/, "");
  return `$${text}/mg`;
}

function pricedRows(listings) {
  return (listings.rows || []).filter(
    (row) => row.price_stated && row.size_label && row.listed_price_usd != null
  );
}

function matchesLocked(row, names) {
  const tags = row.tease_tags || [];
  const ident = row.peptide_identity || "";
  const product = row.product_name || "";
  return names.some((name) => tags.includes(name) || ident === name || product.includes(name));
}

function pickSpecimens(listings, rankings) {
  const priced = pricedRows(listings);
  const locked = listings.locked_10 || [];
  const stacks = listings.stacks_named || [];
  if (isUnlocked()) {
    return priced.filter(
      (row) => matchesLocked(row, locked) || (row.vendor_named_stacks || []).some((name) => stacks.includes(name))
    );
  }
  const chosen = new Map();
  for (const row of priced) {
    const score = (row.price_per_mg_usd != null ? 2 : 0) + (matchesLocked(row, locked) ? 1 : 0);
    const prev = chosen.get(row.vendor_slug);
    if (!prev || score > prev.score) chosen.set(row.vendor_slug, { row, score });
  }
  return [...chosen.values()].map((item) => item.row);
}

function renderSpecimens(root, listings, rankings) {
  if (!root || !listings || !rankings) return;
  const rankBySlug = Object.fromEntries(rankings.rows.map((row) => [row.slug, row]));
  const rows = pickSpecimens(listings, rankings);
  if (!rows.length) {
    root.innerHTML = `<p class="caption">Product strip</p><p class="not-stated">Listed size and $ not stated in the pinned seed for a specimen.</p>`;
    return;
  }
  const cards = rows
    .map((item) => {
      const vendor = rankBySlug[item.vendor_slug];
      const rank = vendor ? `#${vendor.rank}` : "Rank not on table";
      const listed = money(item.listed_price_usd);
      const mg = item.price_per_mg_usd != null ? perMg(item.price_per_mg_usd) : "$/mg not stated";
      const letter = (item.vendor_name || "?").trim().charAt(0);
      const nameClass = isUnlocked() ? "vendor-name" : "grey-name";
      const name = isUnlocked() ? item.vendor_name : item.vendor_name;
      return `<article class="specimen-card">
        <div class="mark" aria-hidden="true">${escapeHtml(letter)}</div>
        <div>
          <div class="rank">${escapeHtml(rank)}</div>
          <div class="price">${escapeHtml(listed)} · ${escapeHtml(item.size_label)} · ${escapeHtml(mg)}</div>
          <div class="${nameClass}">${escapeHtml(name)}</div>
          <div class="vendor-meta">${escapeHtml(item.product_name)}</div>
        </div>
      </article>`;
    })
    .join("");
  root.innerHTML = `
    <p class="caption">Product strip · listing facts, not a ninth column</p>
    <h3>${isUnlocked() ? "Locked 10 and named stacks with a public listed $" : "Specimen · listed $ and $/mg where they already exist"}</h3>
    <div class="specimen-grid">${cards}</div>
    <p class="footnote">
      Logo mark, rank, listed $, and $/mg only when that pair already exists in the pinned seed.
      Grey name until unlock. Missing stays not stated. No averages. No invented SKUs.
    </p>`;
}

function bindSearch(rows) {
  const form = document.getElementById("company-search");
  const input = document.getElementById("company-query");
  const result = document.getElementById("search-result");
  if (!form || !input || !result) return;

  const showMiss = (name) => {
    result.hidden = false;
    result.innerHTML = `
      <p>No row for <strong>${escapeHtml(name || "that name")}</strong>. If we don’t have them, we’ll send the report.</p>
      <form class="email-capture" id="report-request">
        <label for="report-email">Email</label>
        <input id="report-email" name="email" type="email" required autocomplete="email">
        <label for="report-company">Company name</label>
        <input id="report-company" name="company" value="${escapeHtml(name)}" required>
        <button class="btn" type="submit">Send the report</button>
      </form>
      <p class="footnote">Same name you typed. No invented search hit.</p>`;
    document.getElementById("report-request").addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("report-email").value.trim();
      const company = document.getElementById("report-company").value.trim();
      const requests = readJson(REQUESTS_KEY, []);
      requests.push({ email, company, at: new Date().toISOString() });
      writeJson(REQUESTS_KEY, requests);
      unlock({ name: company, email, source: "search-miss" });
      result.innerHTML = `<p>We’ll send the report for <strong>${escapeHtml(company)}</strong>.</p>`;
      refreshGate();
    });
  };

  const showHit = (matches) => {
    result.hidden = false;
    const first = matches[0];
    revealSlug(first.slug);
    refreshGate();
    const open = nameIsOpen(first);
    result.innerHTML = open
      ? `<p>If we have them, you get the row. <a class="vendor-name" href="${vendorHref(first.slug)}">${escapeHtml(first.name)}</a> · #${first.rank} · Tier ${escapeHtml(first.tier)} · Score ${first.score}</p>`
      : `<p>If we have them, you get the row. Rank #${first.rank} · Tier ${escapeHtml(first.tier)} · Score ${first.score}. Unlock the names for the rest.</p>`;
    document.querySelectorAll("tr[data-slug]").forEach((tr) => {
      tr.classList.toggle("is-hit", matches.some((row) => row.slug === tr.dataset.slug));
    });
    const rowEl = document.querySelector(`tr[data-slug="${first.slug}"]`);
    if (rowEl) rowEl.scrollIntoView({ block: "center" });
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    document.querySelectorAll("tr.is-hit").forEach((tr) => tr.classList.remove("is-hit"));
    if (!query) {
      result.hidden = false;
      result.innerHTML = "<p>Type a company name. Empty search is not a hit.</p>";
      return;
    }
    const matches = findVendorMatches(rows, query);
    if (matches.length) showHit(matches);
    else showMiss(query);
  });
}

function vendorSlugFromLocation() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("slug")) return params.get("slug");
  const parts = window.location.pathname.split("/").filter(Boolean);
  const vendorAt = parts.lastIndexOf("vendor");
  if (vendorAt >= 0 && parts[vendorAt + 1] && parts[vendorAt + 1] !== "vendor.html") {
    return decodeURIComponent(parts[vendorAt + 1].replace(/\.html$/, ""));
  }
  const file = parts.at(-1) || "";
  if (file && file !== "vendor.html" && file !== "vendor") return decodeURIComponent(file.replace(/\.html$/, ""));
  return "";
}

function renderVendor(root, rankings, listings) {
  if (!root) return;
  const slug = vendorSlugFromLocation();
  const row = rankings.rows.find((item) => item.slug === slug);
  if (!row) {
    root.innerHTML = `
      <p class="caption">Vendor</p>
      <h1>Not in the live original table</h1>
      <p>No invented search hit. If we don’t have them, we’ll send the report from the rankings search.</p>
      <p><a class="vendor-name" href="/rankings.html">Back to rankings</a></p>`;
    return;
  }
  const open = nameIsOpen(row);
  const vendorListings = (listings.rows || []).filter((item) => item.vendor_slug === slug);
  const priced = vendorListings.filter((item) => item.price_stated);
  const showFull = isUnlocked();
  const listingHtml = showFull
    ? vendorListings.length
      ? vendorListings
          .map((item) => {
            const price = item.price_stated
              ? `<span class="price">${escapeHtml(money(item.listed_price_usd))} · ${escapeHtml(item.size_label)}${
                  item.price_per_mg_usd != null ? ` · ${escapeHtml(perMg(item.price_per_mg_usd))}` : " · $/mg not stated"
                }</span>`
              : `<span class="not-stated">Price not stated</span>`;
            const batch = item.batch ? `Batch ${escapeHtml(item.batch)}` : "Batch not stated";
            const recipe = item.vendor_published_constituents
              ? `<div class="vendor-meta">${escapeHtml(item.vendor_published_constituents)}</div>`
              : "";
            return `<article class="listing-card">
              <strong>${escapeHtml(item.product_name)}</strong>
              ${recipe}
              <div>${price}</div>
              <div class="vendor-meta">${batch} · ${escapeHtml(STATUS_LABEL[item.verification_status] || item.verification_status)}</div>
            </article>`;
          })
          .join("")
      : `<p class="not-stated">Listed size and price not stated in the pinned seed for this vendor.</p>`
    : `<p class="not-stated">Full listings and the vendor site unlock after email. Specimen below only when a listed size and $ already exist.</p>`;

  const site = showFull
    ? `<p><a class="btn" href="${escapeHtml(row.vendor_url)}" rel="noopener noreferrer">Open vendor site</a></p>`
    : "";

  root.innerHTML = `
    <p class="caption"><a href="/rankings.html">Back to rankings</a> · Rank #${row.rank}</p>
    <h1>${open ? escapeHtml(row.name) : "Name locked"}</h1>
    <p>${open ? `${escapeHtml(row.domain || "")}${row.location ? ` · ${escapeHtml(row.location)}` : ""}` : "Unlock the names for the rest of this row."}</p>
    <div class="vendor-facts">
      <div><dt>Tier</dt><dd><span class="tier-chip" data-tier="${escapeHtml(row.tier)}">${escapeHtml(row.tier)}</span></dd></div>
      <div><dt>Score</dt><dd class="num">${row.score}</dd></div>
      <div><dt>Lab</dt><dd>${row.lab ? escapeHtml(row.lab) : "Not stated"}</dd></div>
      <div><dt>COA status</dt><dd>${row.coa_status ? escapeHtml(row.coa_status) : "Not stated"}</dd></div>
    </div>
    ${site}
    <h2 class="caption" style="margin-top:2rem">${showFull ? "Listings from pinned seed" : "Specimen from pinned seed"}</h2>
    <p class="footnote">Price and $/mg only where those fields already exist. ${
      showFull ? `${priced.length} priced rows in seed.` : "Full catalog after unlock."
    } Missing stays not stated. Informational. Research use. No checkout.</p>
    <div class="listing-grid">${listingHtml}</div>
    <div id="vendor-specimen" class="specimen-strip"></div>`;
  if (!showFull) {
    const strip = document.getElementById("vendor-specimen");
    const oneVendor = {
      ...listings,
      rows: pricedRows(listings).filter((item) => item.vendor_slug === slug),
    };
    renderSpecimens(strip, oneVendor, rankings);
  }
}

let bootState = null;

function refreshGate() {
  if (!bootState) return;
  const { rankings, listings } = bootState;
  renderTable(document.getElementById("ranked-table"), rankings.rows);
  renderSpecimens(document.getElementById("specimen-strip"), listings, rankings);
  renderUnlockCard();
  renderPhoneCard();
  renderDoctorCta();
  const vendorRoot = document.getElementById("vendor-root");
  if (vendorRoot) renderVendor(vendorRoot, rankings, listings);
}

async function boot() {
  const page = document.body.dataset.page;
  renderChrome(page === "index" ? "rankings" : page);
  renderDoctorCta();
  const needsRankings = ["index", "rankings", "vendor"].includes(page);
  if (!needsRankings) return;
  const [rankings, listings] = await Promise.all([loadJson("rankings.json"), loadJson("listings.json")]);
  bootState = { rankings, listings };
  renderTable(document.getElementById("ranked-table"), rankings.rows);
  renderSpecimens(document.getElementById("specimen-strip"), listings, rankings);
  bindSearch(rankings.rows);
  renderUnlockCard();
  renderPhoneCard();
  const vendorRoot = document.getElementById("vendor-root");
  if (vendorRoot) renderVendor(vendorRoot, rankings, listings);
}

boot();
