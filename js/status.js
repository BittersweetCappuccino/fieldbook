/* ============================================================
   Update status / stage. Data-driven by ?type=&id=. Shows the
   record's status options as a radio list (current one preselected)
   plus an optional activity-log note. Save/Cancel return to the
   record's detail page. Reached from the "Update status" action on
   work orders, warranties, rentals, POs and deals, and from a deal's
   "Advance stage" lead action.
   ============================================================ */
const STATUS_SETS = {
  "work-order": ["Scheduled", "In Progress", "Waiting on Parts", "Ready for Pickup", "Completed", "Invoiced"],
  warranty:     ["Draft", "Submitted", "In Review", "Approved", "Paid", "Denied"],
  rental:       ["Reserved", "Out", "Overdue", "Returned", "Closed"],
  po:           ["Draft", "Submitted", "Partially Received", "Received", "Closed"],
  deal:         ["Lead", "Demo Set", "Quoted", "Financing", "Closing", "Won", "Lost"]
};
const CURRENT_STATUS = {
  "work-order": "In Progress",
  warranty: "Submitted",
  rental: "Out",
  po: "Submitted",
  deal: "Quoted"
};

(function () {
  const params = new URLSearchParams(location.search);
  const META = window.FB_ENTITY_META || {};
  const type = STATUS_SETS[params.get("type")] ? params.get("type") : "work-order";
  const meta = META[type] || { label: "Record", dept: "Service", deptHref: "service.html", page: "service.html", param: "id" };
  const id = params.get("id") || "";
  const back = meta.page + "?" + meta.param + "=" + encodeURIComponent(id);
  const statuses = STATUS_SETS[type];
  const current = CURRENT_STATUS[type] || statuses[0];

  const opts = statuses.map(s =>
    `<label class="form-check" style="padding:7px 0;"><input type="radio" name="status"${s === current ? " checked" : ""}> ${s}${s === current ? ' <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--field-green);background:rgba(63,107,79,0.12);padding:1px 6px;border-radius:10px;margin-left:4px;">current</span>' : ""}</label>`
  ).join("");

  document.getElementById("content").innerHTML = `
    <div class="page-intro">
      <div>
        <h1>Update Status</h1>
        <div class="sub">${meta.label}${id ? " · " + id : ""}</div>
      </div>
    </div>
    <div class="card" style="max-width:640px;">
      <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>${meta.label} status</div><div class="card-meta">Current: ${current}</div></div>
      <div class="form-grid" style="grid-template-columns:1fr;">
        <div class="form-field wide">
          <label class="form-label">New status</label>
          <div style="display:flex;flex-direction:column;gap:2px;">${opts}</div>
        </div>
        <div class="form-field wide">
          <label class="form-label">Note (optional)</label>
          <textarea class="form-textarea" placeholder="Add a note to the activity log…"></textarea>
        </div>
      </div>
      <div class="form-actions" style="padding:0 18px 18px;">
        <a class="btn-lg" href="${back}">Cancel</a>
        <a class="btn-lg primary" href="${back}">Save status</a>
      </div>
    </div>`;

  document.title = "Fieldbook — Update Status";
  document.getElementById("crumb-here").textContent = "Update status";
  const dept = document.getElementById("crumb-dept");
  dept.textContent = meta.dept;
  dept.href = meta.deptHref;
  const nav = document.querySelector('.sidebar a.nav-item[href="' + meta.deptHref + '"]');
  if (nav) nav.classList.add("active");
})();
