/* ============================================================
   Reporting — dealership analytics. Hand-built CSS charts and
   linked tables; numbers reconcile with the department screens
   (pipeline $1.4M, rental fleet, top-customer lifetime values).

   The period picker (top-right pill) re-renders the KPIs, revenue-
   by-department bars and the snapshot table for the chosen window.
   The trailing-6-month trend, pipeline conversion, current fleet
   utilization and lifetime top customers are window-independent, so
   they stay put. Selection persists in localStorage. The pill uses its
   own .period-picker class (not .site-switcher) so it can never collide
   with the topbar location switcher's click handling.
   ============================================================ */
const KPI_CLS = ["green", "amber", "blue", "clay"];
const REV_COLOR = { Sales: "var(--clay)", Service: "var(--amber)", Rentals: "var(--steel-blue)", Parts: "var(--field-green)" };

const PERIOD_ORDER = ["mtd", "last", "qtd", "ytd"];
const PERIODS = {
  mtd: {
    label: "This Month", tag: "MTD",
    kpis: [
      { label: "Revenue (MTD)", value: "$842K", sub: "▲ 3% vs. June" },
      { label: "Gross Margin", value: "22.4%", sub: "▲ 0.6 pts" },
      { label: "Service Hours Billed", value: "412 h", sub: "78% of capacity" },
      { label: "Units Sold (MTD)", value: "6", sub: "$0.9M in equipment" }
    ],
    revenue: [["Sales", 520], ["Service", 118], ["Rentals", 108], ["Parts", 96]],
    snapshot: [
      { dept: "Sales", rev: "$520K", margin: "12%", chg: "+4%" },
      { dept: "Service", rev: "$118K", margin: "58%", chg: "+2%" },
      { dept: "Parts", rev: "$96K", margin: "31%", chg: "−1%" },
      { dept: "Rentals", rev: "$108K", margin: "44%", chg: "+7%" }
    ]
  },
  last: {
    label: "Last Month", tag: "June",
    kpis: [
      { label: "Revenue (June)", value: "$818K", sub: "▲ 2% vs. May" },
      { label: "Gross Margin", value: "21.8%", sub: "▲ 0.3 pts" },
      { label: "Service Hours Billed", value: "398 h", sub: "74% of capacity" },
      { label: "Units Sold (June)", value: "5", sub: "$0.8M in equipment" }
    ],
    revenue: [["Sales", 498], ["Service", 122], ["Rentals", 101], ["Parts", 97]],
    snapshot: [
      { dept: "Sales", rev: "$498K", margin: "11%", chg: "+1%" },
      { dept: "Service", rev: "$122K", margin: "57%", chg: "+3%" },
      { dept: "Parts", rev: "$97K", margin: "30%", chg: "+0%" },
      { dept: "Rentals", rev: "$101K", margin: "43%", chg: "+5%" }
    ]
  },
  qtd: {
    label: "This Quarter", tag: "QTD",
    kpis: [
      { label: "Revenue (QTD)", value: "$2.48M", sub: "▲ 5% vs. Q1" },
      { label: "Gross Margin", value: "22.1%", sub: "▲ 0.4 pts" },
      { label: "Service Hours Billed", value: "1,240 h", sub: "76% of capacity" },
      { label: "Units Sold (QTD)", value: "17", sub: "$2.6M in equipment" }
    ],
    revenue: [["Sales", 1520], ["Service", 356], ["Rentals", 322], ["Parts", 284]],
    snapshot: [
      { dept: "Sales", rev: "$1.52M", margin: "12%", chg: "+6%" },
      { dept: "Service", rev: "$356K", margin: "57%", chg: "+3%" },
      { dept: "Parts", rev: "$284K", margin: "31%", chg: "+1%" },
      { dept: "Rentals", rev: "$322K", margin: "45%", chg: "+9%" }
    ]
  },
  ytd: {
    label: "Year to Date", tag: "YTD",
    kpis: [
      { label: "Revenue (YTD)", value: "$5.9M", sub: "▲ 8% vs. 2025" },
      { label: "Gross Margin", value: "21.6%", sub: "▲ 0.9 pts" },
      { label: "Service Hours Billed", value: "2,980 h", sub: "75% of capacity" },
      { label: "Units Sold (YTD)", value: "41", sub: "$6.2M in equipment" }
    ],
    revenue: [["Sales", 3620], ["Service", 842], ["Rentals", 760], ["Parts", 678]],
    snapshot: [
      { dept: "Sales", rev: "$3.62M", margin: "12%", chg: "+8%" },
      { dept: "Service", rev: "$842K", margin: "58%", chg: "+4%" },
      { dept: "Parts", rev: "$678K", margin: "31%", chg: "+2%" },
      { dept: "Rentals", rev: "$760K", margin: "44%", chg: "+11%" }
    ]
  }
};

/* window-independent series */
const TREND = [
  { m: "Feb", v: 610 }, { m: "Mar", v: 690 }, { m: "Apr", v: 720 },
  { m: "May", v: 780 }, { m: "Jun", v: 815 }, { m: "Jul", v: 842 }
];
const CONVERSION = [
  { stage: "Lead → Demo", pct: 72, color: "var(--slate-light)" },
  { stage: "Demo → Quote", pct: 65, color: "var(--steel-blue)" },
  { stage: "Quote → Finance", pct: 58, color: "var(--amber)" },
  { stage: "Finance → Close", pct: 81, color: "var(--field-green)" },
  { stage: "Close → Won", pct: 88, color: "var(--clay)" }
];
const UTIL = { pct: 55, onRent: 6, available: 4, reserved: 1 };
const TOPCUST = [
  { id: "hendricks", name: "Hendricks Family Farms", ltv: "$1.9M" },
  { id: "redriver", name: "Red River Grain Co.", ltv: "$1.2M" },
  { id: "ostrander", name: "Ostrander Farms", ltv: "$1.1M" },
  { id: "coteau", name: "Coteau Dairy Co-op", ltv: "$880K" },
  { id: "sundquist", name: "Sundquist Excavating", ltv: "$720K" }
];

/* ---------- pieces ---------- */
function fmtRev(a) { return a >= 1000 ? "$" + (a / 1000).toFixed(2).replace(/\.?0+$/, "") + "M" : "$" + a + "K"; }

function statCards(p) {
  return p.kpis.map((c, i) => `
    <div class="stat-card ${KPI_CLS[i]}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-delta">${c.sub}</div>
    </div>`).join("");
}

function revenueBars(p) {
  const max = Math.max(...p.revenue.map(r => r[1]));
  return `<div class="panel">` + p.revenue.map(([dept, amt]) => `
    <div class="pipeline-row">
      <div class="pipeline-stage">${dept}</div>
      <div class="pipeline-bar-track"><div class="pipeline-bar-fill" style="width:${Math.round(amt / max * 100)}%; background:${REV_COLOR[dept]};"></div></div>
      <div class="pipeline-value">${fmtRev(amt)}</div>
    </div>`).join("") + `</div>`;
}

function trendChart() {
  const max = Math.max(...TREND.map(t => t.v));
  return `<div class="col-chart" style="height:170px;">` + TREND.map((t, i) => `
    <div class="col">
      <div class="col-val">$${t.v}K</div>
      <div class="col-bar ${i === TREND.length - 1 ? "hi" : ""}" style="height:${Math.round(t.v / max * 120)}px;"></div>
      <div class="col-label">${t.m}</div>
    </div>`).join("") + `</div>`;
}

function conversionBars() {
  return `<div class="panel">` + CONVERSION.map(c => `
    <div class="pipeline-row">
      <div class="pipeline-stage" style="width:118px;">${c.stage}</div>
      <div class="pipeline-bar-track"><div class="pipeline-bar-fill" style="width:${c.pct}%; background:${c.color};"></div></div>
      <div class="pipeline-value">${c.pct}%</div>
    </div>`).join("") + `</div>`;
}

function utilization() {
  return `
    <div class="util-big">
      <div class="util-num">${UTIL.pct}%</div>
      <div class="util-sub">fleet utilization · ${UTIL.onRent} of ${UTIL.onRent + UTIL.available + UTIL.reserved} units out</div>
      <div class="pipeline-bar-track"><div class="pipeline-bar-fill" style="width:${UTIL.pct}%; background:var(--steel-blue);"></div></div>
    </div>
    <div class="util-break">
      <div class="util-chip"><div class="n">${UTIL.onRent}</div><div class="l">On Rent</div></div>
      <div class="util-chip"><div class="n">${UTIL.available}</div><div class="l">Available</div></div>
      <div class="util-chip"><div class="n">${UTIL.reserved}</div><div class="l">Reserved</div></div>
    </div>`;
}

function topCustomers() {
  return `<table class="ltable">
    <thead><tr><th>Customer</th><th class="num">Lifetime Value</th></tr></thead>
    <tbody>${TOPCUST.map(c => `<tr>
      <td><a class="po-link" href="customer.html?c=${c.id}">${c.name}</a></td>
      <td class="num">${c.ltv}</td></tr>`).join("")}</tbody></table>`;
}

function snapshotTable(p) {
  return `<table class="ltable">
    <thead><tr><th>Department</th><th class="num">Revenue</th><th class="num">Margin</th><th class="num">vs. prior</th></tr></thead>
    <tbody>${p.snapshot.map(s => `<tr>
      <td>${s.dept}</td><td class="num">${s.rev}</td><td class="num">${s.margin}</td>
      <td class="num" style="color:${s.chg.startsWith("−") ? "var(--clay-deep)" : "var(--field-green-deep)"}">${s.chg}</td></tr>`).join("")}</tbody></table>`;
}

function card(title, swatch, body) {
  return `<div class="card"><div class="card-head"><div class="card-title"><span class="swatch" style="background:${swatch}"></span>${title}</div></div>${body}</div>`;
}

function renderContent(p) {
  document.getElementById("rp-content").innerHTML = `
    <div class="stat-strip">${statCards(p)}</div>
    <div class="lower-grid">
      ${card("Revenue by Department (" + p.tag + ")", "var(--field-green)", revenueBars(p))}
      ${card("Revenue — Last 6 Months", "var(--amber)", trendChart())}
    </div>
    <div class="lower-grid">
      ${card("Sales Pipeline Conversion", "var(--clay)", conversionBars())}
      ${card("Rental Fleet Utilization", "var(--steel-blue)", utilization())}
    </div>
    <div class="lower-grid">
      ${card("Top Customers", "var(--slate)", topCustomers())}
      ${card("Department Snapshot", "var(--charcoal-3)", snapshotTable(p))}
    </div>`;
  const sub = document.querySelector(".page-intro .sub");
  if (sub) sub.textContent = "Dealership performance · " + p.label + " — Prairie Line — Fargo";
}

/* ---------- period picker ---------- */
const CHEVRON = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';
const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>';
const PERIOD_KEY = "fieldbook-report-period";

(function () {
  const pill = document.getElementById("rp-period");
  let current = localStorage.getItem(PERIOD_KEY);
  if (!PERIODS[current]) current = "mtd";

  function renderPill() {
    pill.innerHTML =
      '<span class="ss-label">' + PERIODS[current].label + '</span>' + CHEVRON +
      '<div class="menu"><div class="menu-label">Period</div>' +
      PERIOD_ORDER.map(k => '<div class="menu-item' + (k === current ? ' current' : '') + '" data-period="' + k + '">' + PERIODS[k].label + (k === current ? '<span class="mi-check">' + CHECK + '</span>' : '') + '</div>').join("") +
      '</div>';
  }

  function select(k) {
    if (!PERIODS[k]) return;
    current = k;
    localStorage.setItem(PERIOD_KEY, k);
    renderPill();
    renderContent(PERIODS[k]);
  }

  renderPill();
  renderContent(PERIODS[current]);

  document.addEventListener("click", e => {
    const menu = pill.querySelector(".menu");
    const opt = e.target.closest("[data-period]");
    if (opt && pill.contains(opt)) { e.preventDefault(); select(opt.dataset.period); return; }
    if (e.target.closest("#rp-period")) {
      if (!e.target.closest(".menu")) menu.classList.toggle("open"); // pill body toggles; menu chrome stays open
      return;
    }
    menu.classList.remove("open"); // outside click closes
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") pill.querySelector(".menu").classList.remove("open"); });
})();
