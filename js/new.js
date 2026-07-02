/* ============================================================
   New-record forms. One data-driven screen; ?type=<t> selects the
   form (work-order, rental, po, deal, customer, connection). The
   Reorder action deep-links here as ?type=po&part=…&qty=… with the
   part prefilled. Concept forms — Save/Cancel return to the board.
   ============================================================ */
const CUSTOMERS = ["Hendricks Family Farms", "Red River Grain Co.", "Meadowlark Golf Club", "Thorson Dairy LLC", "Coteau Dairy Co-op", "Sundquist Excavating", "Halvorsen Farms", "Ostrander Farms", "Dakota Steel Erectors", "Prairie Rose Landscaping"];
const OEMS = ["John Deere", "Case IH", "Kubota", "Toro", "New Holland", "Bobcat"];
const TECHS = ["Unassigned", "R. Alvarez", "J. Okafor", "M. Lindqvist", "T. Nguyen", "D. Berg"];

const FORMS = {
  "work-order": {
    title: "New Work Order", dept: "Service", deptHref: "service.html", submit: "Create Work Order",
    fields: [
      { label: "Customer", type: "select", options: CUSTOMERS },
      { label: "Equipment / unit", type: "text", ph: "e.g. John Deere 8R 250 — Hendricks Farm #4" },
      { label: "Bay", type: "select", options: ["Unassigned", "Bay 1", "Bay 2", "Bay 3", "Bay 4", "Bay 5", "Bay 6", "Bay 7"] },
      { label: "Assigned technician", type: "select", options: TECHS },
      { label: "Promised date", type: "date" },
      { label: "Pay type", type: "select", options: ["Customer-pay", "Warranty", "Customer + Warranty"] },
      { label: "Complaint", type: "textarea", wide: true, ph: "What the customer reports…" }
    ]
  },
  "rental": {
    title: "New Rental", dept: "Rentals", deptHref: "rentals.html", submit: "Create Rental",
    fields: [
      { label: "Customer", type: "select", options: CUSTOMERS },
      { label: "Unit", type: "select", options: ["Bobcat E35 Mini Excavator", "Toro Dingo TX1000", "JLG 1930ES Scissor Lift", "Kubota SVL65 CTL"] },
      { label: "Checkout date", type: "date" },
      { label: "Due back", type: "date" },
      { label: "Rate basis", type: "select", options: ["Weekly", "Daily", "Monthly"] },
      { label: "Delivery", type: "select", options: ["Dealer haul-out", "Customer pickup"] },
      { label: "Job site", type: "text", wide: true, ph: "Delivery address / site" },
      { label: "Deposit ($)", type: "number", ph: "0" }
    ]
  },
  "po": {
    title: "New Purchase Order", dept: "Parts", deptHref: "parts.html", submit: "Submit Purchase Order",
    fields: [
      { label: "Supplier / OEM", type: "select", options: OEMS },
      { label: "Ship to", type: "text", value: "Prairie Line — Fargo" },
      { label: "Part #", type: "text", ph: "e.g. RE-52341", key: "part" },
      { label: "Quantity", type: "number", ph: "1", key: "qty" },
      { label: "Linked work order (optional)", type: "text", ph: "e.g. WO-88213" },
      { label: "Notes", type: "textarea", wide: true, ph: "Notes for this order…" }
    ]
  },
  "deal": {
    title: "New Deal", dept: "Sales", deptHref: "sales.html", submit: "Create Deal",
    fields: [
      { label: "Customer", type: "select", options: CUSTOMERS },
      { label: "Equipment", type: "text", ph: "e.g. 2× John Deere 8R 250 (new)" },
      { label: "Deal value ($)", type: "number", ph: "0" },
      { label: "Stage", type: "select", options: ["Lead", "Demo Set", "Quoted", "Financing", "Closing"] },
      { label: "Salesperson", type: "select", options: ["S. Meyer", "A. Boyd"] },
      { label: "Est. close date", type: "date" },
      { label: "Trade-in (optional)", type: "text", wide: true, ph: "e.g. 2015 John Deere 8320R" }
    ]
  },
  "customer": {
    title: "New Customer", dept: "Customers", deptHref: "customers.html", submit: "Create Customer",
    fields: [
      { label: "Business name", type: "text", ph: "e.g. Hendricks Family Farms" },
      { label: "Segment", type: "select", options: ["Ag", "Turf", "Construction"] },
      { label: "Primary contact", type: "text", ph: "Full name" },
      { label: "Phone", type: "text", ph: "(701) 555-0000" },
      { label: "Email", type: "text", ph: "name@example.com" },
      { label: "Payment terms", type: "select", options: ["Net 30", "Net 15", "Net 45", "COD"] },
      { label: "Address", type: "text", wide: true, ph: "Street, city, ND" },
      { label: "Credit limit ($)", type: "number", ph: "0" }
    ]
  },
  "connection": {
    title: "Add Connection", dept: "Manufacturers", deptHref: "manufacturers.html", submit: "Add Connection",
    fields: [
      { label: "Manufacturer", type: "select", options: [...OEMS, "Other"] },
      { label: "Auth method", type: "select", options: ["OAuth 2.0", "API key", "EDI", "Dealer portal"] },
      { label: "Dealer account #", type: "text", ph: "e.g. PL-Fargo 2210" },
      { label: "Capabilities", type: "checks", wide: true, options: ["Parts Orders", "Warranty Claims", "Inventory Feed", "Unit Registration"] },
      { label: "Notes", type: "textarea", wide: true, ph: "Credentials contact, sandbox vs. production…" }
    ]
  }
};

/* ---------- render ---------- */
function fieldHTML(f, prefill) {
  const val = (f.key && prefill[f.key]) || f.value || "";
  let input;
  if (f.type === "select") {
    input = `<select class="form-select">${f.options.map((o, i) => `<option${i === 0 ? " selected" : ""}>${o}</option>`).join("")}</select>`;
  } else if (f.type === "textarea") {
    input = `<textarea class="form-textarea" placeholder="${f.ph || ""}">${val}</textarea>`;
  } else if (f.type === "checks") {
    input = `<div class="form-check-row">${f.options.map(o => `<label class="form-check"><input type="checkbox" checked> ${o}</label>`).join("")}</div>`;
  } else {
    input = `<input class="form-input" type="${f.type}" placeholder="${f.ph || ""}" value="${val}">`;
  }
  return `<div class="form-field${f.wide ? " wide" : ""}"><label class="form-label">${f.label}</label>${input}</div>`;
}

function render(cfg, prefill) {
  document.getElementById("content").innerHTML = `
    <div class="page-intro">
      <div>
        <h1>${cfg.title}</h1>
        <div class="sub">${cfg.dept} · Prairie Line — Fargo</div>
      </div>
    </div>
    <div class="card" style="max-width:820px;">
      <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>Details</div></div>
      <div class="form-grid">${cfg.fields.map(f => fieldHTML(f, prefill)).join("")}</div>
      <div class="form-actions" style="padding:0 18px 18px;">
        <a class="btn-lg" href="${cfg.deptHref}">Cancel</a>
        <a class="btn-lg primary" href="${cfg.deptHref}">${cfg.submit}</a>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const params = new URLSearchParams(location.search);
  const type = FORMS[params.get("type")] ? params.get("type") : "work-order";
  const cfg = FORMS[type];
  const prefill = { part: params.get("part") || "", qty: params.get("qty") || "" };
  render(cfg, prefill);
  document.title = "Fieldbook — " + cfg.title;
  document.getElementById("crumb-here").textContent = cfg.title;
  const dept = document.getElementById("crumb-dept");
  dept.textContent = cfg.dept;
  dept.href = cfg.deptHref;
  // mark the matching sidebar nav item active
  const nav = document.querySelector('.sidebar a.nav-item[href="' + cfg.deptHref + '"]');
  if (nav) nav.classList.add("active");
})();
