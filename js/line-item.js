/* ============================================================
   Add line item. Data-driven by ?type=&id=&kind=. The kind picks the
   field set: labor / parts / charge / line. Save/Cancel return to the
   record's detail page. Reached from "Add labor line", "Add parts"
   (work orders, warranties), "Add charge" (rentals) and "Add line
   item" (POs, deals).
   ============================================================ */
const LI_TECHS = ["Unassigned", "R. Alvarez", "J. Okafor", "M. Lindqvist", "T. Nguyen", "D. Berg"];

const KINDS = {
  labor: {
    title: "Add Labor Line", heading: "Labor operation",
    fields: [
      { label: "Operation / flat-rate", type: "text", wide: true, ph: "e.g. Replace hydraulic pump" },
      { label: "Estimated hours", type: "number", ph: "0.0" },
      { label: "Rate", type: "select", options: ["Customer — $145/hr", "Warranty — $118/hr", "Internal — $95/hr"] },
      { label: "Technician", type: "select", options: LI_TECHS },
      { label: "Notes", type: "textarea", wide: true, ph: "Optional notes…" }
    ]
  },
  parts: {
    title: "Add Parts", heading: "Parts line",
    fields: [
      { label: "Part #", type: "text", ph: "e.g. RE-52341" },
      { label: "Description", type: "text", ph: "e.g. Hydraulic pump, 8R series" },
      { label: "Quantity", type: "number", ph: "1" },
      { label: "Unit price ($)", type: "number", ph: "0" }
    ]
  },
  charge: {
    title: "Add Charge", heading: "Rental charge",
    fields: [
      { label: "Description", type: "text", wide: true, ph: "e.g. Delivery / haul-out" },
      { label: "Amount ($)", type: "number", ph: "0" }
    ]
  },
  line: {
    title: "Add Line Item", heading: "Line item",
    fields: [
      { label: "Item / description", type: "text", wide: true, ph: "Line item description" },
      { label: "Quantity", type: "number", ph: "1" },
      { label: "Unit price ($)", type: "number", ph: "0" }
    ]
  }
};

function liField(f) {
  let input;
  if (f.type === "select") {
    input = `<select class="form-select">${f.options.map((o, i) => `<option${i === 0 ? " selected" : ""}>${o}</option>`).join("")}</select>`;
  } else if (f.type === "textarea") {
    input = `<textarea class="form-textarea" placeholder="${f.ph || ""}"></textarea>`;
  } else {
    input = `<input class="form-input" type="${f.type}" placeholder="${f.ph || ""}">`;
  }
  return `<div class="form-field${f.wide ? " wide" : ""}"><label class="form-label">${f.label}</label>${input}</div>`;
}

(function () {
  const params = new URLSearchParams(location.search);
  const META = window.FB_ENTITY_META || {};
  const type = META[params.get("type")] ? params.get("type") : "work-order";
  const meta = META[type];
  const kind = KINDS[params.get("kind")] ? params.get("kind") : "line";
  const cfg = KINDS[kind];
  const id = params.get("id") || "";
  const back = meta.page + "?" + meta.param + "=" + encodeURIComponent(id);

  document.getElementById("content").innerHTML = `
    <div class="page-intro">
      <div>
        <h1>${cfg.title}</h1>
        <div class="sub">${meta.label}${id ? " · " + id : ""}</div>
      </div>
    </div>
    <div class="card" style="max-width:720px;">
      <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--field-green)"></span>${cfg.heading}</div></div>
      <div class="form-grid">${cfg.fields.map(liField).join("")}</div>
      <div class="form-actions" style="padding:0 18px 18px;">
        <a class="btn-lg" href="${back}">Cancel</a>
        <a class="btn-lg primary" href="${back}">Add to ${meta.noun}</a>
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
