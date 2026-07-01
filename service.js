/* ============================================================
   Service board — the "View all 7 bays" screen.
   Renders a bay-occupancy overview, a filterable list of work
   orders (tickets link to work-order.html?wo=<id>, all backed by
   real records), a computed stat strip, and upcoming appointments.
   ============================================================ */

/* every id here has a matching record in work-order.js */
const WORK_ORDERS = [
  { id: "88213", bay: 2, unit: "Hendricks Farm #4", model: "John Deere 8R 250", tech: "R. Alvarez", status: "progress", label: "In Progress", promised: "Promised Jul 3", pay: "Customer + Warranty" },
  { id: "88221", bay: 3, unit: "Coteau Dairy #2", model: "New Holland T6.180", tech: "T. Nguyen", status: "progress", label: "In Progress", promised: "Promised Jul 2", pay: "Customer-pay" },
  { id: "88190", bay: 4, unit: "Red River #2", model: "Case IH Magnum 340", tech: "J. Okafor", status: "waiting", label: "Waiting on Parts", promised: "Promised Jul 4", pay: "Customer-pay" },
  { id: "88175", bay: 1, unit: "Meadowlark #7", model: "Toro Groundsmaster 4000-D", tech: "M. Lindqvist", status: "ready", label: "Ready for Pickup", promised: "Completed Jun 30", pay: "Customer-pay" },
  { id: "88205", bay: 5, unit: "Sundquist #6", model: "Bobcat S650", tech: "D. Berg", status: "ready", label: "Ready for Pickup", promised: "Completed Jun 30", pay: "Customer-pay" },
  { id: "88231", bay: null, unit: "Halvorsen #3", model: "John Deere 6M 130", tech: "R. Alvarez", status: "scheduled", label: "Scheduled", promised: "Scheduled Jul 2", pay: "Customer-pay" },
  { id: "88142", bay: null, unit: "Thorson #1", model: "Kubota M7-172", tech: "Unassigned", status: "overdue", label: "Overdue", promised: "Filed 5 days ago", pay: "Warranty" }
];

const BAYS = [1, 2, 3, 4, 5, 6, 7];

const APPOINTMENTS = [
  { when: "Jul 2 · 1:00 PM", title: "John Deere 5075E — 50-hour service", who: "Ostrander Farms" },
  { when: "Jul 3 · 9:00 AM", title: "Vermeer BC1500 chipper — blade service", who: "Prairie Rose Landscaping" }
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "progress", label: "In Progress" },
  { key: "waiting", label: "Waiting on Parts" },
  { key: "ready", label: "Ready" },
  { key: "scheduled", label: "Scheduled" },
  { key: "overdue", label: "Overdue" }
];

let activeFilter = "all";
let searchTerm = "";

/* ---------- render pieces ---------- */
function count(status) { return WORK_ORDERS.filter(w => w.status === status).length; }

function renderStats() {
  const cards = [
    { cls: "amber", label: "Active Work Orders", value: WORK_ORDERS.length, sub: BAYS.filter(b => WORK_ORDERS.some(w => w.bay === b)).length + " of 7 bays occupied" },
    { cls: "amber", label: "In Progress", value: count("progress"), sub: "on the floor now" },
    { cls: "clay", label: "Waiting on Parts", value: count("waiting"), sub: "blocked on backorder" },
    { cls: "clay", label: "Overdue", value: count("overdue"), sub: "needs attention" }
  ];
  document.getElementById("svc-stats").innerHTML = cards.map(c => `
    <div class="stat-card ${c.cls}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-delta">${c.sub}</div>
    </div>`).join("");
}

function renderBays() {
  document.getElementById("svc-bays").innerHTML = BAYS.map(b => {
    const wo = WORK_ORDERS.find(w => w.bay === b);
    if (!wo) {
      return `<div class="bay-card free"><div class="bay-no">Bay ${b}</div><div class="bay-free">Available</div></div>`;
    }
    const st = wo.status === "waiting" ? "st-waiting" : wo.status === "ready" ? "st-ready" : "";
    return `<a class="bay-card occupied ${st}" href="work-order.html?wo=${wo.id}">
      <div class="bay-no">Bay ${b}</div>
      <div class="bay-unit">${wo.model}</div>
      <div class="bay-wo">WO-${wo.id} · ${wo.tech}</div>
    </a>`;
  }).join("");
}

function renderFilters() {
  document.getElementById("svc-filters").innerHTML = FILTERS.map(f => {
    const n = f.key === "all" ? WORK_ORDERS.length : count(f.key);
    return `<button class="chip ${f.key === activeFilter ? "active" : ""}" data-filter="${f.key}">${f.label}<span class="chip-n">${n}</span></button>`;
  }).join("");
  document.querySelectorAll("#svc-filters .chip").forEach(c =>
    c.addEventListener("click", () => { activeFilter = c.dataset.filter; renderFilters(); renderList(); })
  );
}

function renderList() {
  const term = searchTerm.trim().toLowerCase();
  const rows = WORK_ORDERS.filter(w => {
    if (activeFilter !== "all" && w.status !== activeFilter) return false;
    if (!term) return true;
    return [w.id, w.unit, w.model, w.tech].join(" ").toLowerCase().includes(term);
  });
  const el = document.getElementById("svc-list");
  if (!rows.length) {
    el.innerHTML = `<div class="svc-empty">No work orders match this filter.</div>`;
    return;
  }
  el.innerHTML = rows.map(w => `
    <a class="ticket dept-service" href="work-order.html?wo=${w.id}">
      <div class="ticket-main">
        <div class="ticket-id">WO-${w.id}${w.bay ? " · Bay " + w.bay : " · Unassigned"} · ${w.pay}</div>
        <div class="ticket-title">${w.model} — ${w.unit}</div>
        <div class="ticket-meta"><span>Tech: ${w.tech}</span><span>${w.promised}</span></div>
      </div>
      <div class="stamp ${w.status}">${w.label}</div>
    </a>`).join("");
}

function renderAppointments() {
  document.getElementById("svc-appts").innerHTML = APPOINTMENTS.map(a => `
    <div class="appt-row">
      <div class="appt-when">${a.when}</div>
      <div class="appt-main">
        <div class="appt-title">${a.title}</div>
        <div class="appt-meta">${a.who}</div>
      </div>
      <div class="appt-tag">Booked</div>
    </div>`).join("");
}

/* ---------- boot ---------- */
(function () {
  renderStats();
  renderBays();
  renderFilters();
  renderList();
  renderAppointments();
  const search = document.getElementById("svc-search");
  search.addEventListener("input", () => { searchTerm = search.value; renderList(); });
})();
