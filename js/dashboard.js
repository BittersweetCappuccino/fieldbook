/* ============================================================
   Dashboard sidebar interactivity.
   Each Departments/Overview nav item links to a section anchor
   that exists on this page (#top, #service, #parts, #rentals,
   #sales, #manufacturers). Clicking scrolls to it and marks it
   active; a scroll-spy keeps the active item in sync as you
   scroll. Reporting/Customers have no section yet and are inert.
   ============================================================ */
(function () {
  const links = Array.from(document.querySelectorAll('.sidebar a.nav-item[href^="#"]'));
  if (!links.length) return;

  // map: section id -> nav link
  const byId = new Map();
  links.forEach(a => byId.set(a.getAttribute("href").slice(1), a));

  function setActive(id) {
    links.forEach(a => a.classList.toggle("active", a === byId.get(id)));
  }

  // sections sorted by their actual vertical position, so scroll-spy
  // evaluates them in document order (sidebar order differs from page order)
  const sections = [...byId.keys()]
    .map(id => document.getElementById(id))
    .filter(Boolean)
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

  // click: activate immediately and briefly suppress the spy so the
  // smooth-scroll animation doesn't flip the highlight on the way
  let suppressUntil = 0;
  links.forEach(a => a.addEventListener("click", () => {
    setActive(a.getAttribute("href").slice(1));
    suppressUntil = Date.now() + 700;
  }));

  let ticking = false;
  function onScroll() {
    if (ticking || Date.now() < suppressUntil) return;
    ticking = true;
    requestAnimationFrame(() => {
      const line = 120; // px from top of viewport used as the "current" marker
      let currentId = sections[0].id;
      for (const el of sections) {
        if (el.getBoundingClientRect().top - line <= 0) currentId = el.id;
      }
      // near the very bottom, force the last section active
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        currentId = sections[sections.length - 1].id;
      }
      setActive(currentId);
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
