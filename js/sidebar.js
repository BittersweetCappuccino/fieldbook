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
})();
