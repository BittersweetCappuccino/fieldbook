/* ============================================================
   Rentals fleet — the "View fleet" screen.
   A filterable list of rental agreements (tickets link to
   rental.html?rn=<id>, all backed by real records) plus a
   computed stat strip and the units available to rent.
   ============================================================ */

/* every id here has a matching record in rental.js */
const AGREEMENTS = [
  { id: "4471", model: "Bobcat T770 CTL", cat: "Compact Track Loader", customer: "Hendricks Family Farms", site: "Hendricks Farm — north quarter", out: "Out Jun 20 · 12 days", due: "Due Jul 2 — tomorrow", status: "on-rent", label: "On Schedule" },
  { id: "4488", model: "John Deere 320G", cat: "Skid Steer", customer: "Sundquist Excavating", site: "Sundquist yard — 40th St", out: "Out Jun 28 · 4 days", due: "Due Jul 12", status: "on-rent", label: "On Rent" },
  { id: "4463", model: "Genie S-45", cat: "Telescopic Boom Lift", customer: "Dakota Steel Erectors", site: "Downtown Fargo jobsite", out: "Out Jun 24 · 8 days", due: "Due Jul 8", status: "on-rent", label: "On Rent" },
  { id: "4490", model: "Kubota KX040", cat: "Compact Excavator", customer: "Prairie Rose Landscaping", site: "Rose yard — staging", out: "Out Jul 1 · today", due: "Due Jul 15", status: "on-rent", label: "On Rent" },
  { id: "4459", model: "Toro Sand Pro 3040", cat: "Bunker Rake", customer: "Meadowlark Golf Club", site: "Meadowlark GC — course", out: "Out Jun 13 · 18 days", due: "Due Jun 29 — 2 days overdue", status: "overdue", label: "Overdue" },
  { id: "4495", model: "Vermeer BC1500", cat: "Brush Chipper", customer: "Prairie Rose Landscaping", site: "Reserved — pickup Jul 5", out: "Reserved", due: "Jul 5 – Jul 12", status: "reserved", label: "Reserved" },
  { id: "4452", model: "Bobcat T64 CTL", cat: "Compact Track Loader", customer: "Coteau Dairy Co-op", site: "Returned to yard", out: "Out Jun 10 · 17 days", due: "Returned Jun 27", status: "returned", label: "Returned" }
];

const AVAILABLE = [
  { model: "Bobcat E35 Mini Excavator", cat: "Compact Excavator", rate: "$1,050/wk" },
  { model: "Toro Dingo TX1000", cat: "Compact Utility Loader", rate: "$890/wk" },
  { model: "JLG 1930ES Scissor Lift", cat: "Scissor Lift", rate: "$620/wk" },
  { model: "Kubota SVL65 CTL", cat: "Compact Track Loader", rate: "$1,400/wk" }
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "on-rent", label: "On Rent" },
  { key: "overdue", label: "Overdue" },
  { key: "reserved", label: "Reserved" },
  { key: "returned", label: "Returned" }
];

/* map rental status -> ticket stamp class */
const STAMP = { "on-rent": "scheduled", "overdue": "overdue", "reserved": "waiting", "returned": "ready" };

let activeFilter = "all";
let searchTerm = "";

function count(status) { return AGREEMENTS.filter(a => a.status === status).length; }

function renderStats() {
  const onRent = AGREEMENTS.filter(a => a.status === "on-rent" || a.status === "overdue").length;
  const cards = [
    { cls: "blue", label: "Units on Rent", value: onRent, sub: "out with customers" },
    { cls: "blue", label: "Due Back — 7 days", value: 2, sub: "RN-4471, RN-4463" },
    { cls: "clay", label: "Overdue", value: count("overdue"), sub: "past due date" },
    { cls: "green", label: "Available to Rent", value: AVAILABLE.length, sub: "ready in yard" }
  ];
  document.getElementById("rn-stats").innerHTML = cards.map(c => `
    <div class="stat-card ${c.cls}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-delta">${c.sub}</div>
    </div>`).join("");
}

function renderFilters() {
  document.getElementById("rn-filters").innerHTML = FILTERS.map(f => {
    const n = f.key === "all" ? AGREEMENTS.length : count(f.key);
    return `<button class="chip ${f.key === activeFilter ? "active" : ""}" data-filter="${f.key}">${f.label}<span class="chip-n">${n}</span></button>`;
  }).join("");
  document.querySelectorAll("#rn-filters .chip").forEach(c =>
    c.addEventListener("click", () => { activeFilter = c.dataset.filter; renderFilters(); renderList(); })
  );
}

function renderList() {
  const term = searchTerm.trim().toLowerCase();
  const rows = AGREEMENTS.filter(a => {
    if (activeFilter !== "all" && a.status !== activeFilter) return false;
    if (!term) return true;
    return [a.id, a.model, a.customer, a.site, a.cat].join(" ").toLowerCase().includes(term);
  });
  const el = document.getElementById("rn-list");
  if (!rows.length) { el.innerHTML = `<div class="svc-empty">No rentals match this filter.</div>`; return; }
  el.innerHTML = rows.map(a => `
    <a class="ticket dept-rentals" href="rental.html?rn=${a.id}">
      <div class="ticket-main">
        <div class="ticket-id">RN-${a.id} · ${a.cat}</div>
        <div class="ticket-title">${a.model} — ${a.customer}</div>
        <div class="ticket-meta"><span>${a.site}</span><span>${a.due}</span></div>
      </div>
      <div class="stamp ${STAMP[a.status]}">${a.label}</div>
    </a>`).join("");
}

function renderAvailable() {
  document.getElementById("rn-avail").innerHTML = AVAILABLE.map(u => `
    <div class="ticket dept-rentals">
      <div class="ticket-main">
        <div class="ticket-id">${u.cat}</div>
        <div class="ticket-title">${u.model}</div>
        <div class="ticket-meta"><span>${u.rate}</span><span>In yard</span></div>
      </div>
      <div class="stamp ready">Available</div>
    </div>`).join("");
}

(function () {
  renderStats();
  renderFilters();
  renderList();
  renderAvailable();
  const search = document.getElementById("rn-search");
  search.addEventListener("input", () => { searchTerm = search.value; renderList(); });
})();
