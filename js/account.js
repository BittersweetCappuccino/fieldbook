/* ============================================================
   Account screens (Your profile / Account settings). Reached from
   the topbar avatar menu. One file drives both — the filename picks
   the view. Concept screens: fields are pre-filled with Dana's
   record and the Save / Cancel buttons return to the dashboard
   without a backend. Mirrors the render-into-#content pattern used
   by confirm.js / workflow.js.
   ============================================================ */
(function () {
  const page = location.pathname.split("/").pop().replace(/\.html$/, "");
  const content = document.getElementById("content");
  if (!content) return;

  const SITES = ["Prairie Line — Fargo, ND", "Prairie Line — Bismarck, ND", "Prairie Line — Grand Forks, ND", "Coteau Equipment — Minot, ND"];

  function field(label, input, wide) {
    return '<div class="form-field' + (wide ? " wide" : "") + '"><label class="form-label">' + label + '</label>' + input + '</div>';
  }
  function input(val, opts) {
    opts = opts || {};
    return '<input class="form-input" type="' + (opts.type || "text") + '" value="' + (val || "") + '"' + (opts.ro ? " readonly" : "") + '>';
  }
  function select(options, current) {
    return '<select class="form-select">' + options.map(o => '<option' + (o === current ? " selected" : "") + '>' + o + '</option>').join("") + '</select>';
  }
  function toggle(title, sub, on) {
    return '<div class="toggle-row"><div class="toggle-copy"><div class="tr-title">' + title + '</div><div class="tr-sub">' + sub + '</div></div>' +
      '<label class="toggle"><input type="checkbox"' + (on ? " checked" : "") + '><span class="track"></span></label></div>';
  }
  function cardHead(swatch, title, meta) {
    return '<div class="card-head"><div class="card-title"><span class="swatch" style="background:' + swatch + '"></span>' + title + '</div>' +
      (meta ? '<div class="card-meta">' + meta + '</div>' : "") + '</div>';
  }
  const actions = save => '<div class="form-actions" style="padding:0 18px 18px;"><a class="btn-lg" href="../index.html">Cancel</a><a class="btn-lg primary" href="../index.html">' + save + '</a></div>';

  let title, html;

  if (page === "settings") {
    title = "Account Settings";
    html =
      '<div class="page-intro"><div><h1>Account Settings</h1><div class="sub">Sign-in, notifications and workspace preferences</div></div></div>' +

      '<div class="card" style="max-width:760px;">' +
        cardHead("var(--steel-blue)", "Sign-in &amp; security", "Last changed 3 months ago") +
        '<div class="form-grid">' +
          field("Email address", input("dana.castellano@prairieline.com", { type: "email" }), true) +
          field("New password", input("", { type: "password" })) +
          field("Confirm new password", input("", { type: "password" })) +
        '</div>' +
        toggle("Two-factor authentication", "Require a code from your phone at sign-in", true) +
      '</div>' +

      '<div class="card" style="max-width:760px;">' +
        cardHead("var(--amber)", "Notifications") +
        toggle("Daily board digest", "Email summary of the day's open work each morning", true) +
        toggle("Work order alerts", "Notify when a job is assigned to you or flagged overdue", true) +
        toggle("Parts backorder updates", "Notify when a backordered part gets a new ETA", false) +
        toggle("Rental returns", "Notify the day a rental unit is due back", true) +
      '</div>' +

      '<div class="card" style="max-width:760px;">' +
        cardHead("var(--field-green)", "Preferences") +
        '<div class="form-grid">' +
          field("Theme", select(["System", "Light", "Dark"], "Light")) +
          field("Units", select(["Imperial (mi, gal, °F)", "Metric (km, L, °C)"], "Imperial (mi, gal, °F)")) +
          field("Default landing page", select(["Dashboard", "Service", "Parts", "Rentals", "Sales", "Reporting"], "Dashboard")) +
          field("Date format", select(["Jul 3, 2026", "07/03/2026", "2026-07-03"], "Jul 3, 2026")) +
        '</div>' +
        actions("Save changes") +
      '</div>';
  } else {
    title = "Your Profile";
    html =
      '<div class="page-intro"><div><h1>Your Profile</h1><div class="sub">Your personal and contact information</div></div></div>' +

      '<div class="card" style="max-width:760px;">' +
        '<div class="acct-hero">' +
          '<div class="ah-av">DC</div>' +
          '<div><div class="ah-name">Dana Castellano</div>' +
          '<div class="ah-role">General Manager · Prairie Line Equipment</div>' +
          '<div class="ah-meta">Employee #PLE-0142 · Member since March 2019</div></div>' +
        '</div>' +
        '<div class="form-grid">' +
          field("First name", input("Dana")) +
          field("Last name", input("Castellano")) +
          field("Job title", input("General Manager")) +
          field("Employee ID", input("PLE-0142", { ro: true })) +
          field("Email", input("dana.castellano@prairieline.com", { type: "email" }), true) +
          field("Mobile phone", input("(701) 555-0142", { type: "tel" })) +
          field("Primary location", select(SITES, "Prairie Line — Fargo, ND")) +
          field("Timezone", select(["Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)", "Eastern Time (ET)"], "Central Time (CT)")) +
        '</div>' +
        actions("Save changes") +
      '</div>';
  }

  content.innerHTML = html;
  document.title = "Fieldbook — " + title;
  const here = document.getElementById("crumb-here");
  if (here) here.textContent = title;
})();
