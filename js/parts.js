/* ============================================================
   Parts & inventory — the "Reorder queue" screen.
   A filterable parts table (part # links to part.html?p=<num>),
   a computed stat strip, and the open purchase orders (link to
   po.html?po=<id>). Backordered / on-order rows link to their PO.
   ============================================================ */

/* every part links to part.html; every poId links to po.html */
const PARTS = [
  { num: "RE-52341", desc: "Hydraulic filter kit", oem: "John Deere", cat: "Filters", onHand: 2, rp: 4, status: "low" },
  { num: "CI-11029", desc: "PTO shaft coupler", oem: "Case IH", cat: "Driveline", onHand: 1, rp: 3, status: "low" },
  { num: "KB-30871", desc: "Fuel injector, diesel", oem: "Kubota", cat: "Fuel", onHand: 3, rp: 6, status: "low" },
  { num: "JD-77410", desc: "PTO shield assembly", oem: "John Deere", cat: "Driveline", onHand: 0, rp: 1, status: "backorder", po: "7729" },
  { num: "TY-90882", desc: 'Deck belt, 60"', oem: "Toro", cat: "Belts", onHand: 0, rp: 2, status: "backorder", po: "7731" },
  { num: "CI-88231", desc: "Hydraulic pump drive coupler", oem: "Case IH", cat: "Hydraulics", onHand: 0, rp: 1, status: "onorder", po: "7723" },
  { num: "NH-44120", desc: "Starter relay", oem: "New Holland", cat: "Electrical", onHand: 5, rp: 3, status: "instock" }
];

const POS = [
  { id: "7723", oem: "Case IH", status: "shipped", label: "Shipped", eta: "ETA Thu Jul 3", lines: 1 },
  { id: "7729", oem: "John Deere", status: "backorder", label: "Backorder", eta: "ETA Thu Jul 3", lines: 1 },
  { id: "7731", oem: "Toro", status: "submitted", label: "Submitted", eta: "ETA ~Jul 9", lines: 1 },
  { id: "7710", oem: "John Deere", status: "received", label: "Received", eta: "Received Jun 27", lines: 1 }
];

const STATUS = {
  instock: { tag: "instock", label: "In Stock" },
  low: { tag: "low", label: "Low Stock" },
  backorder: { tag: "hold", label: "Backordered" },
  onorder: { tag: "onorder", label: "On Order" }
};
const PO_TAG = { submitted: "low", backorder: "hold", shipped: "onorder", received: "instock" };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "instock", label: "In Stock" },
  { key: "low", label: "Low" },
  { key: "backorder", label: "Backordered" },
  { key: "onorder", label: "On Order" }
];

let activeFilter = "all";
let searchTerm = "";

function count(status) { return PARTS.filter(p => p.status === status).length; }

function renderStats() {
  const cards = [
    { cls: "clay", label: "Below Reorder Point", value: PARTS.filter(p => p.onHand < p.rp).length, sub: "need action" },
    { cls: "clay", label: "Backordered", value: count("backorder"), sub: "blocking jobs" },
    { cls: "blue", label: "On Order", value: count("onorder"), sub: "inbound" },
    { cls: "amber", label: "Open Purchase Orders", value: POS.filter(p => p.status !== "received").length, sub: POS.length + " total this week" }
  ];
  document.getElementById("pt-stats").innerHTML = cards.map(c => `
    <div class="stat-card ${c.cls}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-delta">${c.sub}</div>
    </div>`).join("");
}

function renderFilters() {
  document.getElementById("pt-filters").innerHTML = FILTERS.map(f => {
    const n = f.key === "all" ? PARTS.length : count(f.key);
    return `<button class="chip ${f.key === activeFilter ? "active" : ""}" data-filter="${f.key}">${f.label}<span class="chip-n">${n}</span></button>`;
  }).join("");
  document.querySelectorAll("#pt-filters .chip").forEach(c =>
    c.addEventListener("click", () => { activeFilter = c.dataset.filter; renderFilters(); renderList(); })
  );
}

function actionCell(p) {
  if (p.status === "backorder" || p.status === "onorder") {
    return `<a class="po-link" href="po.html?po=${p.po}">Track PO-${p.po} →</a>`;
  }
  if (p.status === "low") return `<a class="reorder-btn" href="part.html?p=${p.num}">Reorder</a>`;
  return `<span style="color:var(--slate-light)">—</span>`;
}

function renderList() {
  const term = searchTerm.trim().toLowerCase();
  const rows = PARTS.filter(p => {
    if (activeFilter !== "all" && p.status !== activeFilter) return false;
    if (!term) return true;
    return [p.num, p.desc, p.oem, p.cat].join(" ").toLowerCase().includes(term);
  });
  const el = document.getElementById("pt-list");
  if (!rows.length) { el.innerHTML = `<div class="svc-empty">No parts match this filter.</div>`; return; }
  el.innerHTML = `<div class="card"><table class="ltable">
    <thead><tr><th>Part #</th><th>Description</th><th>OEM</th><th class="num">On hand</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>${rows.map(p => {
    const s = STATUS[p.status];
    return `<tr>
      <td><a class="code" href="part.html?p=${p.num}">${p.num}</a></td>
      <td>${p.desc}<div class="sub">${p.cat}</div></td>
      <td>${p.oem}</td>
      <td class="num">${p.onHand} / ${p.rp}</td>
      <td><span class="tag ${s.tag}">${s.label}</span></td>
      <td>${actionCell(p)}</td></tr>`;
  }).join("")}</tbody></table></div>`;
}

function renderPOs() {
  document.getElementById("pt-pos").innerHTML = `<div class="card"><table class="ltable">
    <thead><tr><th>PO #</th><th>Supplier</th><th>Status</th><th>ETA</th><th class="num">Lines</th></tr></thead>
    <tbody>${POS.map(po => `<tr>
      <td><a class="code" href="po.html?po=${po.id}">PO-${po.id}</a></td>
      <td>${po.oem}</td>
      <td><span class="tag ${PO_TAG[po.status]}">${po.label}</span></td>
      <td>${po.eta}</td>
      <td class="num">${po.lines}</td></tr>`).join("")}</tbody></table></div>`;
}

(function () {
  renderStats();
  renderFilters();
  renderList();
  renderPOs();
  const search = document.getElementById("pt-search");
  search.addEventListener("input", () => { searchTerm = search.value; renderList(); });
})();
