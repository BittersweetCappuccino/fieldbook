/* ============================================================
   Reporting — dealership analytics. Hand-built CSS charts and
   linked tables; numbers reconcile with the department screens
   (pipeline $1.4M, rental fleet, top-customer lifetime values).
   ============================================================ */
const KPIS = [
  { cls: "green", label: "Revenue (MTD)", value: "$842K", sub: "▲ 3% vs. June" },
  { cls: "amber", label: "Gross Margin", value: "22.4%", sub: "▲ 0.6 pts" },
  { cls: "blue", label: "Service Hours Billed", value: "412 h", sub: "78% of capacity" },
  { cls: "clay", label: "Units Sold (MTD)", value: "6", sub: "$0.9M in equipment" }
];

const REVENUE = [
  { dept: "Sales", amount: 520, color: "var(--clay)" },
  { dept: "Service", amount: 118, color: "var(--amber)" },
  { dept: "Rentals", amount: 108, color: "var(--steel-blue)" },
  { dept: "Parts", amount: 96, color: "var(--field-green)" }
];

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

const SNAPSHOT = [
  { dept: "Sales", rev: "$520K", margin: "12%", chg: "+4%" },
  { dept: "Service", rev: "$118K", margin: "58%", chg: "+2%" },
  { dept: "Parts", rev: "$96K", margin: "31%", chg: "−1%" },
  { dept: "Rentals", rev: "$108K", margin: "44%", chg: "+7%" }
];

/* ---------- pieces ---------- */
function statCards() {
  return KPIS.map(c => `
    <div class="stat-card ${c.cls}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-delta">${c.sub}</div>
    </div>`).join("");
}

function revenueBars() {
  const max = Math.max(...REVENUE.map(r => r.amount));
  return `<div class="panel">` + REVENUE.map(r => `
    <div class="pipeline-row">
      <div class="pipeline-stage">${r.dept}</div>
      <div class="pipeline-bar-track"><div class="pipeline-bar-fill" style="width:${Math.round(r.amount / max * 100)}%; background:${r.color};"></div></div>
      <div class="pipeline-value">$${r.amount}K</div>
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

function snapshotTable() {
  return `<table class="ltable">
    <thead><tr><th>Department</th><th class="num">Revenue</th><th class="num">Margin</th><th class="num">vs. last mo.</th></tr></thead>
    <tbody>${SNAPSHOT.map(s => `<tr>
      <td>${s.dept}</td><td class="num">${s.rev}</td><td class="num">${s.margin}</td>
      <td class="num" style="color:${s.chg.startsWith("−") ? "var(--clay-deep)" : "var(--field-green-deep)"}">${s.chg}</td></tr>`).join("")}</tbody></table>`;
}

function card(title, swatch, body) {
  return `<div class="card"><div class="card-head"><div class="card-title"><span class="swatch" style="background:${swatch}"></span>${title}</div></div>${body}</div>`;
}

/* ---------- boot ---------- */
(function () {
  document.getElementById("rp-content").innerHTML = `
    <div class="stat-strip">${statCards()}</div>
    <div class="lower-grid">
      ${card("Revenue by Department (MTD)", "var(--field-green)", revenueBars())}
      ${card("Revenue — Last 6 Months", "var(--amber)", trendChart())}
    </div>
    <div class="lower-grid">
      ${card("Sales Pipeline Conversion", "var(--clay)", conversionBars())}
      ${card("Rental Fleet Utilization", "var(--steel-blue)", utilization())}
    </div>
    <div class="lower-grid">
      ${card("Top Customers", "var(--slate)", topCustomers())}
      ${card("Department Snapshot", "var(--charcoal-3)", snapshotTable())}
    </div>`;
})();
