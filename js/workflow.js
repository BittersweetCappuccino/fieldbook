/* ============================================================
   Workflow actions (Section B). One data-driven engine shared by the
   lifecycle / contextual Actions-menu items. The page it runs on picks
   the workflow (its filename maps to a WORKFLOWS key); ?type=&id= carry
   the record. Three layouts: a titled form, a QC checklist, and an
   invoice preview. Cancel/primary return to the record's detail page
   (resolved via window.FB_ENTITY_META). Concept screens — no backend.
   ============================================================ */
const WF_TECHS = ["Unassigned", "R. Alvarez", "J. Okafor", "M. Lindqvist", "T. Nguyen", "D. Berg"];
const WF_BAYS = ["Unassigned", "Bay 1", "Bay 2", "Bay 3", "Bay 4", "Bay 5", "Bay 6", "Bay 7"];
const WF_OEMS = ["John Deere", "Case IH", "Kubota", "Toro", "New Holland", "Bobcat"];
const WF_SWATCH = { amber: "var(--amber)", green: "var(--field-green)", steel: "var(--steel-blue)", clay: "var(--clay)" };

const WORKFLOWS = {
  "qc": {
    type: "work-order", title: "Mark Ready for QC", heading: "Quality control checklist", swatch: "amber", kind: "checklist",
    items: [
      { label: "Road test completed", done: true },
      { label: "Fluid levels topped off", done: true },
      { label: "Torque specs verified", done: false },
      { label: "Diagnostic trouble codes cleared", done: false },
      { label: "Work area cleaned & tools accounted for", done: false },
      { label: "Customer authorization on file", done: true }
    ],
    note: true, submit: "Mark ready for QC"
  },
  "parts-eta": {
    type: "work-order", title: "Update Parts ETA", heading: "Backordered parts", swatch: "green", kind: "form",
    fields: [
      { label: "Backordered part", type: "text", val: "RE-52341 — Hydraulic pump" },
      { label: "Supplier", type: "select", options: WF_OEMS, val: "John Deere" },
      { label: "Previous ETA", type: "text", val: "Jul 2", ro: true },
      { label: "New expected arrival", type: "date" },
      { label: "Confidence", type: "select", options: ["Confirmed", "Estimated", "At risk"] },
      { label: "Update for customer", type: "textarea", wide: true, ph: "Optional note added to the work order…" }
    ],
    submit: "Update ETA"
  },
  "assign": {
    type: "work-order", title: "Assign Technician", heading: "Technician assignment", swatch: "amber", kind: "form",
    fields: [
      { label: "Technician", type: "select", options: WF_TECHS },
      { label: "Bay", type: "select", options: WF_BAYS },
      { label: "Priority", type: "select", options: ["Normal", "High", "Rush"] },
      { label: "Scheduled start", type: "date" },
      { label: "Instructions for tech", type: "textarea", wide: true, ph: "Notes / special instructions…" }
    ],
    submit: "Assign technician"
  },
  "invoice": {
    type: "work-order", title: "Generate Invoice", kind: "invoice", submit: "Generate invoice"
  },
  "claim-submit": {
    type: "warranty", title: "Submit Claim to Manufacturer", heading: "Submit to manufacturer", swatch: "amber", kind: "form",
    fields: [
      { label: "Claim #", type: "text", val: "WC-2285", ro: true },
      { label: "Manufacturer", type: "select", options: WF_OEMS, val: "John Deere" },
      { label: "Claim type", type: "select", options: ["Parts & Labor", "Parts only", "Goodwill", "Recall"] },
      { label: "Claimed amount", type: "text", val: "$1,879.50", ro: true },
      { label: "Submission method", type: "select", options: ["Dealer portal (OAuth)", "EDI", "Manual entry"] },
      { label: "Notes to manufacturer", type: "textarea", wide: true, ph: "Supporting detail for the claim…" }
    ],
    submit: "Submit claim"
  },
  "checkin": {
    type: "rental", title: "Check In Unit", heading: "Return inspection", swatch: "green", kind: "form",
    fields: [
      { label: "Return date", type: "date" },
      { label: "Meter / hours in", type: "number", ph: "e.g. 1240" },
      { label: "Fuel level", type: "select", options: ["Full", "3/4", "1/2", "1/4", "Empty"] },
      { label: "Condition", type: "select", options: ["Good — no damage", "Minor wear", "Damage — see notes"] },
      { label: "Damage / cleaning charges ($)", type: "number", ph: "0" },
      { label: "Inspection notes", type: "textarea", wide: true, ph: "Notes from the return inspection…" }
    ],
    submit: "Check in unit"
  },
  "extend": {
    type: "rental", title: "Extend Rental", heading: "Extension", swatch: "amber", kind: "form",
    fields: [
      { label: "Current due back", type: "text", val: "Jul 5", ro: true },
      { label: "New due back", type: "date" },
      { label: "Additional term", type: "select", options: ["1 week", "2 weeks", "1 month", "Custom"] },
      { label: "Rate basis", type: "select", options: ["Weekly", "Daily", "Monthly"] },
      { label: "Added charges ($)", type: "number", ph: "0" },
      { label: "Note", type: "textarea", wide: true, ph: "Optional note…" }
    ],
    submit: "Extend rental"
  },
  "receive": {
    type: "po", title: "Receive Items", heading: "Receive against PO", swatch: "green", kind: "form",
    fields: [
      { label: "PO line", type: "select", options: ["RE-52341 — Hydraulic pump (4 ordered)", "AT-19702 — Hydraulic filter (8 ordered)"] },
      { label: "Quantity received", type: "number", ph: "0" },
      { label: "Condition", type: "select", options: ["Good", "Damaged", "Partial / short"] },
      { label: "Bin location", type: "text", val: "A-14-3" },
      { label: "Receiving note", type: "textarea", wide: true, ph: "Packing slip #, discrepancies…" }
    ],
    submit: "Receive items"
  },
  "adjust-stock": {
    type: "part", title: "Adjust Stock", heading: "Stock adjustment", swatch: "green", kind: "form",
    fields: [
      { label: "Current on-hand", type: "text", val: "2", ro: true },
      { label: "New on-hand count", type: "number", ph: "0" },
      { label: "Reason", type: "select", options: ["Cycle count", "Damage / shrinkage", "Found stock", "Correction"] },
      { label: "Bin location", type: "text", val: "A-14-3" },
      { label: "Note", type: "textarea", wide: true, ph: "Optional note…" }
    ],
    submit: "Adjust stock"
  },
  "transfer-stock": {
    type: "part", title: "Transfer Stock", heading: "Stock transfer", swatch: "steel", kind: "form",
    fields: [
      { label: "From location", type: "select", options: ["Fargo — Main", "Bismarck", "Grand Forks", "Minot"], val: "Fargo — Main" },
      { label: "To location", type: "select", options: ["Bismarck", "Grand Forks", "Minot", "Fargo — Main"] },
      { label: "Quantity", type: "number", ph: "0" },
      { label: "Ship method", type: "select", options: ["Inter-store transfer", "Customer pickup", "Courier"] },
      { label: "Note", type: "textarea", wide: true, ph: "Optional note…" }
    ],
    submit: "Transfer stock"
  }
};

/* ---------- field + layout renderers ---------- */
function wField(f) {
  const val = f.val != null ? f.val : "";
  let input;
  if (f.type === "select") {
    input = `<select class="form-select"${f.ro ? " disabled" : ""}>${f.options.map((o, i) => `<option${(f.val != null ? o === f.val : i === 0) ? " selected" : ""}>${o}</option>`).join("")}</select>`;
  } else if (f.type === "textarea") {
    input = `<textarea class="form-textarea" placeholder="${f.ph || ""}">${val}</textarea>`;
  } else {
    input = `<input class="form-input" type="${f.type}" placeholder="${f.ph || ""}" value="${val}"${f.ro ? " readonly" : ""}>`;
  }
  return `<div class="form-field${f.wide ? " wide" : ""}"><label class="form-label">${f.label}</label>${input}</div>`;
}

function formBody(cfg) {
  if (cfg.kind === "checklist") {
    return `<div class="form-grid" style="grid-template-columns:1fr;">
      ${cfg.items.map(it => `<label class="form-check" style="padding:6px 0;"><input type="checkbox"${it.done ? " checked" : ""}> ${it.label}</label>`).join("")}
      ${cfg.note ? `<div class="form-field wide" style="margin-top:8px;"><label class="form-label">Note (optional)</label><textarea class="form-textarea" placeholder="Add a note to the activity log…"></textarea></div>` : ""}
    </div>`;
  }
  return `<div class="form-grid">${cfg.fields.map(wField).join("")}</div>`;
}

function invoiceBody(id) {
  const num = id || "88213";
  const woRef = "WO-" + num;
  const money = "text-align:right;";
  const row = (l, v, bold) => `<div style="display:flex;justify-content:space-between;gap:24px;${bold ? "font-weight:700;border-top:1px solid var(--paper-line);padding-top:8px;margin-top:2px;" : ""}"><span${bold ? "" : ' style="color:var(--slate);"'}>${l}</span><span class="mono">${v}</span></div>`;
  return `<div style="padding:18px;">
    <div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:18px;">
      <div>
        <div class="form-label">Bill to</div>
        <div style="font-weight:600;">Hendricks Family Farms</div>
        <div style="color:var(--slate);font-size:13px;">4821 County Rd 12, Kindred, ND</div>
      </div>
      <div style="text-align:right;">
        <div class="form-label">Invoice</div>
        <div style="font-weight:600;">INV-${num}</div>
        <div style="color:var(--slate);font-size:13px;">Work order ${woRef}</div>
      </div>
    </div>
    <div class="table-wrap"><table class="ltable">
      <thead><tr><th>Line</th><th>Description</th><th class="num">Qty / Hrs</th><th class="num">Amount</th></tr></thead>
      <tbody>
        <tr><td>Labor</td><td>Diagnose hydraulic fault</td><td class="num">1.5 h</td><td class="num">$217.50</td></tr>
        <tr><td>Labor</td><td>Replace hydraulic pump</td><td class="num">3.0 h</td><td class="num">$435.00</td></tr>
        <tr><td>Parts</td><td>RE-52341 — Hydraulic pump</td><td class="num">1</td><td class="num">$1,149.00</td></tr>
        <tr><td>Parts</td><td>AT-19702 — Hydraulic filter</td><td class="num">2</td><td class="num">$78.00</td></tr>
      </tbody>
    </table></div>
    <div style="margin-top:16px;margin-left:auto;max-width:280px;display:flex;flex-direction:column;gap:7px;" class="mono">
      ${row("Labor", "$652.50")}
      ${row("Parts", "$1,227.00")}
      ${row("Subtotal", "$1,879.50")}
      ${row("Tax (7%)", "$131.57")}
      ${row("Total", "$2,011.07", true)}
    </div>
  </div>`;
}

/* ---------- boot ---------- */
(function () {
  const params = new URLSearchParams(location.search);
  const META = window.FB_ENTITY_META || {};
  const action = location.pathname.split("/").pop().replace(/\.html$/, "");
  const cfg = WORKFLOWS[action] || WORKFLOWS["assign"];
  const type = META[params.get("type")] ? params.get("type") : cfg.type;
  const meta = META[type] || META["work-order"];
  const id = params.get("id") || "";
  const back = meta.page + "?" + meta.param + "=" + encodeURIComponent(id);

  const body = cfg.kind === "invoice" ? invoiceBody(id) : formBody(cfg);
  const swatch = WF_SWATCH[cfg.swatch] || "var(--amber)";
  const head = cfg.kind === "invoice"
    ? `<div class="card-head"><div class="card-title"><span class="swatch" style="background:${swatch}"></span>Invoice preview</div><div class="card-meta">Draft · WO-${id || "88213"}</div></div>`
    : `<div class="card-head"><div class="card-title"><span class="swatch" style="background:${swatch}"></span>${cfg.heading}</div></div>`;

  document.getElementById("content").innerHTML = `
    <div class="page-intro">
      <div>
        <h1>${cfg.title}</h1>
        <div class="sub">${meta.label}${id ? " · " + id : ""}</div>
      </div>
    </div>
    <div class="card" style="max-width:760px;">
      ${head}
      ${body}
      <div class="form-actions" style="padding:0 18px 18px;">
        <a class="btn-lg" href="${back}">Cancel</a>
        <a class="btn-lg primary" href="${back}">${cfg.submit}</a>
      </div>
    </div>`;

  document.title = "Fieldbook — " + cfg.title;
  document.getElementById("crumb-here").textContent = cfg.title;
  const dept = document.getElementById("crumb-dept");
  dept.textContent = meta.dept;
  dept.href = meta.deptHref;
  const nav = document.querySelector('.sidebar a.nav-item[href="' + meta.deptHref + '"]');
  if (nav) nav.classList.add("active");
})();
