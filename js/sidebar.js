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

    function icon(p) { return '<span class="mi-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + p + '</svg></span>'; }

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
        '<a class="menu-item" href="#">' + icon('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>') + 'Your profile</a>' +
        '<a class="menu-item" href="#">' + icon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>') + 'Account settings</a>' +
        '<div class="menu-item" data-acct="switch">' + icon('<path d="M3 12h18M3 6h18M3 18h18"/>') + 'Switch location</div>' +
        '<div class="menu-sep"></div>' +
        '<a class="menu-item" href="#">' + icon('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>') + 'Sign out</a>' +
        '</div>';
    }

    function closeAll(except) {
      topbarEl.querySelectorAll(".menu.open").forEach(m => { if (m !== except) m.classList.remove("open"); });
      if (actionsBtn) actionsBtn.setAttribute("aria-expanded", actionsBtn.querySelector(".menu.open") ? "true" : "false");
    }
    function openMenu(m) { closeAll(m); if (m) m.classList.add("open"); }

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
        if (item.dataset.acct === "switch") { closeAll(); if (switcher) openMenu(switcher.querySelector(".menu")); return; }
        if (item.dataset.href) { closeAll(); location.href = item.dataset.href; return; }
        if (item.dataset.act === "print") { closeAll(); window.print(); return; }
        closeAll(); return; // placeholder item (no wired handler)
      }
      if (e.target.closest(".menu")) return; // clicks on menu chrome keep it open
      const sw = switcher && e.target.closest(".site-switcher");
      if (sw) { const m = switcher.querySelector(".menu"); m.classList.contains("open") ? closeAll() : openMenu(m); return; }
      const av = avatar && e.target.closest(".avatar");
      if (av) { const m = avatar.querySelector(".menu"); m.classList.contains("open") ? closeAll() : openMenu(m); return; }
      const ac = actionsBtn && e.target.closest(".actions-btn");
      if (ac) { const m = actionsBtn.querySelector(".menu"); if (m) { m.classList.contains("open") ? closeAll() : openMenu(m); } return; }
      closeAll();
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
    if (actionsBtn) actionsBtn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const m = actionsBtn.querySelector(".menu");
        if (m) { m.classList.contains("open") ? closeAll() : openMenu(m); }
      }
    });
  }
})();
