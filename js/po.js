/* ============================================================
   Purchase order detail. ?po=<id> selects the record. Reuses the
   work order detail shell with a PO lifecycle stepper
   (Draft -> Submitted -> Acknowledged -> Shipped -> Received ->
   Closed). Order lines cross-link to parts; linked jobs to WOs.
   ============================================================ */
const POS = {
  "7723": {
    supplier: "Case IH", cat: "PURCHASE ORDER · CASE IH", title: "Case IH — Parts Order",
    sub: [["Supplier", "Case IH"], ["Ordered", "Jun 29"], ["For", "WO-88190"], ["ETA", "Jul 3"]],
    stamp: { cls: "scheduled", label: "Shipped" },
    priority: `ETA: <b>Thu Jul 3</b><br>In transit — FedEx Freight`,
    elapsed: `Ordered Jun 29 · <b>2 days</b> in transit`,
    steps: [
      { name: "Draft", time: "Jun 29", state: "done" },
      { name: "Submitted", time: "Jun 29 · 3:15p", state: "done" },
      { name: "Acknowledged", time: "Jun 29 · 5:40p", state: "done" },
      { name: "Shipped", time: "Jun 30 · 2:10p", state: "current" },
      { name: "Received", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    lines: [["CI-88231", "Hydraulic pump drive coupler", "1", "$28.90", "$28.90"]],
    shipment: [["Carrier", "FedEx Freight"], ["Tracking", "7712 8841 0093"], ["ETA", "Thu Jul 3"], ["Ship to", "Prairie Line — Fargo"]],
    activity: [
      ["Shipped by Case IH — tracking assigned", "Jun 30 · 2:10 PM"],
      ["Order acknowledged by Case IH", "Jun 29 · 5:40 PM"],
      ["PO submitted via Parts Online", "Jun 29 · 3:15 PM"]
    ],
    cost: { rows: [["Subtotal", "$28.90"], ["Freight", "$22.00"], ["Tax", "$4.75"]], total: "$55.65" },
    statusNote: { html: `<b>Shipped.</b> ETA Thu Jul 3 via FedEx Freight. Holding WO-88190 until receipt.` },
    meta: [["Supplier", "Case IH"], ["Account", "PL-Fargo 4471"], ["Terms", "Net 30"], ["Order date", "Jun 29"], ["Linked job", `<a class="po-link" href="work-order.html?wo=88190">WO-88190</a>`]]
  },
  "7729": {
    supplier: "John Deere", cat: "PURCHASE ORDER · JOHN DEERE", title: "John Deere — Parts Order",
    sub: [["Supplier", "John Deere"], ["Ordered", "Jun 30"], ["For", "WO-88213"], ["ETA", "Jul 3"]],
    stamp: { cls: "waiting", label: "Backorder" },
    priority: `ETA: <b>Thu Jul 3</b><br>OEM backorder — allocated`,
    elapsed: `Ordered Jun 30 · awaiting fulfillment`,
    steps: [
      { name: "Draft", time: "Jun 30", state: "done" },
      { name: "Submitted", time: "Jun 30 · 3:48p", state: "done" },
      { name: "Acknowledged", time: "Jun 30 · 6:00p", state: "current" },
      { name: "Shipped", time: "—", state: "" },
      { name: "Received", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    lines: [["JD-77410", "PTO shield assembly", "1", "$74.00", "$74.00"]],
    shipment: [["Carrier", "—"], ["Tracking", "pending"], ["ETA", "Thu Jul 3 (allocated)"], ["Ship to", "Prairie Line — Fargo"]],
    activity: [
      ["John Deere confirmed backorder — allocated for Thu", "Jul 1 · 9:15 AM"],
      ["Order acknowledged", "Jun 30 · 6:00 PM"],
      ["PO submitted via JDParts", "Jun 30 · 3:48 PM"]
    ],
    cost: { rows: [["Subtotal", "$74.00"], ["Freight", "$18.00"], ["Tax", "$6.90"]], total: "$98.90" },
    statusNote: { flagged: true, html: `<b>Backordered by John Deere.</b> Allocated for Thu Jul 3, no tracking yet. Blocks the warranty op on WO-88213.` },
    meta: [["Supplier", "John Deere"], ["Account", "PL-Fargo 2210"], ["Terms", "Net 30"], ["Order date", "Jun 30"], ["Linked job", `<a class="po-link" href="work-order.html?wo=88213">WO-88213</a>`]]
  },
  "7731": {
    supplier: "Toro", cat: "PURCHASE ORDER · TORO", title: "Toro — Parts Order",
    sub: [["Supplier", "Toro"], ["Ordered", "Jul 1"], ["For", "Stock"], ["ETA", "~Jul 9"]],
    stamp: { cls: "progress", label: "Submitted" },
    priority: `ETA: <b>~Jul 9</b><br>Awaiting OEM acknowledgement`,
    elapsed: `Ordered Jul 1 · submitted today`,
    steps: [
      { name: "Draft", time: "Jul 1", state: "done" },
      { name: "Submitted", time: "Jul 1 · 11:20a", state: "current" },
      { name: "Acknowledged", time: "—", state: "" },
      { name: "Shipped", time: "—", state: "" },
      { name: "Received", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    lines: [["TY-90882", 'Deck belt, 60"', "2", "$61.40", "$122.80"]],
    shipment: [["Carrier", "—"], ["Tracking", "—"], ["ETA", "~Jul 9 (est)"], ["Ship to", "Prairie Line — Fargo"]],
    activity: [
      ["PO submitted via myTurf", "Jul 1 · 11:20 AM"],
      ["Reorder triggered — below reorder point", "Jul 1 · 11:00 AM"]
    ],
    cost: { rows: [["Subtotal", "$122.80"], ["Freight", "$15.00"], ["Tax", "$10.45"]], total: "$148.25" },
    statusNote: { html: `<b>Submitted.</b> Awaiting Toro acknowledgement. Restock order — no job blocked.` },
    meta: [["Supplier", "Toro"], ["Account", "PL-Fargo 8830"], ["Terms", "Net 30"], ["Order date", "Jul 1"], ["Linked job", "— (stock)"]]
  },
  "7710": {
    supplier: "John Deere", cat: "PURCHASE ORDER · JOHN DEERE", title: "John Deere — Parts Order",
    sub: [["Supplier", "John Deere"], ["Ordered", "Jun 24"], ["For", "Stock"], ["Received", "Jun 27"]],
    stamp: { cls: "ready", label: "Received" },
    priority: `<b>Received Jun 27</b><br>Stock replenished`,
    elapsed: `Ordered Jun 24 · received in 3 days`,
    steps: [
      { name: "Draft", time: "Jun 24", state: "done" },
      { name: "Submitted", time: "Jun 24 · 9:30a", state: "done" },
      { name: "Acknowledged", time: "Jun 24 · 2:00p", state: "done" },
      { name: "Shipped", time: "Jun 25 · 1:00p", state: "done" },
      { name: "Received", time: "Jun 27 · 10:05a", state: "current" },
      { name: "Closed", time: "—", state: "" }
    ],
    lines: [["RE-52341", "Hydraulic filter kit", "6", "$52.80", "$316.80"]],
    shipment: [["Carrier", "UPS Ground"], ["Tracking", "1Z 998 W41 — delivered"], ["ETA", "Delivered Jun 27"], ["Ship to", "Prairie Line — Fargo"]],
    activity: [
      ["Received 6 into bin A-12-3", "Jun 27 · 10:05 AM"],
      ["Shipped by John Deere", "Jun 25 · 1:00 PM"],
      ["PO submitted via JDParts", "Jun 24 · 9:30 AM"]
    ],
    cost: { rows: [["Subtotal", "$316.80"], ["Freight", "$24.00"], ["Tax", "$27.30"]], total: "$368.10" },
    statusNote: { html: `<b>Received.</b> 6 units stocked to A-12-3. Ready to close.` },
    meta: [["Supplier", "John Deere"], ["Account", "PL-Fargo 2210"], ["Terms", "Net 30"], ["Order date", "Jun 24"], ["Linked job", "— (stock)"]]
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
function linesHTML(lines) {
  return lines.map(l => `<tr>
    <td><a class="code" href="part.html?p=${l[0]}">${l[0]}</a></td>
    <td>${l[1]}</td><td class="num">${l[2]}</td><td class="num">${l[3]}</td><td class="num">${l[4]}</td></tr>`).join("");
}
function activityHTML(rows) {
  return rows.map(([text, time]) => `<div class="act-row">
    <div class="act-rail"><span class="act-node"></span></div>
    <div><div class="act-text">${text}</div><div class="act-time">${time}</div></div></div>`).join("");
}

function render(rec) {
  const c = rec.cost;
  document.getElementById("content").innerHTML = `
    <div class="wo-head dept-parts">
      <div class="wo-head-l">
        <div class="wo-id-row"><span class="wo-id">${rec.po}</span><span class="wo-bay">${rec.cat}</span></div>
        <div class="wo-title">${rec.title}</div>
        <div class="wo-sub">${subHTML(rec.sub)}</div>
      </div>
      <div class="wo-head-r">
        <div class="stamp ${rec.stamp.cls}">${rec.stamp.label}</div>
        <div class="wo-priority">${rec.priority}</div>
      </div>
    </div>

    <div class="lifecycle">
      <div class="lifecycle-head"><div class="section-title">Order Lifecycle</div><div class="elapsed">${rec.elapsed}</div></div>
      <div class="stepper">${stepsHTML(rec.steps)}</div>
    </div>

    <div class="wo-body">
      <div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--field-green)"></span>Order Lines</div></div>
          <div class="table-wrap"><table class="ltable">
            <thead><tr><th>Part #</th><th>Description</th><th class="num">Qty</th><th class="num">Unit</th><th class="num">Ext.</th></tr></thead>
            <tbody>${linesHTML(rec.lines)}</tbody>
          </table></div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--steel-blue)"></span>Shipment &amp; Tracking</div></div>
          <div class="meta-body">${kvLines(rec.shipment)}</div>
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
            <div class="cost-total"><span class="lbl">Total</span><span class="val">${c.total}</span></div>
          </div>
        </div>
        <div class="side-card">
          <div class="side-head">Status</div>
          <div class="warr-body"><div class="warr-status${rec.statusNote.flagged ? " flagged" : ""}">${rec.statusNote.html}</div></div>
        </div>
        <div class="side-card">
          <div class="side-head">Supplier &amp; Terms</div>
          <div class="meta-body">${kvLines(rec.meta)}</div>
        </div>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const id = new URLSearchParams(location.search).get("po");
  const rec = POS[id] || POS["7723"];
  rec.po = "PO-" + (POS[id] ? id : "7723");
  render(rec);
  document.title = "Fieldbook — " + rec.po;
  document.getElementById("crumb-here").textContent = rec.po;
})();
