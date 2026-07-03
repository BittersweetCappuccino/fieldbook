/* ============================================================
   New-record & edit forms. One data-driven screen; ?type=<t>
   selects the form (work-order, warranty, rental, po, part, deal,
   customer, connection).

   Two modes, chosen by the page it runs on:
     • new.html  → create form (Cancel/Save return to the dept board).
     • edit.html?type=&id=  → edit form: title becomes "Edit …", the
       submit button becomes "Save changes", fields are prefilled from
       the form's `sample`, and Cancel/Save return to the record's
       detail page (resolved via window.FB_ENTITY_META).

   The Reorder action still deep-links here as ?type=po&part=…&qty=…
   with the part prefilled.
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
    ],
    sample: {
      "Customer": "Hendricks Family Farms",
      "Equipment / unit": "John Deere 8R 250 — Hendricks Farm #4",
      "Bay": "Bay 3",
      "Assigned technician": "R. Alvarez",
      "Promised date": "2026-07-08",
      "Pay type": "Customer + Warranty",
      "Complaint": "Intermittent hydraulic pressure loss under load; PTO disengages on grade."
    }
  },
  "warranty": {
    title: "New Warranty Claim", dept: "Warranty", deptHref: "manufacturers.html", submit: "Create Claim",
    fields: [
      { label: "Customer", type: "select", options: CUSTOMERS },
      { label: "Equipment / unit", type: "text", ph: "e.g. John Deere 8R 250 — Hendricks Farm #4" },
      { label: "Manufacturer", type: "select", options: OEMS },
      { label: "Claim type", type: "select", options: ["Parts & Labor", "Parts only", "Goodwill", "Recall"] },
      { label: "Failure date", type: "date" },
      { label: "Linked work order", type: "text", ph: "e.g. WO-88213" },
      { label: "Status", type: "select", options: ["Draft", "Submitted", "Approved", "Paid", "Denied"] },
      { label: "Failure description", type: "textarea", wide: true, ph: "Describe the failure and diagnosis…" }
    ],
    sample: {
      "Customer": "Hendricks Family Farms",
      "Equipment / unit": "John Deere 8R 250 — Hendricks Farm #4",
      "Manufacturer": "John Deere",
      "Claim type": "Parts & Labor",
      "Failure date": "2026-06-30",
      "Linked work order": "WO-88213",
      "Status": "Submitted",
      "Failure description": "Hydraulic pump failure within powertrain warranty period; metal in filter."
    }
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
    ],
    sample: {
      "Customer": "Sundquist Excavating",
      "Unit": "Bobcat E35 Mini Excavator",
      "Checkout date": "2026-06-28",
      "Due back": "2026-07-05",
      "Rate basis": "Weekly",
      "Delivery": "Dealer haul-out",
      "Job site": "County Rd 14 site, West Fargo, ND",
      "Deposit ($)": "1500"
    }
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
    ],
    sample: {
      "Supplier / OEM": "John Deere",
      "Ship to": "Prairie Line — Fargo",
      "Part #": "RE-52341",
      "Quantity": "4",
      "Linked work order (optional)": "WO-88213",
      "Notes": "Rush — customer waiting on hydraulic pump."
    }
  },
  "part": {
    title: "New Part", dept: "Parts", deptHref: "parts.html", submit: "Add Part",
    fields: [
      { label: "Part #", type: "text", ph: "e.g. RE-52341" },
      { label: "Description", type: "text", ph: "e.g. Hydraulic pump, 8R series" },
      { label: "Manufacturer", type: "select", options: OEMS },
      { label: "Bin location", type: "text", ph: "e.g. A-14-3" },
      { label: "On-hand qty", type: "number", ph: "0" },
      { label: "Reorder point", type: "number", ph: "0" },
      { label: "Unit cost ($)", type: "number", ph: "0" },
      { label: "List price ($)", type: "number", ph: "0" }
    ],
    sample: {
      "Part #": "RE-52341",
      "Description": "Hydraulic pump, 8R series",
      "Manufacturer": "John Deere",
      "Bin location": "A-14-3",
      "On-hand qty": "2",
      "Reorder point": "4",
      "Unit cost ($)": "812.40",
      "List price ($)": "1149.00"
    }
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
    ],
    sample: {
      "Customer": "Red River Grain Co.",
      "Equipment": "2× John Deere 8R 250 (new)",
      "Deal value ($)": "540000",
      "Stage": "Quoted",
      "Salesperson": "S. Meyer",
      "Est. close date": "2026-07-31",
      "Trade-in (optional)": "2015 John Deere 8320R"
    }
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
    ],
    sample: {
      "Business name": "Hendricks Family Farms",
      "Segment": "Ag",
      "Primary contact": "Dale Hendricks",
      "Phone": "(701) 555-0142",
      "Email": "dale@hendricksfarms.example",
      "Payment terms": "Net 30",
      "Address": "4821 County Rd 12, Kindred, ND",
      "Credit limit ($)": "75000"
    }
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
function fieldHTML(f, prefill, sample) {
  const sv = sample && sample[f.label] != null ? sample[f.label] : null;
  const val = sv != null ? sv : ((f.key && prefill[f.key]) || f.value || "");
  let input;
  if (f.type === "select") {
    input = `<select class="form-select">${f.options.map((o, i) => `<option${(sv != null ? o === sv : i === 0) ? " selected" : ""}>${o}</option>`).join("")}</select>`;
  } else if (f.type === "textarea") {
    input = `<textarea class="form-textarea" placeholder="${f.ph || ""}">${val}</textarea>`;
  } else if (f.type === "checks") {
    input = `<div class="form-check-row">${f.options.map(o => `<label class="form-check"><input type="checkbox" checked> ${o}</label>`).join("")}</div>`;
  } else {
    input = `<input class="form-input" type="${f.type}" placeholder="${f.ph || ""}" value="${val}">`;
  }
  return `<div class="form-field${f.wide ? " wide" : ""}"><label class="form-label">${f.label}</label>${input}</div>`;
}

function render(cfg, prefill, ctx) {
  document.getElementById("content").innerHTML = `
    <div class="page-intro">
      <div>
        <h1>${ctx.title}</h1>
        <div class="sub">${ctx.sub}</div>
      </div>
    </div>
    <div class="card" style="max-width:820px;">
      <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>Details</div></div>
      <div class="form-grid">${cfg.fields.map(f => fieldHTML(f, prefill, ctx.sample)).join("")}</div>
      <div class="form-actions" style="padding:0 18px 18px;">
        <a class="btn-lg" href="${ctx.backHref}">Cancel</a>
        <a class="btn-lg primary" href="${ctx.backHref}">${ctx.submit}</a>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const params = new URLSearchParams(location.search);
  const editing = location.pathname.split("/").pop() === "edit.html";
  const type = FORMS[params.get("type")] ? params.get("type") : "work-order";
  const cfg = FORMS[type];
  const meta = (window.FB_ENTITY_META || {})[type];
  const id = params.get("id") || "";
  const prefill = { part: params.get("part") || "", qty: params.get("qty") || "" };

  let ctx;
  if (editing) {
    const label = meta ? meta.label : cfg.title.replace(/^New /, "");
    const backHref = meta ? (meta.page + "?" + meta.param + "=" + encodeURIComponent(id)) : cfg.deptHref;
    ctx = {
      title: "Edit " + label,
      sub: label + (id ? " · " + id : ""),
      submit: "Save changes",
      backHref: backHref,
      sample: cfg.sample || {},
      dept: meta ? meta.dept : cfg.dept,
      deptHref: meta ? meta.deptHref : cfg.deptHref,
      crumbHere: "Edit"
    };
  } else {
    ctx = {
      title: cfg.title,
      sub: cfg.dept + " · Prairie Line — Fargo",
      submit: cfg.submit,
      backHref: cfg.deptHref,
      sample: null,
      dept: cfg.dept,
      deptHref: cfg.deptHref,
      crumbHere: cfg.title
    };
  }

  render(cfg, prefill, ctx);
  document.title = "Fieldbook — " + ctx.title;
  document.getElementById("crumb-here").textContent = ctx.crumbHere;
  const dept = document.getElementById("crumb-dept");
  dept.textContent = ctx.dept;
  dept.href = ctx.deptHref;
  // mark the matching sidebar nav item active
  const nav = document.querySelector('.sidebar a.nav-item[href="' + ctx.deptHref + '"]');
  if (nav) nav.classList.add("active");
})();
