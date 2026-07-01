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
    '<span class="tgl-text">Collapse</span>' +
    '<span class="tgl-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></span>';
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
})();
