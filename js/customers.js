/* ============================================================
   Customers directory. A searchable list of customers with their
   activity across departments; name links to customer.html?c=<id>.
   ============================================================ */
const CUSTOMERS = [
  { id: "hendricks", name: "Hendricks Family Farms", segment: "Ag", contact: "Marcus Hendricks", wos: 1, rentals: 1, deals: 1, account: "good" },
  { id: "redriver", name: "Red River Grain Co.", segment: "Ag", contact: "Roland Voss", wos: 1, rentals: 0, deals: 1, account: "good" },
  { id: "meadowlark", name: "Meadowlark Golf Club", segment: "Turf", contact: "Petra Nowak", wos: 1, rentals: 1, deals: 1, account: "good" },
  { id: "thorson", name: "Thorson Dairy LLC", segment: "Ag", contact: "Erik Thorson", wos: 1, rentals: 0, deals: 1, account: "watch" },
  { id: "coteau", name: "Coteau Dairy Co-op", segment: "Ag", contact: "Lucille Coteau", wos: 1, rentals: 0, deals: 1, account: "good" },
  { id: "sundquist", name: "Sundquist Excavating", segment: "Construction", contact: "Karl Sundquist", wos: 1, rentals: 1, deals: 1, account: "good" },
  { id: "halvorsen", name: "Halvorsen Farms", segment: "Ag", contact: "Pers Halvorsen", wos: 1, rentals: 0, deals: 1, account: "good" },
  { id: "ostrander", name: "Ostrander Farms", segment: "Ag", contact: "Greta Ostrander", wos: 0, rentals: 0, deals: 1, account: "good" },
  { id: "dakotasteel", name: "Dakota Steel Erectors", segment: "Construction", contact: "Ivan Dahl", wos: 0, rentals: 1, deals: 1, account: "good" },
  { id: "prairierose", name: "Prairie Rose Landscaping", segment: "Construction", contact: "Nina Roswell", wos: 0, rentals: 2, deals: 1, account: "good" }
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "Ag", label: "Ag" },
  { key: "Turf", label: "Turf" },
  { key: "Construction", label: "Construction" }
];
const ACCT = { good: { tag: "done", label: "Good" }, watch: { tag: "hold", label: "Watch" } };

let activeFilter = "all";
let searchTerm = "";

function renderStats() {
  const sum = k => CUSTOMERS.reduce((s, c) => s + c[k], 0);
  const cards = [
    { cls: "amber", label: "Customers", value: CUSTOMERS.length, sub: "active accounts" },
    { cls: "amber", label: "Open Work Orders", value: sum("wos"), sub: "in service" },
    { cls: "blue", label: "Active Rentals", value: sum("rentals"), sub: "units out" },
    { cls: "green", label: "Open Deals", value: sum("deals"), sub: "in the pipeline" }
  ];
  document.getElementById("cu-stats").innerHTML = cards.map(c => `
    <div class="stat-card ${c.cls}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-delta">${c.sub}</div>
    </div>`).join("");
}

function renderFilters() {
  document.getElementById("cu-filters").innerHTML = FILTERS.map(f => {
    const n = f.key === "all" ? CUSTOMERS.length : CUSTOMERS.filter(c => c.segment === f.key).length;
    return `<button class="chip ${f.key === activeFilter ? "active" : ""}" data-filter="${f.key}">${f.label}<span class="chip-n">${n}</span></button>`;
  }).join("");
  document.querySelectorAll("#cu-filters .chip").forEach(c =>
    c.addEventListener("click", () => { activeFilter = c.dataset.filter; renderFilters(); renderList(); })
  );
}

function num(n) { return n ? n : `<span style="color:var(--slate-light)">—</span>`; }

function renderList() {
  const term = searchTerm.trim().toLowerCase();
  const rows = CUSTOMERS.filter(c => {
    if (activeFilter !== "all" && c.segment !== activeFilter) return false;
    if (!term) return true;
    return [c.name, c.contact, c.segment].join(" ").toLowerCase().includes(term);
  });
  const el = document.getElementById("cu-list");
  if (!rows.length) { el.innerHTML = `<div class="svc-empty">No customers match.</div>`; return; }
  el.innerHTML = `<div class="card"><table class="ltable">
    <thead><tr><th>Customer</th><th>Segment</th><th class="num">Open WOs</th><th class="num">Rentals</th><th class="num">Deals</th><th>Account</th></tr></thead>
    <tbody>${rows.map(c => {
    const a = ACCT[c.account];
    return `<tr>
      <td><a class="code" href="customer.html?c=${c.id}" style="font-family:inherit;font-size:13px;font-weight:600">${c.name}</a><div class="sub">${c.contact}</div></td>
      <td>${c.segment}</td>
      <td class="num">${num(c.wos)}</td>
      <td class="num">${num(c.rentals)}</td>
      <td class="num">${num(c.deals)}</td>
      <td><span class="tag ${a.tag}">${a.label}</span></td></tr>`;
  }).join("")}</tbody></table></div>`;
}

(function () {
  renderStats();
  renderFilters();
  renderList();
  const search = document.getElementById("cu-search");
  search.addEventListener("input", () => { searchTerm = search.value; renderList(); });
})();
