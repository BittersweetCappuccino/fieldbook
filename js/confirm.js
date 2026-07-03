/* ============================================================
   Shared destructive-action confirmation. Data-driven by
   ?type=&id=&action=. Covers Cancel work order / Cancel rental /
   Cancel PO / Cancel deal, Void claim and Discontinue part. "Keep"
   returns to the record; confirming returns to the department board.
   ============================================================ */
const CONFIRM_ACTIONS = {
  cancel:      { verb: "Cancel", line: n => "This stops all work on the " + n + " and marks it cancelled. This can't be undone." },
  void:        { verb: "Void", line: () => "Voiding withdraws the claim from the manufacturer. This can't be undone." },
  discontinue: { verb: "Discontinue", line: () => "This removes the part from the catalog and stops automatic reordering." }
};

(function () {
  const params = new URLSearchParams(location.search);
  const META = window.FB_ENTITY_META || {};
  const type = META[params.get("type")] ? params.get("type") : "work-order";
  const meta = META[type];
  const id = params.get("id") || "";
  const action = CONFIRM_ACTIONS[params.get("action")] ? params.get("action") : "cancel";
  const cfg = CONFIRM_ACTIONS[action];
  const back = meta.page + "?" + meta.param + "=" + encodeURIComponent(id);
  const ref = meta.label + (id ? " " + id : "");
  const RED = "#A93B2C";

  const tri = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

  document.getElementById("content").innerHTML = `
    <div style="max-width:460px;margin:36px auto 0;">
      <div class="card" style="padding:28px 26px;text-align:center;">
        <div style="width:52px;height:52px;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;color:${RED};background:rgba(169,59,44,0.10);">${tri}</div>
        <h1 style="font-family:'Oswald',sans-serif;font-weight:600;font-size:21px;letter-spacing:0.01em;margin:16px 0 8px;">${cfg.verb} this ${meta.noun}?</h1>
        <p style="color:var(--slate);font-size:13.5px;line-height:1.5;margin:0 auto 22px;max-width:38ch;">${cfg.line(meta.noun)}<br><span style="color:var(--ink);font-weight:600;">${ref}</span></p>
        <div style="display:flex;gap:10px;justify-content:center;">
          <a class="btn-lg" href="${back}">Keep ${meta.noun}</a>
          <a class="btn-lg" style="background:${RED};color:#fff;border-color:${RED};" href="${meta.deptHref}">${cfg.verb} ${meta.noun}</a>
        </div>
      </div>
    </div>`;

  document.title = "Fieldbook — " + cfg.verb + " " + meta.noun;
  document.getElementById("crumb-here").textContent = cfg.verb;
  const dept = document.getElementById("crumb-dept");
  dept.textContent = meta.dept;
  dept.href = meta.deptHref;
  const nav = document.querySelector('.sidebar a.nav-item[href="' + meta.deptHref + '"]');
  if (nav) nav.classList.add("active");
})();
