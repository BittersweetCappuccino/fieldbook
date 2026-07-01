/* ============================================================
   Part detail. ?p=<part#> selects the record. Reuses the work
   order detail shell (wo-head / cards / side rail) without a
   lifecycle. Where-used links to work orders; reorder links to
   the open PO (po.html) when the part is backordered / on order.
   ============================================================ */
const PARTS = {
  "RE-52341": {
    cat: "FILTERS · JOHN DEERE", oem: "John Deere", status: "low",
    desc: "Hydraulic Filter Kit",
    sub: [["Part #", "RE-52341", true], ["Bin", "A-12-3", true], ["On hand", "2"], ["Reorder pt", "4"]],
    stamp: { cls: "progress", label: "Low Stock" },
    priority: `On hand <b>2</b> · reorder point 4<br>Below reorder point`,
    stock: [["On hand", "2"], ["Reorder point", "4"], ["Reorder qty", "6"], ["Bin location", "A-12-3"], ["Unit cost", "$52.80"], ["List price", "$84.20"], ["Margin", "37%"]],
    whereUsed: [["88213", "WO-88213 — John Deere 8R 250, hydraulic"]],
    history: [["Issued 1 to WO-88213", "Jun 30"], ["Received 6 on PO-7710", "Jun 27"]],
    reorder: { html: `<b>Below reorder point.</b> 2 on hand vs. a reorder point of 4. Suggested reorder qty 6.`, action: { reorder: true } },
    suppliers: [["Primary", "John Deere · JDParts"], ["Lead time", "2–4 days"], ["Alternate", "—"]],
    meta: [["OEM", "John Deere"], ["Category", "Filters"], ["Supersedes", "RE-51000"], ["Fits", "8R / 7R series"], ["Unit weight", "1.2 kg"]]
  },
  "CI-11029": {
    cat: "DRIVELINE · CASE IH", oem: "Case IH", status: "low",
    desc: "PTO Shaft Coupler",
    sub: [["Part #", "CI-11029", true], ["Bin", "B-04-1", true], ["On hand", "1"], ["Reorder pt", "3"]],
    stamp: { cls: "progress", label: "Low Stock" },
    priority: `On hand <b>1</b> · reorder point 3<br>Below reorder point`,
    stock: [["On hand", "1"], ["Reorder point", "3"], ["Reorder qty", "4"], ["Bin location", "B-04-1"], ["Unit cost", "$61.20"], ["List price", "$98.40"], ["Margin", "38%"]],
    whereUsed: [],
    history: [["Received 3 on PO-7688", "Jun 12"], ["Issued 2 across spring services", "—"]],
    reorder: { html: `<b>Below reorder point.</b> Only 1 on hand vs. a reorder point of 3. Suggested reorder qty 4.`, action: { reorder: true } },
    suppliers: [["Primary", "Case IH · Parts Online"], ["Lead time", "3–5 days"], ["Alternate", "—"]],
    meta: [["OEM", "Case IH"], ["Category", "Driveline"], ["Supersedes", "—"], ["Fits", "Magnum / Puma"], ["Unit weight", "2.6 kg"]]
  },
  "KB-30871": {
    cat: "FUEL · KUBOTA", oem: "Kubota", status: "low",
    desc: "Fuel Injector, Diesel",
    sub: [["Part #", "KB-30871", true], ["Bin", "C-09-2", true], ["On hand", "3"], ["Reorder pt", "6"]],
    stamp: { cls: "progress", label: "Low Stock" },
    priority: `On hand <b>3</b> · reorder point 6<br>Below reorder point`,
    stock: [["On hand", "3"], ["Reorder point", "6"], ["Reorder qty", "6"], ["Bin location", "C-09-2"], ["Unit cost", "$142.00"], ["List price", "$219.50"], ["Margin", "35%"]],
    whereUsed: [],
    history: [["Issued 3 across Q2 diesel services", "—"], ["Received 6 on PO-7640", "May 20"]],
    reorder: { html: `<b>Below reorder point.</b> 3 on hand vs. a reorder point of 6 — high-demand item. Suggested reorder qty 6.`, action: { reorder: true } },
    suppliers: [["Primary", "Kubota · K-Parts"], ["Lead time", "4–7 days"], ["Alternate", "Bosch (cross-ref)"]],
    meta: [["OEM", "Kubota"], ["Category", "Fuel"], ["Supersedes", "KB-30500"], ["Fits", "M7 / M6 series"], ["Unit weight", "0.5 kg"]]
  },
  "JD-77410": {
    cat: "DRIVELINE · JOHN DEERE", oem: "John Deere", status: "backorder",
    desc: "PTO Shield Assembly",
    sub: [["Part #", "JD-77410", true], ["Bin", "A-15-4", true], ["On hand", "0"], ["Reorder pt", "1"]],
    stamp: { cls: "overdue", label: "Backordered" },
    priority: `On hand <b>0</b> · backordered<br>On PO-7729 · ETA Thu`,
    stock: [["On hand", "0"], ["Reorder point", "1"], ["Reorder qty", "1"], ["Bin location", "A-15-4"], ["Unit cost", "$74.00"], ["List price", "$118.00"], ["Margin", "37%"]],
    whereUsed: [["88213", "WO-88213 — blocks warranty op 8R-4471"]],
    history: [["Ordered on PO-7729 (OEM backorder)", "Jun 30"], ["Last received", "Apr 18"]],
    reorder: { flagged: true, html: `<b>Backordered by John Deere.</b> On PO-7729, ETA Thu Jul 3. This is blocking the warranty op on WO-88213.`, action: { po: "7729" } },
    suppliers: [["Primary", "John Deere · JDParts"], ["Lead time", "backordered"], ["Alternate", "none available"]],
    meta: [["OEM", "John Deere"], ["Category", "Driveline"], ["Supersedes", "—"], ["Fits", "8R series"], ["Unit weight", "3.1 kg"]]
  },
  "TY-90882": {
    cat: "BELTS · TORO", oem: "Toro", status: "backorder",
    desc: 'Deck Belt, 60"',
    sub: [["Part #", "TY-90882", true], ["Bin", "D-02-5", true], ["On hand", "0"], ["Reorder pt", "2"]],
    stamp: { cls: "overdue", label: "Backordered" },
    priority: `On hand <b>0</b> · backordered<br>On PO-7731 · ETA ~Jul 9`,
    stock: [["On hand", "0"], ["Reorder point", "2"], ["Reorder qty", "4"], ["Bin location", "D-02-5"], ["Unit cost", "$61.40"], ["List price", "$96.80"], ["Margin", "37%"]],
    whereUsed: [],
    history: [["Ordered on PO-7731", "Jul 1"], ["Sold out of stock", "Jun 26"]],
    reorder: { flagged: true, html: `<b>Backordered.</b> On PO-7731 to Toro, ETA ~Jul 9. Common wear item — consider raising the reorder point.`, action: { po: "7731" } },
    suppliers: [["Primary", "Toro · myTurf"], ["Lead time", "5–8 days"], ["Alternate", "Gates (cross-ref)"]],
    meta: [["OEM", "Toro"], ["Category", "Belts"], ["Supersedes", "TY-90410"], ["Fits", "Groundsmaster 4000"], ["Unit weight", "0.9 kg"]]
  },
  "CI-88231": {
    cat: "HYDRAULICS · CASE IH", oem: "Case IH", status: "onorder",
    desc: "Hydraulic Pump Drive Coupler",
    sub: [["Part #", "CI-88231", true], ["Bin", "B-06-3", true], ["On hand", "0"], ["Reorder pt", "1"]],
    stamp: { cls: "scheduled", label: "On Order" },
    priority: `On hand <b>0</b> · on order<br>PO-7723 shipped · ETA Thu`,
    stock: [["On hand", "0"], ["Reorder point", "1"], ["Reorder qty", "1"], ["Bin location", "B-06-3"], ["Unit cost", "$28.90"], ["List price", "$45.50"], ["Margin", "36%"]],
    whereUsed: [["88190", "WO-88190 — held on this part"]],
    history: [["PO-7723 shipped by Case IH", "Jun 30"], ["Ordered on PO-7723", "Jun 29"]],
    reorder: { html: `<b>On order.</b> PO-7723 shipped, ETA Thu Jul 3 via FedEx Freight. Currently holding WO-88190.`, action: { po: "7723" } },
    suppliers: [["Primary", "Case IH · Parts Online"], ["Lead time", "in transit"], ["Alternate", "—"]],
    meta: [["OEM", "Case IH"], ["Category", "Hydraulics"], ["Supersedes", "—"], ["Fits", "Magnum 340"], ["Unit weight", "1.4 kg"]]
  },
  "NH-44120": {
    cat: "ELECTRICAL · NEW HOLLAND", oem: "New Holland", status: "instock",
    desc: "Starter Relay",
    sub: [["Part #", "NH-44120", true], ["Bin", "C-11-1", true], ["On hand", "5"], ["Reorder pt", "3"]],
    stamp: { cls: "ready", label: "In Stock" },
    priority: `On hand <b>5</b> · reorder point 3<br>Stocked`,
    stock: [["On hand", "5"], ["Reorder point", "3"], ["Reorder qty", "4"], ["Bin location", "C-11-1"], ["Unit cost", "$40.10"], ["List price", "$62.40"], ["Margin", "36%"]],
    whereUsed: [["88221", "WO-88221 — New Holland T6, electrical"]],
    history: [["Issued 1 to WO-88221", "Jul 1"], ["Received 4 on PO-7695", "Jun 18"]],
    reorder: { html: `<b>In stock.</b> 5 on hand, above the reorder point of 3. No action needed.`, action: { reorder: true } },
    suppliers: [["Primary", "New Holland · Parts"], ["Lead time", "2–4 days"], ["Alternate", "—"]],
    meta: [["OEM", "New Holland"], ["Category", "Electrical"], ["Supersedes", "—"], ["Fits", "T6 / T7 series"], ["Unit weight", "0.3 kg"]]
  }
};

/* ---------- render helpers ---------- */
function subHTML(sub) {
  return sub.map(([k, v, mono]) => `<span>${k}: <b${mono ? ' class="mono"' : ''}>${v}</b></span>`).join("");
}
function kvLines(rows) {
  return rows.map(([k, v]) => `<div class="meta-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
}
function whereUsedHTML(rows) {
  if (!rows.length) return `<div class="meta-body"><div class="meta-row"><span class="k" style="font-style:italic;color:var(--slate-light)">Not on any open work order.</span></div></div>`;
  return `<div class="activity">` + rows.map(([wo, label]) =>
    `<div class="act-row"><div class="act-rail"><span class="act-node parts"></span></div>
      <div><div class="act-text"><a class="po-link" href="work-order.html?wo=${wo}">${label}</a></div></div></div>`).join("") + `</div>`;
}
function historyHTML(rows) {
  return `<div class="activity">` + rows.map(([text, time]) =>
    `<div class="act-row"><div class="act-rail"><span class="act-node"></span></div>
      <div><div class="act-text">${text}</div><div class="act-time">${time}</div></div></div>`).join("") + `</div>`;
}
function reorderAction(a) {
  if (a.po) return `<a class="po-link" href="po.html?po=${a.po}">Track PO-${a.po} →</a>`;
  return `<span class="reorder-btn">Reorder</span>`;
}

function render(rec) {
  document.getElementById("content").innerHTML = `
    <div class="wo-head dept-parts">
      <div class="wo-head-l">
        <div class="wo-id-row"><span class="wo-id">${rec.num}</span><span class="wo-bay">${rec.cat}</span></div>
        <div class="wo-title">${rec.desc}</div>
        <div class="wo-sub">${subHTML(rec.sub)}</div>
      </div>
      <div class="wo-head-r">
        <div class="stamp ${rec.stamp.cls}">${rec.stamp.label}</div>
        <div class="wo-priority">${rec.priority}</div>
      </div>
    </div>

    <div class="wo-body" style="margin-top:20px;">
      <div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--field-green)"></span>Stock &amp; Pricing</div></div>
          <div class="meta-body">${kvLines(rec.stock)}</div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>Where Used</div></div>
          ${whereUsedHTML(rec.whereUsed)}
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--charcoal-3)"></span>Order History</div></div>
          ${historyHTML(rec.history)}
        </div>
      </div>

      <div>
        <div class="side-card">
          <div class="side-head">Reorder</div>
          <div class="warr-body">
            <div class="warr-status${rec.reorder.flagged ? " flagged" : ""}">${rec.reorder.html}</div>
            <div style="margin-top:12px;">${reorderAction(rec.reorder.action)}</div>
          </div>
        </div>
        <div class="side-card">
          <div class="side-head">Suppliers</div>
          <div class="meta-body">${kvLines(rec.suppliers)}</div>
        </div>
        <div class="side-card">
          <div class="side-head">Part Info</div>
          <div class="meta-body">${kvLines(rec.meta)}</div>
        </div>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const id = new URLSearchParams(location.search).get("p");
  const rec = PARTS[id] || PARTS["RE-52341"];
  rec.num = PARTS[id] ? id : "RE-52341";
  render(rec);
  document.title = "Fieldbook — " + rec.num;
  document.getElementById("crumb-here").textContent = rec.num;
})();
