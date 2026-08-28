const COLUMNS = ["#", "Vendor", "Tier", "Score", "Lab", "Methods", "Trustpilot", "COA status"];

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

function renderChrome(active) {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) {
    header.innerHTML = `
      <div class="draft-banner">
        <div class="wrap"><strong>Draft face.</strong> Not live until C Wall says ship. Informational. Research use.</div>
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
            <a href="/rankings.html" ${active === "rankings" ? 'aria-current="page"' : ""}>Rankings</a>
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
        Informational only. Research use. We don’t sell peptides. Public copy says batch.
        No dosing. No medical claims. No buy-for-human-use. Not a cart and not a 503/pharmacy scorecard.
      </div>`;
  }
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

function renderRow(row) {
  const loc = row.location ? ` · ${escapeHtml(row.location)}` : "";
  return `<tr data-slug="${escapeHtml(row.slug)}" data-name="${escapeHtml(row.name)}" data-domain="${escapeHtml(row.domain || "")}" tabindex="0">
    <td class="num">${row.rank}</td>
    <td>
      <a class="vendor-name" href="${vendorHref(row.slug)}">${escapeHtml(row.name)}</a>
      <div class="vendor-meta">${escapeHtml(row.domain || "")}${loc}</div>
    </td>
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
  root.innerHTML = `
    <div class="table-scroll">
      <table class="data-table" aria-label="Live original ranked directory">
        <thead>
          <tr>${COLUMNS.map((col) => `<th>${col}</th>`).join("")}</tr>
        </thead>
        <tbody>${rows.map(renderRow).join("")}</tbody>
      </table>
    </div>`;
  bindRowClicks(root.querySelector("tbody"));
}

function renderTeases(root, listings) {
  if (!root || !listings) return;
  const lead = listings.lead_teases || [];
  const locked = listings.locked_10 || [];
  const stacks = listings.stacks_named || [];
  root.innerHTML = `
    <p class="caption">Product strip · teases, not a cart</p>
    <h3>Short list, Glow, NAD, glutathione</h3>
    <div class="chips" aria-label="Lead teases">
      ${lead.map((item) => `<span class="chip lead">${escapeHtml(item)}</span>`).join("")}
    </div>
    <p class="caption" style="margin-top:1rem">Locked 10</p>
    <div class="chips" aria-label="Locked ten">
      ${locked.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}
    </div>
    <p class="caption" style="margin-top:1rem">Stacks, vendor-named only</p>
    <div class="chips" aria-label="Named stacks">
      ${stacks.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}
    </div>
    <p class="footnote">
      Teases only. No ninth price column on the ranked table. A listed size and listed $
      appear under a vendor only when that pair already exists in the pinned seed.
      Missing is not stated. No averages. No invented SKUs. Stack recipes stay on the
      vendor page when that vendor published the names.
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
      const requests = JSON.parse(localStorage.getItem("pqi-report-requests") || "[]");
      requests.push({ email, company, at: new Date().toISOString() });
      localStorage.setItem("pqi-report-requests", JSON.stringify(requests));
      result.innerHTML = `<p>We’ll send the report for <strong>${escapeHtml(company)}</strong>.</p>`;
    });
  };

  const showHit = (matches) => {
    result.hidden = false;
    const first = matches[0];
    result.innerHTML = `<p>If we have them, you get the row. <a class="vendor-name" href="${vendorHref(first.slug)}">${escapeHtml(first.name)}</a></p>`;
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

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

function renderVendor(root, rankings, listings) {
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
  const vendorListings = (listings.rows || []).filter((item) => item.vendor_slug === slug);
  const priced = vendorListings.filter((item) => item.price_stated);
  const listingHtml = vendorListings.length
    ? vendorListings
        .map((item) => {
          const price = item.price_stated ? `<span class="price">${escapeHtml(money(item.listed_price_usd))} · ${escapeHtml(item.size_label)}</span>` : `<span class="not-stated">Price not stated</span>`;
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
    : `<p class="not-stated">Listed size and price not stated in the pinned seed for this vendor.</p>`;

  root.innerHTML = `
    <p class="caption"><a href="/rankings.html">Back to rankings</a> · Rank #${row.rank}</p>
    <h1>${escapeHtml(row.name)}</h1>
    <p>${escapeHtml(row.domain || "")}${row.location ? ` · ${escapeHtml(row.location)}` : ""}</p>
    <div class="vendor-facts">
      <div><dt>Tier</dt><dd><span class="tier-chip" data-tier="${escapeHtml(row.tier)}">${escapeHtml(row.tier)}</span></dd></div>
      <div><dt>Score</dt><dd class="num">${row.score}</dd></div>
      <div><dt>Lab</dt><dd>${row.lab ? escapeHtml(row.lab) : "Not stated"}</dd></div>
      <div><dt>COA status</dt><dd>${row.coa_status ? escapeHtml(row.coa_status) : "Not stated"}</dd></div>
    </div>
    <p><a class="btn" href="${escapeHtml(row.vendor_url)}" rel="noopener noreferrer">Open vendor site</a></p>
    <h2 class="caption" style="margin-top:2rem">Listings from pinned seed</h2>
    <p class="footnote">Price only where a public listed size and listed $ already exist. ${priced.length} priced rows in seed. Missing stays not stated. Informational. Research use. No checkout.</p>
    <div class="listing-grid">${listingHtml}</div>`;
}

async function boot() {
  const page = document.body.dataset.page;
  renderChrome(page === "index" ? "rankings" : page);
  const needsRankings = ["index", "rankings", "vendor"].includes(page);
  if (!needsRankings) return;
  const [rankings, listings] = await Promise.all([
    loadJson("rankings.json"),
    loadJson("listings.json"),
  ]);
  const tableRoot = document.getElementById("ranked-table");
  if (tableRoot) renderTable(tableRoot, rankings.rows);
  const teaseRoot = document.getElementById("tease-strip");
  if (teaseRoot) renderTeases(teaseRoot, listings);
  bindSearch(rankings.rows);
  const vendorRoot = document.getElementById("vendor-root");
  if (vendorRoot) renderVendor(vendorRoot, rankings, listings);
}

boot();
