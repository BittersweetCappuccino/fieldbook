/* ============================================================
   Customer detail — a 360 view. ?c=<id> selects the record.
   Reuses the work order shell (no lifecycle) and pulls the
   customer's activity across service, rentals, sales, and
   warranty, each row linking to the underlying record.
   ============================================================ */
const CUSTOMERS = {
  "hendricks": {
    name: "Hendricks Family Farms", segment: "Ag", contact: "Marcus Hendricks",
    phone: "(701) 555-0148", email: "marcus@hendricksfarms.example", address: "4412 County Rd 12, Casselton, ND",
    since: "2011", rep: "S. Meyer", ltv: "$1.9M",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$1.9M</b><br>14 years · Net 30 · good standing`,
    account: [["Open balance", "$1,102.45 (WO-88213)"], ["Terms", "Net 30"], ["Credit", "In good standing"], ["AR aging", "Current"]],
    units: [["John Deere 8R 250", "Hendricks Farm #4"], ["John Deere 8320R", "2015 · trade-in pending"]],
    service: [["88213", "WO-88213 · 8R 250 hydraulic & PTO", "In Progress"]],
    rentals: [["4471", "RN-4471 · Bobcat T770", "On Schedule · due tomorrow"]],
    sales: [["2041", "D-2041 · 2× John Deere 8R 250", "Lead · $290K"]],
    warranty: []
  },
  "redriver": {
    name: "Red River Grain Co.", segment: "Ag", contact: "Roland Voss",
    phone: "(701) 555-0192", email: "rvoss@redrivergrain.example", address: "88 Elevator Rd, Grand Forks, ND",
    since: "2014", rep: "A. Boyd", ltv: "$1.2M",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$1.2M</b><br>11 years · Net 30 · good standing`,
    account: [["Open balance", "$989.60 (WO-88190)"], ["Terms", "Net 30"], ["Credit", "In good standing"], ["AR aging", "Current"]],
    units: [["Case IH Magnum 340", "Red River #2"], ["Case IH Steiger 400", "2013 · trade-in"]],
    service: [["88190", "WO-88190 · Magnum 340 500-hr", "Waiting on Parts"]],
    rentals: [],
    sales: [["2033", "D-2033 · Case IH Steiger 470", "Demo Set · $215K"]],
    warranty: []
  },
  "meadowlark": {
    name: "Meadowlark Golf Club", segment: "Turf", contact: "Petra Nowak",
    phone: "(701) 555-0221", email: "pnowak@meadowlarkgc.example", address: "1 Fairway Dr, Fargo, ND",
    since: "2016", rep: "A. Boyd", ltv: "$540K",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$540K</b><br>9 years · Net 15 · good standing`,
    account: [["Open balance", "$1,506.50 (rental)"], ["Terms", "Net 15"], ["Credit", "In good standing"], ["AR aging", "1 item overdue"]],
    accountNote: { html: `Rental <a class="po-link" href="rental.html?rn=4459">RN-4459</a> is 2 days overdue — late fees accruing at $110/day.` },
    units: [["Toro Groundsmaster 4000-D", "Meadowlark #7"]],
    service: [["88175", "WO-88175 · Groundsmaster deck belt", "Ready for Pickup"]],
    rentals: [["4459", "RN-4459 · Toro Sand Pro 3040", "Overdue"]],
    sales: [["2038", "D-2038 · 3× Toro Groundsmaster 4700", "Demo Set · $80K"]],
    warranty: []
  },
  "thorson": {
    name: "Thorson Dairy LLC", segment: "Ag", contact: "Erik Thorson",
    phone: "(701) 555-0175", email: "ethorson@thorsondairy.example", address: "7720 33rd St SE, Jamestown, ND",
    since: "2018", rep: "A. Boyd", ltv: "$610K",
    stamp: { cls: "waiting", label: "Watch" },
    priority: `Lifetime value: <b>$610K</b><br>7 years · Net 30 · <b class="warn">watch</b>`,
    account: [["Open balance", "$0.00"], ["Terms", "Net 30"], ["Credit", "Watch — see note"], ["AR aging", "Current"]],
    accountNote: { flagged: true, html: `Warranty <a class="po-link" href="warranty.html?wc=2288">WC-2288</a> rejected — unit serial doesn’t match a warrantable PIN. Blocks <a class="po-link" href="work-order.html?wo=88142">WO-88142</a>; verify the serial on the frame plate.` },
    units: [["Kubota M7-172", "Thorson #1 · ⚠ serial unverified"]],
    service: [["88142", "WO-88142 · M7-172 engine derate", "Overdue"]],
    rentals: [],
    sales: [["2021", "D-2021 · Kubota M7-172", "Financing · $55K"]],
    warranty: [["2288", "WC-2288 · engine derate (warranty)", "Rejected"]]
  },
  "coteau": {
    name: "Coteau Dairy Co-op", segment: "Ag", contact: "Lucille Coteau",
    phone: "(701) 555-0133", email: "lcoteau@coteaudairy.example", address: "210 Prairie Ave, Minot, ND",
    since: "2013", rep: "S. Meyer", ltv: "$880K",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$880K</b><br>12 years · Net 30 · good standing`,
    account: [["Open balance", "$363.95 (WO-88221)"], ["Terms", "Net 30"], ["Credit", "In good standing"], ["AR aging", "Current"]],
    units: [["New Holland T6.180", "Coteau Dairy #2"]],
    service: [["88221", "WO-88221 · T6.180 no-start", "In Progress"]],
    rentals: [["4452", "RN-4452 · Bobcat T64", "Returned · ready to invoice"]],
    sales: [["2018", "D-2018 · T6.180 + front loader", "Financing · $155K"]],
    warranty: []
  },
  "sundquist": {
    name: "Sundquist Excavating", segment: "Construction", contact: "Karl Sundquist",
    phone: "(701) 555-0264", email: "karl@sundquistexc.example", address: "5500 40th St S, Fargo, ND",
    since: "2017", rep: "A. Boyd", ltv: "$720K",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$720K</b><br>8 years · Net 30 · good standing`,
    account: [["Open balance", "$431.75 (WO-88205)"], ["Terms", "Net 30"], ["Credit", "In good standing"], ["AR aging", "Current"]],
    units: [["Bobcat S650", "Sundquist #6"]],
    service: [["88205", "WO-88205 · S650 quick-attach", "Ready for Pickup"]],
    rentals: [["4488", "RN-4488 · John Deere 320G", "On Rent"]],
    sales: [["2029", "D-2029 · Bobcat T770 + E88 fleet", "Quoted · $200K"]],
    warranty: []
  },
  "halvorsen": {
    name: "Halvorsen Farms", segment: "Ag", contact: "Pers Halvorsen",
    phone: "(701) 555-0119", email: "pers@halvorsenfarms.example", address: "1290 Rural Rte 4, Hillsboro, ND",
    since: "2019", rep: "S. Meyer", ltv: "$310K",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$310K</b><br>6 years · Net 30 · good standing`,
    account: [["Open balance", "$421.60 (WO-88231)"], ["Terms", "Net 30"], ["Credit", "In good standing"], ["AR aging", "Current"]],
    units: [["John Deere 6M 130", "Halvorsen #3"]],
    service: [["88231", "WO-88231 · 6M 130 cooling", "Scheduled"]],
    rentals: [],
    sales: [["2012", "D-2012 · John Deere 6M 130", "Closing · $33K"]],
    warranty: []
  },
  "ostrander": {
    name: "Ostrander Farms", segment: "Ag", contact: "Greta Ostrander",
    phone: "(701) 555-0207", email: "greta@ostranderfarms.example", address: "600 Section Line Rd, Valley City, ND",
    since: "2012", rep: "S. Meyer", ltv: "$1.1M",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$1.1M</b><br>13 years · Net 30 · good standing`,
    account: [["Open balance", "$0.00"], ["Terms", "Net 30"], ["Credit", "In good standing"], ["AR aging", "Current"]],
    units: [["John Deere 6R 145", "2020 · powertrain warranty"]],
    service: [],
    rentals: [],
    sales: [["2044", "D-2044 · John Deere S780 combine (used)", "Lead · $120K"]],
    warranty: [["2285", "WC-2285 · fuel injection pump", "Approved · $842 credit"]]
  },
  "dakotasteel": {
    name: "Dakota Steel Erectors", segment: "Construction", contact: "Ivan Dahl",
    phone: "(701) 555-0288", email: "idahl@dakotasteel.example", address: "3401 Main Ave, Fargo, ND",
    since: "2015", rep: "S. Meyer", ltv: "$460K",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$460K</b><br>10 years · Net 30 · good standing`,
    account: [["Open balance", "$2,858.90 (rental)"], ["Terms", "Net 30"], ["Credit", "In good standing"], ["AR aging", "Current"]],
    units: [],
    service: [],
    rentals: [["4463", "RN-4463 · Genie S-45 boom lift", "On Rent"]],
    sales: [["2025", "D-2025 · 2× Genie boom lifts (converting from rental)", "Quoted · $180K"]],
    warranty: []
  },
  "prairierose": {
    name: "Prairie Rose Landscaping", segment: "Construction", contact: "Nina Roswell",
    phone: "(701) 555-0311", email: "nina@prairieroseland.example", address: "915 Nursery Ln, West Fargo, ND",
    since: "2016", rep: "A. Boyd", ltv: "$390K",
    stamp: { cls: "ready", label: "Good Standing" },
    priority: `Lifetime value: <b>$390K</b><br>9 years · Net 30 · good standing`,
    account: [["Open balance", "$118.50 (rental)"], ["Terms", "Net 30"], ["Credit", "In good standing"], ["AR aging", "Current"]],
    units: [],
    service: [],
    rentals: [["4490", "RN-4490 · Kubota KX040", "On Rent"], ["4495", "RN-4495 · Vermeer BC1500", "Reserved"]],
    sales: [["2009", "D-2009 · Kubota SVL75 + attachments (converting from rental)", "Closing · $72K"]],
    warranty: []
  }
};

/* ---------- render helpers ---------- */
function subHTML(sub) {
  return sub.map(([k, v, mono]) => `<span>${k}: <b${mono ? ' class="mono"' : ''}>${v}</b></span>`).join("");
}
function kvLines(rows) {
  return rows.map(([k, v]) => `<div class="meta-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
}
function linkRows(items, base, dot) {
  return `<div class="activity">` + items.map(([id, label, status]) =>
    `<div class="act-row"><div class="act-rail"><span class="act-node" style="background:${dot}"></span></div>
      <div><div class="act-text"><a class="po-link" href="${base}${id}">${label}</a></div><div class="act-time">${status}</div></div></div>`).join("") + `</div>`;
}
function unitRows(units) {
  return `<div class="activity">` + units.map(([m, loc]) =>
    `<div class="act-row"><div class="act-rail"><span class="act-node parts"></span></div>
      <div><div class="act-text">${m}</div><div class="act-time">${loc}</div></div></div>`).join("") + `</div>`;
}
function card(title, swatch, body) {
  return `<div class="card"><div class="card-head"><div class="card-title"><span class="swatch" style="background:${swatch}"></span>${title}</div></div>${body}</div>`;
}

function render(rec) {
  let left = "";
  if (rec.service.length) left += card("Service", "var(--amber)", linkRows(rec.service, "work-order.html?wo=", "var(--amber)"));
  if (rec.rentals.length) left += card("Rentals", "var(--steel-blue)", linkRows(rec.rentals, "rental.html?rn=", "var(--steel-blue)"));
  if (rec.sales.length) left += card("Sales", "var(--clay)", linkRows(rec.sales, "deal.html?d=", "var(--clay)"));
  if (rec.warranty.length) left += card("Warranty", "var(--steel-blue-deep)", linkRows(rec.warranty, "warranty.html?wc=", "var(--steel-blue-deep)"));
  if (rec.units.length) left += card("Owned Equipment", "var(--field-green)", unitRows(rec.units));

  const acctNote = rec.accountNote
    ? `<div class="warr-body" style="padding-top:0"><div class="warr-status${rec.accountNote.flagged ? " flagged" : ""}">${rec.accountNote.html}</div></div>`
    : "";

  document.getElementById("content").innerHTML = `
    <div class="wo-head dept-customer">
      <div class="wo-head-l">
        <div class="wo-id-row"><span class="wo-id">ACCOUNT</span><span class="wo-bay">CUSTOMER · ${rec.segment.toUpperCase()} · SINCE ${rec.since}</span></div>
        <div class="wo-title">${rec.name}</div>
        <div class="wo-sub">${subHTML([["Contact", rec.contact], ["Segment", rec.segment], ["Since", rec.since], ["Rep", rec.rep]])}</div>
      </div>
      <div class="wo-head-r">
        <div class="stamp ${rec.stamp.cls}">${rec.stamp.label}</div>
        <div class="wo-priority">${rec.priority}</div>
      </div>
    </div>

    <div class="wo-body" style="margin-top:20px;">
      <div>${left}</div>
      <div>
        <div class="side-card">
          <div class="side-head">Account</div>
          <div class="meta-body">${kvLines(rec.account)}</div>
          ${acctNote}
        </div>
        <div class="side-card">
          <div class="side-head">Contact</div>
          <div class="meta-body">${kvLines([["Contact", rec.contact], ["Phone", rec.phone], ["Email", rec.email], ["Address", rec.address]])}</div>
        </div>
        <div class="side-card">
          <div class="side-head">Summary</div>
          <div class="meta-body">${kvLines([["Customer since", rec.since], ["Segment", rec.segment], ["Lifetime value", rec.ltv], ["Salesperson", rec.rep]])}</div>
        </div>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const id = new URLSearchParams(location.search).get("c");
  const rec = CUSTOMERS[id] || CUSTOMERS["hendricks"];
  render(rec);
  document.title = "Fieldbook — " + rec.name;
  document.getElementById("crumb-here").textContent = rec.name;
})();
