/* ============================================================
   Deal (opportunity) detail. ?d=<id> selects the record. Reuses
   the work order detail shell with a sales pipeline stepper
   (Lead -> Demo Set -> Quoted -> Financing -> Closing -> Won).
   Customers overlap with service/rentals for cross-continuity.
   ============================================================ */
const DEALS = {
  "2041": {
    cat: "NEW EQUIPMENT · S. MEYER",
    title: "2× John Deere 8R 250 — New Tractors",
    sub: [["Customer", "Hendricks Family Farms"], ["Value", "$290K"], ["Stage", "Lead"], ["Rep", "S. Meyer"]],
    stamp: { cls: "scheduled", label: "Lead" },
    priority: `Est. close: <b>Sep 2025</b><br>Next: schedule field demo`,
    elapsed: `Deal age <b>6 days</b> · Probability 15%`,
    steps: [
      { name: "Lead", time: "Jun 25", state: "current" },
      { name: "Demo Set", time: "—", state: "" },
      { name: "Quoted", time: "—", state: "" },
      { name: "Financing", time: "—", state: "" },
      { name: "Closing", time: "—", state: "" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["John Deere 8R 250 — 250 hp, PowerShift", "$145,000 ea"], ["Qty 2 · new", "$290,000"]],
    tradeIn: { unit: "2015 John Deere 8320R", allowance: "$78,000 (pending appraisal)" },
    activity: [["S. Meyer logged discovery call", "Jun 27 · 2:00 PM"], ["Inbound lead — spring expansion inquiry", "Jun 25 · 10:00 AM"]],
    cost: { rows: [["2× 8R 250", "$290,000"], ["Est. options", "$12,000"], ["Est. trade-in credit", "–$78,000"]], total: "$224,000 (est.)", note: "Financing TBD — likely John Deere Financial lease." },
    nextStep: { html: `<b>Lead.</b> Qualified and interested. Schedule an in-field demo of the 8R before quoting.` },
    meta: [["Customer", "Hendricks Family Farms"], ["Contact", "Marcus Hendricks"], ["Salesperson", "S. Meyer"], ["Source", "Inbound"], ["Est. close", "Sep 2025"], ["Probability", "15%"]]
  },
  "2044": {
    cat: "USED EQUIPMENT · S. MEYER",
    title: "John Deere S780 Combine — Used",
    sub: [["Customer", "Ostrander Farms"], ["Value", "$120K"], ["Stage", "Lead"], ["Rep", "S. Meyer"]],
    stamp: { cls: "scheduled", label: "Lead" },
    priority: `Est. close: <b>Aug 2025</b><br>Next: confirm budget`,
    elapsed: `Deal age <b>3 days</b> · Probability 15%`,
    steps: [
      { name: "Lead", time: "Jun 28", state: "current" },
      { name: "Demo Set", time: "—", state: "" },
      { name: "Quoted", time: "—", state: "" },
      { name: "Financing", time: "—", state: "" },
      { name: "Closing", time: "—", state: "" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["John Deere S780 (2019, 1,100 sep hrs)", "$120,000"]],
    tradeIn: null,
    activity: [["Sent unit spec sheet", "Jun 29 · 11:00 AM"], ["Walk-in — interested in used combine", "Jun 28 · 4:00 PM"]],
    cost: { rows: [["S780 combine (used)", "$120,000"], ["Est. recon / inspection", "$3,500"]], total: "$123,500 (est.)", note: "Cash or John Deere Financial." },
    nextStep: { html: `<b>Lead.</b> Confirm budget and financing appetite before scheduling a demo.` },
    meta: [["Customer", "Ostrander Farms"], ["Contact", "Greta Ostrander"], ["Salesperson", "S. Meyer"], ["Source", "Walk-in"], ["Est. close", "Aug 2025"], ["Probability", "15%"]]
  },
  "2033": {
    cat: "NEW EQUIPMENT · A. BOYD",
    title: "Case IH Steiger 470 — New 4WD Tractor",
    sub: [["Customer", "Red River Grain Co."], ["Value", "$215K"], ["Stage", "Demo Set"], ["Rep", "A. Boyd"]],
    stamp: { cls: "scheduled", label: "Demo Set" },
    priority: `Est. close: <b>Aug 2025</b><br>Demo set for Jul 8`,
    elapsed: `Deal age <b>12 days</b> · Probability 35%`,
    steps: [
      { name: "Lead", time: "Jun 19", state: "done" },
      { name: "Demo Set", time: "Jul 8", state: "current" },
      { name: "Quoted", time: "—", state: "" },
      { name: "Financing", time: "—", state: "" },
      { name: "Closing", time: "—", state: "" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["Case IH Steiger 470 — 470 hp, AFS Connect", "$215,000"]],
    tradeIn: { unit: "2013 Case IH Steiger 400", allowance: "$62,000 (appraised)" },
    activity: [["Demo scheduled for Jul 8", "Jun 30 · 9:00 AM"], ["Qualified lead — fleet replacement", "Jun 19 · 1:30 PM"]],
    cost: { rows: [["Steiger 470", "$215,000"], ["Trade-in credit", "–$62,000"]], total: "$153,000 (est.)", note: "CNH Industrial Capital lease quoted." },
    nextStep: { html: `<b>Demo set.</b> Field demo Jul 8. Prepare the quote package for the same week.` },
    meta: [["Customer", "Red River Grain Co."], ["Contact", "Roland Voss"], ["Salesperson", "A. Boyd"], ["Source", "Referral"], ["Est. close", "Aug 2025"], ["Probability", "35%"]]
  },
  "2038": {
    cat: "NEW EQUIPMENT · A. BOYD",
    title: "3× Toro Groundsmaster 4700 — Turf Fleet",
    sub: [["Customer", "Meadowlark Golf Club"], ["Value", "$80K"], ["Stage", "Demo Set"], ["Rep", "A. Boyd"]],
    stamp: { cls: "scheduled", label: "Demo Set" },
    priority: `Est. close: <b>Aug 2025</b><br>Demo set for Jul 10`,
    elapsed: `Deal age <b>9 days</b> · Probability 35%`,
    steps: [
      { name: "Lead", time: "Jun 22", state: "done" },
      { name: "Demo Set", time: "Jul 10", state: "current" },
      { name: "Quoted", time: "—", state: "" },
      { name: "Financing", time: "—", state: "" },
      { name: "Closing", time: "—", state: "" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["Toro Groundsmaster 4700-D", "$26,800 ea"], ["Qty 3 · new", "$80,400"]],
    tradeIn: { unit: "2× aging Groundsmaster 4500", allowance: "$14,000" },
    activity: [["On-site demo scheduled Jul 10", "Jul 1 · 8:30 AM"], ["Superintendent requested fleet quote", "Jun 22 · 3:00 PM"]],
    cost: { rows: [["3× Groundsmaster 4700", "$80,400"], ["Trade-in credit", "–$14,000"]], total: "$66,400 (est.)", note: "Municipal lease-to-own option." },
    nextStep: { html: `<b>Demo set.</b> Fleet demo Jul 10 at Meadowlark. Coordinate with the grounds crew.` },
    meta: [["Customer", "Meadowlark Golf Club"], ["Contact", "Petra Nowak"], ["Salesperson", "A. Boyd"], ["Source", "Existing customer"], ["Est. close", "Aug 2025"], ["Probability", "35%"]]
  },
  "2025": {
    cat: "NEW EQUIPMENT · S. MEYER",
    title: "2× Genie S-45 Boom Lifts — New",
    sub: [["Customer", "Dakota Steel Erectors"], ["Value", "$180K"], ["Stage", "Quoted"], ["Rep", "S. Meyer"]],
    stamp: { cls: "progress", label: "Quoted" },
    priority: `Est. close: <b>Jul 2025</b><br>Quote sent — awaiting decision`,
    elapsed: `Deal age <b>21 days</b> · Probability 55%`,
    steps: [
      { name: "Lead", time: "Jun 12", state: "done" },
      { name: "Demo Set", time: "Jun 20", state: "done" },
      { name: "Quoted", time: "Jun 28", state: "current" },
      { name: "Financing", time: "—", state: "" },
      { name: "Closing", time: "—", state: "" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["Genie S-45 telescopic boom lift", "$90,000 ea"], ["Qty 2 · new", "$180,000"]],
    tradeIn: null,
    activity: [["Quote Q-3391 sent", "Jun 28 · 4:20 PM"], ["Demo completed at yard", "Jun 20 · 10:00 AM"], ["Lead from rental conversion (RN-4463)", "Jun 12 · 9:00 AM"]],
    cost: { rows: [["2× Genie S-45", "$180,000"], ["Fleet discount (5%)", "–$9,000"]], total: "$171,000", note: "Quoted; financing via CIT." },
    nextStep: { html: `<b>Quoted.</b> Q-3391 is out. Follow up this week — converting from active rental RN-4463.` },
    meta: [["Customer", "Dakota Steel Erectors"], ["Contact", "Ivan Dahl"], ["Salesperson", "S. Meyer"], ["Source", "Rental conversion"], ["Est. close", "Jul 2025"], ["Probability", "55%"]]
  },
  "2029": {
    cat: "NEW EQUIPMENT · A. BOYD",
    title: "Bobcat T770 + E88 — Fleet Purchase",
    sub: [["Customer", "Sundquist Excavating"], ["Value", "$200K"], ["Stage", "Quoted"], ["Rep", "A. Boyd"]],
    stamp: { cls: "progress", label: "Quoted" },
    priority: `Est. close: <b>Jul 2025</b><br>Quote sent — negotiating`,
    elapsed: `Deal age <b>18 days</b> · Probability 55%`,
    steps: [
      { name: "Lead", time: "Jun 14", state: "done" },
      { name: "Demo Set", time: "Jun 21", state: "done" },
      { name: "Quoted", time: "Jun 30", state: "current" },
      { name: "Financing", time: "—", state: "" },
      { name: "Closing", time: "—", state: "" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["Bobcat T770 compact track loader", "$92,000"], ["Bobcat E88 excavator", "$108,000"]],
    tradeIn: { unit: "2017 Bobcat S650", allowance: "$28,000" },
    activity: [["Quote Q-3402 sent — negotiating price", "Jun 30 · 2:00 PM"], ["Demo + ride-along completed", "Jun 21 · 11:00 AM"]],
    cost: { rows: [["T770 + E88", "$200,000"], ["Trade-in credit", "–$28,000"]], total: "$172,000", note: "Bobcat financing — 0% for 36 mo promo." },
    nextStep: { html: `<b>Quoted.</b> Negotiating on price. Customer also runs rentals with us — strong relationship.` },
    meta: [["Customer", "Sundquist Excavating"], ["Contact", "Karl Sundquist"], ["Salesperson", "A. Boyd"], ["Source", "Existing customer"], ["Est. close", "Jul 2025"], ["Probability", "55%"]]
  },
  "2018": {
    cat: "NEW EQUIPMENT · S. MEYER",
    title: "New Holland T6.180 + Front Loader",
    sub: [["Customer", "Coteau Dairy Co-op"], ["Value", "$155K"], ["Stage", "Financing"], ["Rep", "S. Meyer"]],
    stamp: { cls: "waiting", label: "Financing" },
    priority: `Est. close: <b>Jul 2025</b><br>Credit app submitted`,
    elapsed: `Deal age <b>28 days</b> · Probability 75%`,
    steps: [
      { name: "Lead", time: "Jun 3", state: "done" },
      { name: "Demo Set", time: "Jun 12", state: "done" },
      { name: "Quoted", time: "Jun 24", state: "done" },
      { name: "Financing", time: "Jun 30", state: "current" },
      { name: "Closing", time: "—", state: "" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["New Holland T6.180 — 145 hp", "$138,000"], ["840TL front loader", "$17,000"]],
    tradeIn: { unit: "2016 New Holland T6.155", allowance: "$41,000" },
    activity: [["Credit application submitted to CNH Capital", "Jun 30 · 3:00 PM"], ["Quote accepted verbally", "Jun 26 · 1:00 PM"]],
    cost: { rows: [["T6.180 + loader", "$155,000"], ["Trade-in credit", "–$41,000"], ["Est. tax", "$7,980"]], total: "$121,980", note: "CNH Industrial Capital — 60 mo, pending approval." },
    nextStep: { html: `<b>Financing.</b> Credit app is in with CNH Capital. Expect a decision in 2–3 business days.` },
    meta: [["Customer", "Coteau Dairy Co-op"], ["Contact", "Lucille Coteau"], ["Salesperson", "S. Meyer"], ["Source", "Existing customer"], ["Est. close", "Jul 2025"], ["Probability", "75%"]]
  },
  "2021": {
    cat: "NEW EQUIPMENT · A. BOYD",
    title: "Kubota M7-172 — New Tractor",
    sub: [["Customer", "Thorson Dairy LLC"], ["Value", "$55K"], ["Stage", "Financing"], ["Rep", "A. Boyd"]],
    stamp: { cls: "waiting", label: "Financing" },
    priority: `Est. close: <b>Jul 2025</b><br>Awaiting credit approval`,
    elapsed: `Deal age <b>24 days</b> · Probability 75%`,
    steps: [
      { name: "Lead", time: "Jun 7", state: "done" },
      { name: "Demo Set", time: "Jun 15", state: "done" },
      { name: "Quoted", time: "Jun 23", state: "done" },
      { name: "Financing", time: "Jun 29", state: "current" },
      { name: "Closing", time: "—", state: "" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["Kubota M7-172 — 168 hp", "$55,000"]],
    tradeIn: null,
    activity: [["Kubota Credit application submitted", "Jun 29 · 10:00 AM"], ["Quote accepted", "Jun 25 · 2:30 PM"]],
    cost: { rows: [["Kubota M7-172", "$55,000"], ["Est. tax", "$3,850"]], total: "$58,850", note: "Kubota Credit — 0% for 48 mo, pending." },
    nextStep: { html: `<b>Financing.</b> Existing service customer (WO-88142). Credit app is in with Kubota Credit.` },
    meta: [["Customer", "Thorson Dairy LLC"], ["Contact", "Erik Thorson"], ["Salesperson", "A. Boyd"], ["Source", "Service customer"], ["Est. close", "Jul 2025"], ["Probability", "75%"]]
  },
  "2009": {
    cat: "NEW EQUIPMENT · A. BOYD",
    title: "Kubota SVL75 + Attachments",
    sub: [["Customer", "Prairie Rose Landscaping"], ["Value", "$72K"], ["Stage", "Closing"], ["Rep", "A. Boyd"]],
    stamp: { cls: "ready", label: "Closing" },
    priority: `Est. close: <b>Jul 3, 2025</b><br>Signing scheduled`,
    elapsed: `Deal age <b>31 days</b> · Probability 90%`,
    steps: [
      { name: "Lead", time: "May 31", state: "done" },
      { name: "Demo Set", time: "Jun 8", state: "done" },
      { name: "Quoted", time: "Jun 18", state: "done" },
      { name: "Financing", time: "Jun 29", state: "done" },
      { name: "Closing", time: "Jul 3", state: "current" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["Kubota SVL75-3 compact track loader", "$62,000"], ["Grapple + auger attachments", "$10,000"]],
    tradeIn: null,
    activity: [["Delivery / signing set for Jul 3", "Jun 30 · 11:00 AM"], ["Financing approved — Kubota Credit", "Jun 29 · 4:00 PM"], ["Quote accepted", "Jun 18 · 1:00 PM"]],
    cost: { rows: [["SVL75 + attachments", "$72,000"], ["Est. tax", "$5,040"]], total: "$77,040", note: "Kubota Credit approved — 0% for 48 mo." },
    nextStep: { html: `<b>Closing.</b> Financing approved. Signing and delivery scheduled Jul 3 — prep paperwork and PDI.` },
    meta: [["Customer", "Prairie Rose Landscaping"], ["Contact", "Nina Roswell"], ["Salesperson", "A. Boyd"], ["Source", "Rental conversion"], ["Est. close", "Jul 3, 2025"], ["Probability", "90%"]]
  },
  "2012": {
    cat: "NEW EQUIPMENT · S. MEYER",
    title: "John Deere 6M 130 — New Tractor",
    sub: [["Customer", "Halvorsen Farms"], ["Value", "$33K"], ["Stage", "Closing"], ["Rep", "S. Meyer"]],
    stamp: { cls: "ready", label: "Closing" },
    priority: `Est. close: <b>Jul 5, 2025</b><br>Delivery scheduled`,
    elapsed: `Deal age <b>26 days</b> · Probability 90%`,
    steps: [
      { name: "Lead", time: "Jun 5", state: "done" },
      { name: "Demo Set", time: "Jun 14", state: "done" },
      { name: "Quoted", time: "Jun 20", state: "done" },
      { name: "Financing", time: "Jun 28", state: "done" },
      { name: "Closing", time: "Jul 5", state: "current" },
      { name: "Won", time: "—", state: "" }
    ],
    summary: [["John Deere 6M 130 — 130 hp", "$33,000"]],
    tradeIn: null,
    activity: [["Delivery set Jul 5", "Jun 30 · 9:30 AM"], ["Financing approved — JD Financial", "Jun 28 · 3:00 PM"], ["Quote accepted", "Jun 20 · 10:00 AM"]],
    cost: { rows: [["JD 6M 130", "$33,000"], ["Est. tax", "$2,310"]], total: "$35,310", note: "John Deere Financial approved." },
    nextStep: { html: `<b>Closing.</b> Approved and scheduled for delivery Jul 5. Complete PDI. (Also servicing their 6M — WO-88231.)` },
    meta: [["Customer", "Halvorsen Farms"], ["Contact", "Pers Halvorsen"], ["Salesperson", "S. Meyer"], ["Source", "Existing customer"], ["Est. close", "Jul 5, 2025"], ["Probability", "90%"]]
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
  return rows.map(([text, time]) => `<div class="act-row">
    <div class="act-rail"><span class="act-node"></span></div>
    <div><div class="act-text">${text}</div><div class="act-time">${time}</div></div></div>`).join("");
}

function render(rec) {
  const c = rec.cost;
  const trade = rec.tradeIn
    ? kvLines([["Trade unit", rec.tradeIn.unit], ["Allowance", rec.tradeIn.allowance]])
    : `<div class="meta-row"><span class="k" style="font-style:italic;color:var(--slate-light)">No trade-in on this deal.</span></div>`;
  document.getElementById("content").innerHTML = `
    <div class="wo-head dept-sales">
      <div class="wo-head-l">
        <div class="wo-id-row"><span class="wo-id">${rec.d}</span><span class="wo-bay">${rec.cat}</span></div>
        <div class="wo-title">${rec.title}</div>
        <div class="wo-sub">${subHTML(rec.sub)}</div>
      </div>
      <div class="wo-head-r">
        <div class="stamp ${rec.stamp.cls}">${rec.stamp.label}</div>
        <div class="wo-priority">${rec.priority}</div>
      </div>
    </div>

    <div class="lifecycle">
      <div class="lifecycle-head"><div class="section-title">Pipeline Stage</div><div class="elapsed">${rec.elapsed}</div></div>
      <div class="stepper">${stepsHTML(rec.steps)}</div>
    </div>

    <div class="wo-body">
      <div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--clay)"></span>Deal Summary</div></div>
          <div class="meta-body">${kvLines(rec.summary)}</div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--steel-blue)"></span>Trade-In</div></div>
          <div class="meta-body">${trade}</div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--charcoal-3)"></span>Activity Log</div></div>
          <div class="activity">${activityHTML(rec.activity)}</div>
        </div>
      </div>

      <div>
        <div class="side-card">
          <div class="side-head">Deal Value</div>
          <div class="cost-body">
            ${c.rows.map(([l, v]) => `<div class="cost-row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join("")}
            <div class="cost-total"><span class="lbl">Net Deal</span><span class="val">${c.total}</span></div>
            ${c.note ? `<div class="cost-note">${c.note}</div>` : ""}
          </div>
        </div>
        <div class="side-card">
          <div class="side-head">Next Step</div>
          <div class="warr-body"><div class="warr-status${rec.nextStep.flagged ? " flagged" : ""}">${rec.nextStep.html}</div></div>
        </div>
        <div class="side-card">
          <div class="side-head">Customer &amp; Rep</div>
          <div class="meta-body">${kvLines(rec.meta)}</div>
        </div>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const id = new URLSearchParams(location.search).get("d");
  const rec = DEALS[id] || DEALS["2041"];
  rec.d = "D-" + (DEALS[id] ? id : "2041");
  render(rec);
  document.title = "Fieldbook — " + rec.d;
  document.getElementById("crumb-here").textContent = rec.d;
})();
