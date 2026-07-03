/* ============================================================
   Compose email. Data-driven by ?type=&id=. Opens a pre-addressed
   message with the record's document attached and a draft body.
   Send/Cancel return to the record's detail page. Reached from the
   "Email to customer / vendor / customer" actions.
   ============================================================ */
const EMAIL_DOC = {
  "work-order": "Work order",
  warranty: "Warranty claim",
  rental: "Rental agreement",
  po: "Purchase order",
  deal: "Quote",
  customer: "Account statement"
};

(function () {
  const params = new URLSearchParams(location.search);
  const META = window.FB_ENTITY_META || {};
  const type = META[params.get("type")] ? params.get("type") : "work-order";
  const meta = META[type];
  const id = params.get("id") || "";
  const back = meta.page + "?" + meta.param + "=" + encodeURIComponent(id);

  const toVendor = type === "po";
  const recipient = toVendor ? "orders@johndeere.example" : "dale@hendricksfarms.example";
  const docName = (EMAIL_DOC[type] || "Document") + (id ? " " + id : "") + ".pdf";
  const ref = meta.label + (id ? " " + id : "");
  const subject = ref + " — Prairie Line Equipment";
  const greeting = toVendor ? "Hello," : "Hi Dale,";
  const body = greeting + "\n\nPlease find your " + meta.noun + " attached (" + ref + "). Let us know if you have any questions.\n\nThanks,\nDana Castellano\nPrairie Line Equipment — Fargo, ND";

  const clip = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>';

  document.getElementById("content").innerHTML = `
    <div class="page-intro">
      <div>
        <h1>Compose Email</h1>
        <div class="sub">${meta.label}${id ? " · " + id : ""}</div>
      </div>
    </div>
    <div class="card" style="max-width:760px;">
      <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>New message</div></div>
      <div class="form-grid" style="grid-template-columns:1fr;">
        <div class="form-field wide"><label class="form-label">To</label><input class="form-input" type="text" value="${recipient}"></div>
        <div class="form-field wide"><label class="form-label">Subject</label><input class="form-input" type="text" value="${subject}"></div>
        <div class="form-field wide"><label class="form-label">Message</label><textarea class="form-textarea" style="min-height:170px;">${body}</textarea></div>
        <div class="form-field wide">
          <label class="form-label">Attachment</label>
          <div style="display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--ink);background:var(--paper-2);border:1px solid var(--paper-line);border-radius:20px;padding:6px 13px;align-self:flex-start;">${clip}${docName}</div>
        </div>
      </div>
      <div class="form-actions" style="padding:0 18px 18px;">
        <a class="btn-lg" href="${back}">Cancel</a>
        <a class="btn-lg primary" href="${back}">Send email</a>
      </div>
    </div>`;

  document.title = "Fieldbook — Compose Email";
  document.getElementById("crumb-here").textContent = "Email";
  const dept = document.getElementById("crumb-dept");
  dept.textContent = meta.dept;
  dept.href = meta.deptHref;
  const nav = document.querySelector('.sidebar a.nav-item[href="' + meta.deptHref + '"]');
  if (nav) nav.classList.add("active");
})();
