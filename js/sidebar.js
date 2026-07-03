/* ============================================================
   Collapsible sidebar (shared by the dashboard and work order).
   Injects a toggle button into the sidebar and collapses it to an
   icon-only rail for more content width. State is persisted in
   localStorage so it carries across pages.
   ============================================================ */
(function () {
  const app = document.querySelector(".app");
  const sidebar = document.querySelector(".sidebar");
  if (!app || !sidebar) return;

  const KEY = "fieldbook-sidebar-collapsed";
  const navItems = Array.from(sidebar.querySelectorAll(".nav-item"));

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "sidebar-toggle";
  btn.innerHTML =
    '<span class="tgl-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 18l-6-6 6-6"/></svg></span>';
  sidebar.insertBefore(btn, sidebar.firstChild);

  function apply(collapsed) {
    app.classList.toggle("collapsed", collapsed);
    btn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
    btn.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
    // when collapsed, show each nav item's label as a native tooltip
    navItems.forEach(el => {
      if (collapsed) {
        if (el.dataset.origTitle === undefined) el.dataset.origTitle = el.getAttribute("title") || "";
        el.setAttribute("title", el.textContent.trim());
      } else if (el.dataset.origTitle !== undefined) {
        if (el.dataset.origTitle) el.setAttribute("title", el.dataset.origTitle);
        else el.removeAttribute("title");
      }
    });
  }

  let collapsed = localStorage.getItem(KEY) === "1";
  apply(collapsed);
  // enable the width transition only after the initial state is set,
  // so the sidebar doesn't animate on every page load
  requestAnimationFrame(() => app.classList.add("anim"));

  btn.addEventListener("click", () => {
    collapsed = !collapsed;
    localStorage.setItem(KEY, collapsed ? "1" : "0");
    apply(collapsed);
  });

  /* ---- mobile: off-canvas drawer ----
     Below 900px the sidebar is a drawer. A hamburger in the topbar and a
     backdrop (both injected here) open/close it; picking a nav item or
     pressing Escape closes it. */
  const topbar = document.querySelector(".topbar");
  const hamburger = document.createElement("button");
  hamburger.type = "button";
  hamburger.className = "mobile-navbtn";
  hamburger.setAttribute("aria-label", "Open menu");
  hamburger.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
  if (topbar) topbar.insertBefore(hamburger, topbar.firstChild);

  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  app.appendChild(backdrop);

  function setDrawer(open) {
    app.classList.toggle("nav-open", open);
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  hamburger.addEventListener("click", () => setDrawer(!app.classList.contains("nav-open")));
  backdrop.addEventListener("click", () => setDrawer(false));
  sidebar.querySelectorAll("a.nav-item").forEach(a => a.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setDrawer(false); });

  /* ---- Back button on nested detail screens ----
     Nested screens carry a `#crumb-here` leaf in their breadcrumb; the
     department index pages do not. Give those detail screens a Back
     affordance in the topbar. It prefers in-app history so it feels
     native, but falls back to the parent breadcrumb link on a direct
     load (empty/off-site referrer) so the user is never stranded. The
     fallback target is read lazily at click time, so screens that set
     their crumb link after load (e.g. the New… form) still work. */
  if (topbar && document.getElementById("crumb-here")) {
    const crumb = topbar.querySelector(".crumb");
    const parentLink = crumb && crumb.querySelector("a:last-of-type");
    if (crumb) {
      const back = document.createElement("a");
      back.className = "back-btn";
      back.href = (parentLink && parentLink.getAttribute("href")) || "#";
      back.setAttribute("aria-label", "Back");
      back.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 18l-6-6 6-6"/></svg>' +
        '<span class="bb-label">Back</span>';

      // wrap the back button + crumb so they stay grouped on the left
      // while the topbar's space-between keeps the account menu on the right
      const group = document.createElement("div");
      group.className = "crumb-group";
      crumb.parentNode.insertBefore(group, crumb);
      group.appendChild(back);
      group.appendChild(crumb);

      back.addEventListener("click", e => {
        let sameOrigin = false;
        try { sameOrigin = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (_) {}
        if (history.length > 1 && sameOrigin) { e.preventDefault(); history.back(); return; }
        const link = crumb.querySelector("a:last-of-type");
        const href = link && link.getAttribute("href");
        if (href && href !== "#") { e.preventDefault(); location.href = href; }
        // otherwise fall through to the anchor's own href
      });
    }
  }

  /* ---- topbar dropdowns: site/location switcher + account menu ----
     Wired here (rather than a per-page script) since sidebar.js already
     loads on every page that has the shared topbar. */
  if (topbar) initTopbar(topbar);

  function initTopbar(topbarEl) {
    const CHEVRON = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';
    const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>';
    const SITES = [
      { label: "Prairie Line — Fargo", footer: "Prairie Line Equipment — Fargo, ND" },
      { label: "Prairie Line — Bismarck", footer: "Prairie Line Equipment — Bismarck, ND" },
      { label: "Prairie Line — Grand Forks", footer: "Prairie Line Equipment — Grand Forks, ND" },
      { label: "Coteau Equipment — Minot", footer: "Coteau Equipment — Minot, ND" }
    ];
    const SITE_KEY = "fieldbook-site";
    let current = localStorage.getItem(SITE_KEY) || SITES[0].label;
    if (!SITES.some(s => s.label === current)) current = SITES[0].label;

    const switcher = topbarEl.querySelector(".site-switcher");
    const avatar = topbarEl.querySelector(".avatar");
    const actionsBtn = topbarEl.querySelector(".actions-btn");

    // Account-menu targets resolve relative to where the shared topbar loads:
    // the dashboard sits at the repo root, every other screen under /pages/.
    const inPages = /\/pages\//.test(location.pathname);
    const PREFIX = inPages ? "" : "pages/";

    function icon(p) { return '<span class="mi-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + p + '</svg></span>'; }

    /* ---- contextual Actions menu for the simple entity pages ----
       The work order screen builds its own record-aware menu in
       work-order.js; the warranty / rental / PO / part / deal / customer
       pages instead tag their .actions-btn with data-actions=<preset> and
       we assemble a matching menu here so the dropdown opens everywhere the
       button appears. Items are placeholders (they just close) except
       data-act="print", handled by the shared menu-item click handler. */
    const ACT_ICON = {
      play:   '<polygon points="5 3 19 12 5 21 5 3"/>',
      labor:  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      box:    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
      status: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
      edit:   '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
      print:  '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
      mail:   '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      cancel: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
      plus:   '<path d="M12 5v14M5 12h14"/>',
      check:  '<path d="M20 6 9 17l-5-5"/>',
      truck:  '<rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'
    };
    /* Shared entity metadata — the generic Actions screens (edit / status /
       line-item / email / confirm) read this off window.FB_ENTITY_META to
       resolve a record's department, detail page and URL param by type. */
    const ENTITY_META = {
      "work-order": { label: "Work Order", noun: "work order", dept: "Service", deptHref: "service.html", param: "wo", page: "work-order.html" },
      warranty:     { label: "Warranty Claim", noun: "claim", dept: "Warranty", deptHref: "manufacturers.html", param: "wc", page: "warranty.html" },
      rental:       { label: "Rental", noun: "rental", dept: "Rentals", deptHref: "rentals.html", param: "rn", page: "rental.html" },
      po:           { label: "Purchase Order", noun: "purchase order", dept: "Parts", deptHref: "parts.html", param: "po", page: "po.html" },
      part:         { label: "Part", noun: "part", dept: "Parts", deptHref: "parts.html", param: "p", page: "part.html" },
      deal:         { label: "Deal", noun: "deal", dept: "Sales", deptHref: "sales.html", param: "d", page: "deal.html" },
      customer:     { label: "Customer", noun: "customer", dept: "Customers", deptHref: "customers.html", param: "c", page: "customer.html" }
    };
    window.FB_ENTITY_META = ENTITY_META;

    /* Resolve a menu item's role to a destination. Roles left off an item
       stay placeholders (their screens live in Section B, not built yet). */
    function actionHref(role, type, id) {
      const q = "type=" + type + "&id=" + encodeURIComponent(id);
      switch (role) {
        case "edit":       return "edit.html?" + q;
        case "status":     return "status.html?" + q;
        case "email":      return "email.html?" + q;
        case "add-labor":  return "line-item.html?" + q + "&kind=labor";
        case "add-parts":  return "line-item.html?" + q + "&kind=parts";
        case "add-charge": return "line-item.html?" + q + "&kind=charge";
        case "add-line":   return "line-item.html?" + q + "&kind=line";
        case "cancel": case "void": case "discontinue":
                           return "confirm.html?" + q + "&action=" + role;
        case "new-wo":     return "new.html?type=work-order";
        case "new-rental": return "new.html?type=rental";
        case "new-deal":   return "new.html?type=deal";
        case "order-more": return "new.html?type=po&part=" + encodeURIComponent(id);
        // Section B — workflow-specific screens (workflow.js)
        case "qc":            return "qc.html?" + q;
        case "parts-eta":     return "parts-eta.html?" + q;
        case "assign":        return "assign.html?" + q;
        case "invoice":       return "invoice.html?" + q;
        case "submit-claim":  return "claim-submit.html?" + q;
        case "checkin":       return "checkin.html?" + q;
        case "extend":        return "extend.html?" + q;
        case "receive":       return "receive.html?" + q;
        case "adjust-stock":  return "adjust-stock.html?" + q;
        case "transfer-stock":return "transfer-stock.html?" + q;
        case "start-job":     return "bay.html?wo=" + encodeURIComponent(id);
        default:           return null;
      }
    }
    window.FB_ACTION_HREF = actionHref;

    // preset item: [ico, text, role?] — role → actionHref(); "print" prints;
    // no role = placeholder (a Section B screen that isn't built yet).
    const ACTIONS_PRESETS = {
      warranty: {
        lead: ["shield", "Submit claim to manufacturer", "submit-claim"],
        groups: [
          ["Claim", [["labor", "Add labor line", "add-labor"], ["box", "Add parts", "add-parts"], ["status", "Update status", "status"], ["edit", "Edit details", "edit"]]],
          ["Share", [["print", "Print claim", "print"], ["mail", "Email to customer", "email"]]]
        ],
        danger: ["cancel", "Void claim", "void"]
      },
      rental: {
        lead: ["check", "Check in unit", "checkin"],
        groups: [
          ["Rental", [["plus", "Extend rental", "extend"], ["labor", "Add charge", "add-charge"], ["status", "Update status", "status"], ["edit", "Edit details", "edit"]]],
          ["Share", [["print", "Print agreement", "print"], ["mail", "Email to customer", "email"]]]
        ],
        danger: ["cancel", "Cancel rental", "cancel"]
      },
      po: {
        lead: ["truck", "Receive items", "receive"],
        groups: [
          ["Purchase order", [["plus", "Add line item", "add-line"], ["status", "Update status", "status"], ["edit", "Edit details", "edit"]]],
          ["Share", [["print", "Print PO", "print"], ["mail", "Email to vendor", "email"]]]
        ],
        danger: ["cancel", "Cancel PO", "cancel"]
      },
      part: {
        lead: ["box", "Adjust stock", "adjust-stock"],
        groups: [
          ["Inventory", [["plus", "Order more", "order-more"], ["truck", "Transfer stock", "transfer-stock"], ["edit", "Edit details", "edit"]]],
          ["Share", [["print", "Print bin label", "print"]]]
        ],
        danger: ["cancel", "Discontinue part", "discontinue"]
      },
      deal: {
        lead: ["play", "Advance stage", "status"],
        groups: [
          ["Deal", [["plus", "Add line item", "add-line"], ["status", "Update status", "status"], ["edit", "Edit details", "edit"]]],
          ["Share", [["print", "Print quote", "print"], ["mail", "Email to customer", "email"]]]
        ],
        danger: ["cancel", "Cancel deal", "cancel"]
      },
      customer: {
        lead: ["plus", "New work order", "new-wo"],
        groups: [
          ["Customer", [["plus", "New rental", "new-rental"], ["plus", "New deal", "new-deal"], ["edit", "Edit details", "edit"]]],
          ["Share", [["print", "Print statement", "print"], ["mail", "Email customer", "email"]]]
        ]
      }
    };

    function buildEntityActions(btn, preset) {
      const type = btn.dataset.actions;
      const meta = ENTITY_META[type];
      const id = meta ? (new URLSearchParams(location.search).get(meta.param) || "") : "";
      const item = (it, danger) => {
        const role = it[2];
        let attrs = "";
        if (role === "print") attrs = ' data-act="print"';
        else { const h = actionHref(role, type, id); if (h) attrs = ' data-href="' + h + '"'; }
        return '<div class="menu-item' + (danger ? " danger" : "") + '"' + attrs + '>' + icon(ACT_ICON[it[0]]) + it[1] + '</div>';
      };
      let h = '<div class="menu wo-actions-menu">';
      if (preset.lead) h += item(preset.lead);
      (preset.groups || []).forEach(g => {
        h += '<div class="menu-sep"></div><div class="menu-label">' + g[0] + '</div>';
        g[1].forEach(it => { h += item(it); });
      });
      if (preset.danger) h += '<div class="menu-sep"></div>' + item(preset.danger, true);
      h += '</div>';
      btn.insertAdjacentHTML("beforeend", h);
    }

    if (actionsBtn && actionsBtn.dataset.actions && ACTIONS_PRESETS[actionsBtn.dataset.actions] && !actionsBtn.querySelector(".menu")) {
      buildEntityActions(actionsBtn, ACTIONS_PRESETS[actionsBtn.dataset.actions]);
    }

    function renderSwitcher() {
      if (!switcher) return;
      switcher.innerHTML =
        '<span class="ss-label">' + current + '</span>' + CHEVRON +
        '<div class="menu"><div class="menu-label">Switch location</div>' +
        SITES.map(s => '<div class="menu-item' + (s.label === current ? ' current' : '') + '" data-site="' + s.label + '">' + s.label + (s.label === current ? '<span class="mi-check">' + CHECK + '</span>' : '') + '</div>').join("") +
        '</div>';
    }

    function renderAvatar() {
      if (!avatar) return;
      avatar.innerHTML = 'DC' +
        '<div class="menu">' +
        '<div class="menu-head"><div class="mh-av">DC</div><div><div class="mh-name">Dana Castellano</div><div class="mh-role">General Manager</div></div></div>' +
        '<div class="menu-sep"></div>' +
        '<div class="menu-item" data-href="' + PREFIX + 'profile.html">' + icon('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>') + 'Your profile</div>' +
        '<div class="menu-item" data-href="' + PREFIX + 'settings.html">' + icon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>') + 'Account settings</div>' +
        '<div class="menu-sep"></div>' +
        '<div class="menu-item" data-acct="signout">' + icon('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>') + 'Sign out</div>' +
        '</div>';
    }

    /* ---- Sign-out confirmation modal ----
       Built lazily on first use, then reused. Confirming sends the user to
       the login screen (resolved with the same PREFIX as the menu links);
       Cancel or Escape or a backdrop click dismisses it. */
    let signoutModal = null;
    function openSignoutModal() {
      if (!signoutModal) {
        signoutModal = document.createElement("div");
        signoutModal.className = "modal-backdrop";
        signoutModal.innerHTML =
          '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="signout-title">' +
          '<div class="modal-ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg></div>' +
          '<h2 id="signout-title">Sign out?</h2>' +
          '<p>You\'ll be returned to the sign-in screen. Any unsaved changes on this page will be lost.</p>' +
          '<div class="modal-actions">' +
          '<button type="button" class="btn-lg" data-signout="cancel">Cancel</button>' +
          '<button type="button" class="btn-lg primary" data-signout="confirm">Sign out</button>' +
          '</div></div>';
        document.body.appendChild(signoutModal);
        signoutModal.addEventListener("click", e => {
          const act = e.target.closest("[data-signout]");
          if (act && act.dataset.signout === "confirm") { location.href = PREFIX + "login.html"; return; }
          if (act && act.dataset.signout === "cancel") { closeSignoutModal(); return; }
          if (e.target === signoutModal) closeSignoutModal(); // backdrop
        });
      }
      // force reflow so the opacity/scale transition plays on first open
      signoutModal.offsetWidth;
      signoutModal.classList.add("open");
      const cancel = signoutModal.querySelector('[data-signout="cancel"]');
      if (cancel) cancel.focus();
    }
    function closeSignoutModal() { if (signoutModal) signoutModal.classList.remove("open"); }

    function syncActionsAria() {
      if (actionsBtn) actionsBtn.setAttribute("aria-expanded", actionsBtn.querySelector(".menu.open") ? "true" : "false");
    }
    function closeAll(except) {
      topbarEl.querySelectorAll(".menu.open").forEach(m => { if (m !== except) m.classList.remove("open"); });
      syncActionsAria();
    }
    function openMenu(m) { closeAll(m); if (m) m.classList.add("open"); syncActionsAria(); }

    function applySite() {
      renderSwitcher();
      const pill = document.querySelector(".location-pill");
      const site = SITES.find(s => s.label === current);
      if (pill && site) pill.innerHTML = '<span class="dot"></span>' + site.footer;
    }

    renderSwitcher();
    renderAvatar();

    document.addEventListener("click", e => {
      const item = e.target.closest(".menu-item");
      if (item) {
        e.preventDefault();
        if (item.dataset.site) { current = item.dataset.site; localStorage.setItem(SITE_KEY, current); applySite(); closeAll(); return; }
        if (item.dataset.acct === "signout") { closeAll(); openSignoutModal(); return; }
        if (item.dataset.href) { closeAll(); location.href = item.dataset.href; return; }
        if (item.dataset.act === "print") { closeAll(); window.print(); return; }
        closeAll(); return; // placeholder item (no wired handler)
      }
      if (e.target.closest(".menu")) return; // clicks on menu chrome keep it open
      const sw = switcher && switcher.contains(e.target); // topbar switcher only — not other .site-switcher pills (e.g. Reporting's period selector)
      if (sw) { const m = switcher.querySelector(".menu"); m.classList.contains("open") ? closeAll() : openMenu(m); return; }
      const av = avatar && e.target.closest(".avatar");
      if (av) { const m = avatar.querySelector(".menu"); m.classList.contains("open") ? closeAll() : openMenu(m); return; }
      const ac = actionsBtn && e.target.closest(".actions-btn");
      if (ac) { const m = actionsBtn.querySelector(".menu"); if (m) { m.classList.contains("open") ? closeAll() : openMenu(m); } return; }
      closeAll();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeAll(); closeSignoutModal(); } });
    if (actionsBtn) actionsBtn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const m = actionsBtn.querySelector(".menu");
        if (m) { m.classList.contains("open") ? closeAll() : openMenu(m); }
      }
    });
  }
})();
