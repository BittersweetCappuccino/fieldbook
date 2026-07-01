/* ============================================================
   Rental agreement detail. One data-driven template; ?rn=<id>
   selects the record. Reuses the work order detail shell
   (wo-head / stepper / cards / side rail) with a rental accent.
   ============================================================ */
const RENTALS = {
  "4471": {
    accent: "rental", cat: "COMPACT TRACK LOADER · ON RENT",
    title: "Bobcat T770 — Compact Track Loader",
    sub: [["Unit", "T770 #RF-118"], ["Serial", "B4SC12984", true], ["Customer", "Hendricks Family Farms"], ["Out", "Jun 20"]],
    stamp: { cls: "scheduled", label: "On Schedule" },
    priority: `Due back: <b>Jul 2 — tomorrow</b><br>On schedule`,
    elapsed: `On rent <b>12 days</b> · Meter <b>+38.5 h</b>`,
    steps: [
      { name: "Reserved", time: "Jun 18", state: "done" },
      { name: "Checked Out", time: "Jun 20 · 8:00a", state: "done" },
      { name: "On Rent", time: "Since Jun 20", state: "current" },
      { name: "Due", time: "Jul 2", state: "" },
      { name: "Returned", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    period: [["Checked out", "Jun 20, 8:00 AM"], ["Due back", "Jul 2, 5:00 PM"], ["Duration", "12 days (2 wk)"], ["Delivery", "Dealer haul-out"]],
    rate: [["Weekly rate", "$1,650 / wk"], ["Daily rate", "$385 / day"], ["Billing basis", "Weekly"], ["Accrued to date", "$2,970"]],
    condition: { out: "Undercarriage 85%, no leaks, full fuel. 1,242 machine hours out.", ret: "Pending return inspection." },
    activity: [
      { text: "<b>Return reminder</b> sent to customer", time: "Today · 9:00 AM" },
      { text: "On-rent — delivered to Hendricks Farm, north quarter", time: "Jun 20 · 8:00 AM" },
      { text: "Reservation confirmed by phone", time: "Jun 18 · 2:15 PM" }
    ],
    cost: { rows: [["Rental (12 days)", "$2,970.00"], ["Damage waiver (10%)", "$297.00"], ["Delivery / pickup", "$180.00"], ["Est. tax", "$207.00"]], deposit: "$500.00 held", total: "$3,654.00" },
    statusNote: { html: `<b>Due tomorrow.</b> Confirm the return window or extend the agreement — reminder sent this morning.` },
    meta: [["Model", "Bobcat T770"], ["Serial", `<span class="mono">B4SC12984</span>`], ["Meter out", `<span class="mono">1,242 h</span>`], ["Customer", "Hendricks Family Farms"], ["Contact", "Marcus Hendricks"], ["Site", "Hendricks Farm — north quarter"], ["Terms", "Net 30 · deposit $500"]]
  },

  "4459": {
    accent: "overdue", cat: "BUNKER RAKE · OVERDUE",
    title: "Toro Sand Pro 3040 — Bunker Rake",
    sub: [["Unit", "SP3040 #RF-077"], ["Serial", "TSP44190", true], ["Customer", "Meadowlark Golf Club"], ["Out", "Jun 13"]],
    stamp: { cls: "overdue", label: "Overdue" },
    priority: `Due back: <b class="warn">Jun 29 — 2 days overdue</b><br>Contact customer`,
    elapsed: `On rent <b>18 days</b> · 2 days past due`,
    steps: [
      { name: "Reserved", time: "Jun 11", state: "done" },
      { name: "Checked Out", time: "Jun 13 · 7:30a", state: "done" },
      { name: "On Rent", time: "Jun 13", state: "done" },
      { name: "Due", time: "Jun 29 · overdue", state: "overdue" },
      { name: "Returned", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    period: [["Checked out", "Jun 13, 7:30 AM"], ["Due back", "Jun 29, 5:00 PM"], ["Days overdue", "2 days"], ["Delivery", "Customer pickup"]],
    rate: [["Weekly rate", "$420 / wk"], ["Daily rate", "$110 / day"], ["Late fee", "$110 / day past due"], ["Accrued to date", "$1,300"]],
    condition: { out: "Good condition; brushes 70%, full fuel.", ret: "Pending return inspection." },
    activity: [
      { text: "<b>Overdue notice</b> sent to customer", time: "Today · 8:30 AM" },
      { text: "Second return reminder — no response", time: "Jun 30 · 4:00 PM" },
      { text: "On-rent — customer pickup", time: "Jun 13 · 7:30 AM" }
    ],
    cost: { rows: [["Rental (18 days)", "$1,080.00"], ["Late fee (2 days)", "$220.00"], ["Damage waiver", "$108.00"], ["Est. tax", "$98.50"]], deposit: "$300.00 held", total: "$1,506.50" },
    statusNote: { flagged: true, html: `<b>2 days overdue.</b> Overdue notice sent; late fees accruing at $110/day. Escalate if no response by end of day.` },
    meta: [["Model", "Toro Sand Pro 3040"], ["Serial", `<span class="mono">TSP44190</span>`], ["Meter out", `<span class="mono">610 h</span>`], ["Customer", "Meadowlark Golf Club"], ["Contact", "Petra Nowak"], ["Site", "Meadowlark GC — course"], ["Terms", "Net 15 · deposit $300"]]
  },

  "4488": {
    accent: "rental", cat: "SKID STEER · ON RENT",
    title: "John Deere 320G — Skid Steer",
    sub: [["Unit", "320G #RF-131"], ["Serial", "JD320G0771", true], ["Customer", "Sundquist Excavating"], ["Out", "Jun 28"]],
    stamp: { cls: "scheduled", label: "On Rent" },
    priority: `Due back: <b>Jul 12</b><br>On schedule`,
    elapsed: `On rent <b>4 days</b> · Meter <b>+21.0 h</b>`,
    steps: [
      { name: "Reserved", time: "Jun 26", state: "done" },
      { name: "Checked Out", time: "Jun 28 · 7:00a", state: "done" },
      { name: "On Rent", time: "Since Jun 28", state: "current" },
      { name: "Due", time: "Jul 12", state: "" },
      { name: "Returned", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    period: [["Checked out", "Jun 28, 7:00 AM"], ["Due back", "Jul 12, 5:00 PM"], ["Duration", "14 days (2 wk)"], ["Delivery", "Customer pickup"]],
    rate: [["Weekly rate", "$1,200 / wk"], ["Daily rate", "$280 / day"], ["Billing basis", "Weekly"], ["Accrued to date", "$800"]],
    condition: { out: "New-condition unit; full fuel, tires 90%.", ret: "Pending return inspection." },
    activity: [
      { text: "On-rent — customer pickup, checkout inspection signed", time: "Jun 28 · 7:00 AM" },
      { text: "Reservation confirmed", time: "Jun 26 · 11:00 AM" }
    ],
    cost: { rows: [["Rental (4 of 14 days)", "$800.00"], ["Damage waiver (10%)", "$80.00"], ["Est. tax", "$61.60"]], deposit: "$400.00 held", total: "$941.60", note: "Accruing — billed on return." },
    statusNote: { html: `<b>On rent.</b> Nothing due until Jul 12. Meter and condition captured at checkout.` },
    meta: [["Model", "John Deere 320G"], ["Serial", `<span class="mono">JD320G0771</span>`], ["Meter out", `<span class="mono">88 h</span>`], ["Customer", "Sundquist Excavating"], ["Contact", "Karl Sundquist"], ["Site", "Sundquist yard — 40th St"], ["Terms", "Net 30 · deposit $400"]]
  },

  "4463": {
    accent: "rental", cat: "TELESCOPIC BOOM LIFT · ON RENT",
    title: "Genie S-45 — Telescopic Boom Lift",
    sub: [["Unit", "S45 #RF-064"], ["Serial", "GS45A22103", true], ["Customer", "Dakota Steel Erectors"], ["Out", "Jun 24"]],
    stamp: { cls: "scheduled", label: "On Rent" },
    priority: `Due back: <b>Jul 8</b><br>On schedule`,
    elapsed: `On rent <b>8 days</b> · Meter <b>+52.5 h</b>`,
    steps: [
      { name: "Reserved", time: "Jun 22", state: "done" },
      { name: "Checked Out", time: "Jun 24 · 6:45a", state: "done" },
      { name: "On Rent", time: "Since Jun 24", state: "current" },
      { name: "Due", time: "Jul 8", state: "" },
      { name: "Returned", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    period: [["Checked out", "Jun 24, 6:45 AM"], ["Due back", "Jul 8, 5:00 PM"], ["Duration", "14 days (2 wk)"], ["Delivery", "Dealer haul-out"]],
    rate: [["Weekly rate", "$1,950 / wk"], ["Daily rate", "$450 / day"], ["Billing basis", "Weekly"], ["Accrued to date", "$2,229"]],
    condition: { out: "Certified inspection current; full fuel, no defects.", ret: "Pending return inspection." },
    activity: [
      { text: "On-rent — delivered to downtown Fargo jobsite", time: "Jun 24 · 6:45 AM" },
      { text: "Reservation confirmed; annual inspection verified", time: "Jun 22 · 3:30 PM" }
    ],
    cost: { rows: [["Rental (8 of 14 days)", "$2,229.00"], ["Damage waiver (10%)", "$222.90"], ["Delivery / pickup", "$220.00"], ["Est. tax", "$187.00"]], deposit: "$600.00 held", total: "$2,858.90", note: "Accruing — billed on return." },
    statusNote: { html: `<b>On rent.</b> Due Jul 8. Aerial unit — verify annual inspection stays current through the term.` },
    meta: [["Model", "Genie S-45"], ["Serial", `<span class="mono">GS45A22103</span>`], ["Meter out", `<span class="mono">1,905 h</span>`], ["Customer", "Dakota Steel Erectors"], ["Contact", "Ivan Dahl"], ["Site", "Downtown Fargo jobsite"], ["Terms", "Net 30 · deposit $600"]]
  },

  "4490": {
    accent: "rental", cat: "COMPACT EXCAVATOR · ON RENT",
    title: "Kubota KX040 — Compact Excavator",
    sub: [["Unit", "KX040 #RF-149"], ["Serial", "KBX040551", true], ["Customer", "Prairie Rose Landscaping"], ["Out", "Jul 1"]],
    stamp: { cls: "scheduled", label: "On Rent" },
    priority: `Due back: <b>Jul 15</b><br>Just checked out today`,
    elapsed: `On rent <b>today</b> · Meter <b>+0.0 h</b>`,
    steps: [
      { name: "Reserved", time: "Jun 29", state: "done" },
      { name: "Checked Out", time: "Jul 1 · 9:15a", state: "done" },
      { name: "On Rent", time: "Since today", state: "current" },
      { name: "Due", time: "Jul 15", state: "" },
      { name: "Returned", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    period: [["Checked out", "Jul 1, 9:15 AM"], ["Due back", "Jul 15, 5:00 PM"], ["Duration", "14 days (2 wk)"], ["Delivery", "Customer pickup"]],
    rate: [["Weekly rate", "$1,100 / wk"], ["Daily rate", "$260 / day"], ["Billing basis", "Weekly"], ["Accrued to date", "$0"]],
    condition: { out: "Full fuel, tracks 95%, no defects. Two buckets included.", ret: "Pending return inspection." },
    activity: [
      { text: "On-rent — customer pickup, checkout inspection signed", time: "Jul 1 · 9:15 AM" },
      { text: "Reservation confirmed", time: "Jun 29 · 1:00 PM" }
    ],
    cost: { rows: [["Rental (0 of 14 days)", "$0.00"], ["Damage waiver (10%)", "$110.00"], ["Est. tax", "$8.50"]], deposit: "$350.00 held", total: "$118.50", note: "Accruing — billed on return." },
    statusNote: { html: `<b>On rent.</b> Just checked out. Two-bucket kit logged; due back Jul 15.` },
    meta: [["Model", "Kubota KX040"], ["Serial", `<span class="mono">KBX040551</span>`], ["Meter out", `<span class="mono">412 h</span>`], ["Customer", "Prairie Rose Landscaping"], ["Contact", "Nina Roswell"], ["Site", "Rose yard — staging"], ["Terms", "Net 30 · deposit $350"]]
  },

  "4495": {
    accent: "rental", cat: "BRUSH CHIPPER · RESERVED",
    title: "Vermeer BC1500 — Brush Chipper",
    sub: [["Unit", "BC1500 #RF-092"], ["Serial", "VBC1500337", true], ["Customer", "Prairie Rose Landscaping"], ["Booked", "Jun 30"]],
    stamp: { cls: "waiting", label: "Reserved" },
    priority: `Reserved: <b>Jul 5 – Jul 12</b><br>Not yet out`,
    elapsed: `Reservation held · pickup <b>Jul 5</b>`,
    steps: [
      { name: "Reserved", time: "Jun 30", state: "current" },
      { name: "Checked Out", time: "Jul 5", state: "" },
      { name: "On Rent", time: "—", state: "" },
      { name: "Due", time: "Jul 12", state: "" },
      { name: "Returned", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    period: [["Pickup", "Jul 5, 8:00 AM"], ["Due back", "Jul 12, 5:00 PM"], ["Duration", "7 days (1 wk)"], ["Delivery", "Customer pickup"]],
    rate: [["Weekly rate", "$980 / wk"], ["Daily rate", "$230 / day"], ["Billing basis", "Weekly"], ["Accrued to date", "$0"]],
    condition: { out: "Pending checkout inspection at release.", ret: "—" },
    activity: [
      { text: "Reservation created for Jul 5 pickup", time: "Jun 30 · 10:20 AM" }
    ],
    cost: { rows: [["Rental (est 1 wk)", "$980.00"], ["Damage waiver (10%)", "$98.00"], ["Est. tax", "$75.50"]], deposit: "$300.00 to collect", total: "$1,153.50", note: "Estimated — reservation, not yet out." },
    statusNote: { html: `<b>Reserved.</b> Unit held for Jul 5 pickup. Collect the deposit and complete the checkout inspection at release.` },
    meta: [["Model", "Vermeer BC1500"], ["Serial", `<span class="mono">VBC1500337</span>`], ["Meter", `<span class="mono">2,140 h</span>`], ["Customer", "Prairie Rose Landscaping"], ["Contact", "Nina Roswell"], ["Site", "Reserved — pickup at yard"], ["Terms", "Net 30 · deposit $300"]]
  },

  "4452": {
    accent: "rental", cat: "COMPACT TRACK LOADER · RETURNED",
    title: "Bobcat T64 — Compact Track Loader",
    sub: [["Unit", "T64 #RF-103"], ["Serial", "B4SC10228", true], ["Customer", "Coteau Dairy Co-op"], ["Out", "Jun 10"]],
    stamp: { cls: "ready", label: "Returned" },
    priority: `<b>Returned Jun 27</b><br>Ready to invoice`,
    elapsed: `Rented <b>17 days</b> · Meter <b>+61.0 h</b>`,
    steps: [
      { name: "Reserved", time: "Jun 8", state: "done" },
      { name: "Checked Out", time: "Jun 10 · 9:00a", state: "done" },
      { name: "On Rent", time: "Jun 10", state: "done" },
      { name: "Due", time: "Jun 27", state: "done" },
      { name: "Returned", time: "Jun 27 · 3:20p", state: "done" },
      { name: "Invoiced", time: "Ready", state: "current" },
      { name: "Closed", time: "—", state: "" }
    ],
    period: [["Checked out", "Jun 10, 9:00 AM"], ["Returned", "Jun 27, 3:20 PM"], ["Duration", "17 days (2.5 wk)"], ["Delivery", "Dealer haul both ways"]],
    rate: [["Weekly rate", "$1,450 / wk"], ["Daily rate", "$340 / day"], ["Billing basis", "Weekly"], ["Total rental", "$3,625"]],
    condition: { out: "Undercarriage 90%, full fuel. 980 machine hours out.", ret: "Returned clean; undercarriage 82%, minor expected wear — no damage charge. Fuel refill fee applied." },
    activity: [
      { text: "Returned to yard — inspection complete, no damage", time: "Jun 27 · 3:20 PM" },
      { text: "On-rent — delivered to Coteau farm", time: "Jun 10 · 9:00 AM" }
    ],
    cost: { rows: [["Rental (17 days · 2.5 wk)", "$3,625.00"], ["Damage waiver (10%)", "$362.50"], ["Fuel refill", "$85.00"], ["Est. tax", "$285.00"]], deposit: "$500.00 — refunding", total: "$4,357.50" },
    statusNote: { html: `<b>Returned.</b> Inspection complete, no damage. Ready to invoice; deposit refund pending.` },
    meta: [["Model", "Bobcat T64"], ["Serial", `<span class="mono">B4SC10228</span>`], ["Meter in", `<span class="mono">1,041 h</span>`], ["Customer", "Coteau Dairy Co-op"], ["Contact", "Lucille Coteau"], ["Site", "Returned to yard"], ["Terms", "Net 30 · deposit $500"]]
  }
};

/* ---------- render helpers ---------- */
function subHTML(sub) {
  return sub.map(([k, v, mono]) => `<span>${k}: <b${mono ? ' class="mono"' : ''}>${v}</b></span>`).join("");
}
function stepsHTML(steps) {
  return steps.map(s => `<div class="step ${s.state}"><span class="node"></span><div class="step-name">${s.name}</div><div class="step-time">${s.time}</div></div>`).join("");
}
function kvLines(rows) {
  return rows.map(([k, v]) => `<div class="meta-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
}
function activityHTML(rows) {
  return rows.map(a => `<div class="act-row">
    <div class="act-rail"><span class="act-node"></span></div>
    <div><div class="act-text">${a.text}</div><div class="act-time">${a.time}</div></div></div>`).join("");
}

function render(rec) {
  const c = rec.cost;
  document.getElementById("content").innerHTML = `
    <div class="wo-head ${rec.accent === "overdue" ? "dept-overdue" : "dept-rental"}">
      <div class="wo-head-l">
        <div class="wo-id-row"><span class="wo-id">${rec.rn}</span><span class="wo-bay">${rec.cat}</span></div>
        <div class="wo-title">${rec.title}</div>
        <div class="wo-sub">${subHTML(rec.sub)}</div>
      </div>
      <div class="wo-head-r">
        <div class="stamp ${rec.stamp.cls}">${rec.stamp.label}</div>
        <div class="wo-priority">${rec.priority}</div>
      </div>
    </div>

    <div class="lifecycle">
      <div class="lifecycle-head"><div class="section-title">Rental Lifecycle</div><div class="elapsed">${rec.elapsed}</div></div>
      <div class="stepper">${stepsHTML(rec.steps)}</div>
    </div>

    <div class="wo-body">
      <div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--steel-blue)"></span>Rental Period</div></div>
          <div class="meta-body">${kvLines(rec.period)}</div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>Rate &amp; Billing</div></div>
          <div class="meta-body">${kvLines(rec.rate)}</div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--field-green)"></span>Condition &amp; Inspection</div></div>
          <div>
            <div class="threec"><div class="threec-label neutral">Out</div><div class="threec-text">${rec.condition.out}</div></div>
            <div class="threec"><div class="threec-label neutral">Return</div><div class="threec-text">${rec.condition.ret}</div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--charcoal-3)"></span>Activity Log</div></div>
          <div class="activity">${activityHTML(rec.activity)}</div>
        </div>
      </div>

      <div>
        <div class="side-card">
          <div class="side-head">Cost Summary</div>
          <div class="cost-body">
            ${c.rows.map(([l, v]) => `<div class="cost-row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join("")}
            <div class="cost-row"><span class="lbl">Deposit</span><span class="val">${c.deposit}</span></div>
            <div class="cost-total"><span class="lbl">Est. Total</span><span class="val">${c.total}</span></div>
            ${c.note ? `<div class="cost-note">${c.note}</div>` : ""}
          </div>
        </div>
        <div class="side-card">
          <div class="side-head">Status</div>
          <div class="warr-body"><div class="warr-status${rec.statusNote.flagged ? " flagged" : ""}">${rec.statusNote.html}</div></div>
        </div>
        <div class="side-card">
          <div class="side-head">Unit &amp; Customer</div>
          <div class="meta-body">${rec.meta.map(([k, v]) => `<div class="meta-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("")}</div>
        </div>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const id = new URLSearchParams(location.search).get("rn") || "4471";
  const rec = RENTALS[id] || RENTALS["4471"];
  rec.rn = "RN-" + (RENTALS[id] ? id : "4471");
  render(rec);
  document.title = "Fieldbook — " + rec.rn;
  document.getElementById("crumb-here").textContent = rec.rn;
})();
