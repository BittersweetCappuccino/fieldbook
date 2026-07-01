/* ============================================================
   Sales pipeline — the "Full board" screen.
   A kanban of deals across the five pipeline stages (deal cards
   link to deal.html?d=<id>, all backed by real records) plus a
   computed stat strip. Stage totals reconcile with the dashboard
   pipeline ($1.4M).
   ============================================================ */

/* every deal has a matching record in deal.js */
const DEALS = [
  { id: "2041", customer: "Hendricks Family Farms", equip: "2× John Deere 8R 250 (new)", value: 290000, stage: "lead", rep: "S. Meyer" },
  { id: "2044", customer: "Ostrander Farms", equip: "John Deere S780 combine (used)", value: 120000, stage: "lead", rep: "S. Meyer" },
  { id: "2033", customer: "Red River Grain Co.", equip: "Case IH Steiger 470 (new)", value: 215000, stage: "demo", rep: "A. Boyd" },
  { id: "2038", customer: "Meadowlark Golf Club", equip: "3× Toro Groundsmaster 4700", value: 80000, stage: "demo", rep: "A. Boyd" },
  { id: "2025", customer: "Dakota Steel Erectors", equip: "2× Genie boom lifts (new)", value: 180000, stage: "quoted", rep: "S. Meyer" },
  { id: "2029", customer: "Sundquist Excavating", equip: "Bobcat T770 + E88 fleet", value: 200000, stage: "quoted", rep: "A. Boyd" },
  { id: "2018", customer: "Coteau Dairy Co-op", equip: "New Holland T6.180 + loader", value: 155000, stage: "financing", rep: "S. Meyer" },
  { id: "2021", customer: "Thorson Dairy LLC", equip: "Kubota M7-172 (new)", value: 55000, stage: "financing", rep: "A. Boyd" },
  { id: "2009", customer: "Prairie Rose Landscaping", equip: "Kubota SVL75 + attachments", value: 72000, stage: "closing", rep: "A. Boyd" },
  { id: "2012", customer: "Halvorsen Farms", equip: "John Deere 6M 130 (new)", value: 33000, stage: "closing", rep: "S. Meyer" }
];

const STAGES = [
  { key: "lead", name: "Lead", prob: 0.15 },
  { key: "demo", name: "Demo Set", prob: 0.35 },
  { key: "quoted", name: "Quoted", prob: 0.55 },
  { key: "financing", name: "Financing", prob: 0.75 },
  { key: "closing", name: "Closing", prob: 0.90 }
];

function money(n) {
  return n >= 1000000 ? "$" + (n / 1e6).toFixed(1) + "M" : "$" + Math.round(n / 1000) + "K";
}
function stageDeals(key) { return DEALS.filter(d => d.stage === key); }
function stageTotal(key) { return stageDeals(key).reduce((s, d) => s + d.value, 0); }

function renderStats() {
  const total = DEALS.reduce((s, d) => s + d.value, 0);
  const weighted = STAGES.reduce((s, st) => s + stageTotal(st.key) * st.prob, 0);
  const closing = stageDeals("closing");
  const cards = [
    { cls: "green", label: "Pipeline Value", value: money(total), sub: DEALS.length + " open deals" },
    { cls: "clay", label: "Weighted Forecast", value: money(weighted), sub: "probability-adjusted" },
    { cls: "amber", label: "Closing This Month", value: money(stageTotal("closing")), sub: closing.length + " deals in closing" },
    { cls: "blue", label: "Reps Active", value: "2", sub: "S. Meyer · A. Boyd" }
  ];
  document.getElementById("sl-stats").innerHTML = cards.map(c => `
    <div class="stat-card ${c.cls}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-delta">${c.sub}</div>
    </div>`).join("");
}

function renderBoard() {
  document.getElementById("sl-board").innerHTML = STAGES.map(st => {
    const deals = stageDeals(st.key);
    const cards = deals.length
      ? deals.map(d => `<a class="deal-card" href="deal.html?d=${d.id}">
          <div class="dc-id">D-${d.id}</div>
          <div class="dc-cust">${d.customer}</div>
          <div class="dc-equip">${d.equip}</div>
          <div class="dc-foot"><span class="dc-val">${money(d.value)}</span><span class="dc-rep">${d.rep}</span></div>
        </a>`).join("")
      : `<div class="kan-empty">No deals</div>`;
    return `<div class="kan-col">
      <div class="kan-head">
        <div class="kan-name">${st.name}<span class="kan-count">${deals.length}</span></div>
        <div class="kan-total">${money(stageTotal(st.key))}</div>
      </div>
      ${cards}
    </div>`;
  }).join("");
}

(function () {
  renderStats();
  renderBoard();
})();
