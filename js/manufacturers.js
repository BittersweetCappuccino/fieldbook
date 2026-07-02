/* ============================================================
   Manufacturer integrations — the "Integration log" screen.
   Per-OEM connection health and a capability matrix that is
   honest about how each function actually integrates: real-time
   API, poll, nightly batch, portal-only, or manual. Warranty is
   rarely real-time; inventory is usually poll/batch — the screen
   reflects those constraints rather than implying a uniform
   real-time feed. Plus the integration event log.
   ============================================================ */
const OEMS = [
  {
    code: "JD", name: "John Deere", status: "connected", statusLabel: "Connected",
    auth: "OAuth 2.0 · org-linked · acct PL-Fargo 2210",
    caps: [
      { name: "Parts Orders", mode: "api", modeLabel: "Real-time API", fresh: "2m ago", health: "ok" },
      { name: "Warranty Claims", mode: "portal", modeLabel: "Portal", fresh: "manual submit", health: "warn" },
      { name: "Inventory Feed", mode: "batch", modeLabel: "Nightly batch", fresh: "06:00 today", health: "ok" },
      { name: "Unit Registration", mode: "api", modeLabel: "API", fresh: "2m ago", health: "ok" }
    ]
  },
  {
    code: "CI", name: "Case IH", status: "connected", statusLabel: "Connected",
    auth: "OAuth 2.0 (CNH) · acct PL-Fargo 4471",
    caps: [
      { name: "Parts Orders", mode: "api", modeLabel: "Real-time API", fresh: "5m ago", health: "ok" },
      { name: "Warranty Claims", mode: "portal", modeLabel: "Portal", fresh: "manual submit", health: "warn" },
      { name: "Inventory Feed", mode: "poll", modeLabel: "Poll · 15 min", fresh: "8m ago", health: "ok" },
      { name: "Unit Registration", mode: "batch", modeLabel: "Nightly batch", fresh: "06:00 today", health: "ok" }
    ]
  },
  {
    code: "KB", name: "Kubota", status: "action", statusLabel: "Action Needed",
    auth: "API key · acct PL-Fargo 5590",
    caps: [
      { name: "Parts Orders", mode: "api", modeLabel: "Real-time API", fresh: "4m ago", health: "ok" },
      { name: "Warranty Claims", mode: "batch", modeLabel: "EDI batch", fresh: "1 rejected", health: "error" },
      { name: "Inventory Feed", mode: "poll", modeLabel: "Poll · 30 min", fresh: "22m ago", health: "ok" },
      { name: "Unit Registration", mode: "manual", modeLabel: "Manual", fresh: "—", health: "warn" }
    ],
    note: "Claim WC-2288 rejected — unit serial doesn’t match a warrantable PIN. API token also expires in 3 days; renew credentials."
  },
  {
    code: "TR", name: "Toro", status: "connected", statusLabel: "Connected",
    auth: "OAuth 2.0 · myTurf · acct PL-Fargo 8830",
    caps: [
      { name: "Parts Orders", mode: "api", modeLabel: "Real-time API", fresh: "12m ago", health: "ok" },
      { name: "Warranty Claims", mode: "portal", modeLabel: "Portal", fresh: "manual submit", health: "warn" },
      { name: "Inventory Feed", mode: "api", modeLabel: "Real-time API", fresh: "3h ago", health: "ok" },
      { name: "Unit Registration", mode: "none", modeLabel: "Not supported", fresh: "—", health: "warn" }
    ]
  },
  {
    code: "NH", name: "New Holland", status: "connected", statusLabel: "Connected",
    auth: "OAuth 2.0 (CNH) · acct PL-Fargo 4471",
    caps: [
      { name: "Parts Orders", mode: "api", modeLabel: "Real-time API", fresh: "6m ago", health: "ok" },
      { name: "Warranty Claims", mode: "portal", modeLabel: "Portal", fresh: "manual submit", health: "warn" },
      { name: "Inventory Feed", mode: "poll", modeLabel: "Poll · 15 min", fresh: "10m ago", health: "ok" },
      { name: "Unit Registration", mode: "batch", modeLabel: "Nightly batch", fresh: "06:00 today", health: "ok" }
    ]
  },
  {
    code: "BC", name: "Bobcat", status: "portal", statusLabel: "Portal-Only",
    auth: "Dealer portal login · acct PL-Fargo 3120",
    caps: [
      { name: "Parts Orders", mode: "portal", modeLabel: "Portal", fresh: "manual", health: "warn" },
      { name: "Warranty Claims", mode: "portal", modeLabel: "Portal", fresh: "manual", health: "warn" },
      { name: "Inventory Feed", mode: "manual", modeLabel: "Manual import", fresh: "2 days ago", health: "warn" },
      { name: "Unit Registration", mode: "portal", modeLabel: "Portal", fresh: "manual", health: "warn" }
    ],
    note: "No API available — parts and warranty go through the dealer portal; inventory is imported by hand. Highest-friction integration."
  }
];

const LOG = [
  { code: "JD", html: `<b>John Deere</b> — warranty claim <a class="po-link" href="warranty.html?wc=2285">WC-2285</a> approved, credit posted`, time: "14 minutes ago" },
  { code: "CI", html: `<b>Case IH</b> — parts order <a class="po-link" href="po.html?po=7723">PO-7723</a> shipped, ETA Thu`, time: "1 hour ago" },
  { code: "KB", html: `<b>Kubota</b> — warranty claim <a class="po-link" href="warranty.html?wc=2288">WC-2288</a> rejected, serial mismatch`, time: "Yesterday · 4:12 PM" },
  { code: "JD", html: `<b>John Deere</b> — parts order <a class="po-link" href="po.html?po=7729">PO-7729</a> acknowledged (backorder)`, time: "Yesterday · 6:00 PM" },
  { code: "TR", html: `<b>Toro</b> — parts order <a class="po-link" href="po.html?po=7731">PO-7731</a> submitted`, time: "Jul 1 · 11:20 AM" },
  { code: "TR", html: `<b>Toro</b> — inventory feed synced, 3 units added`, time: "Jul 1 · 9:00 AM" },
  { code: "NH", html: `<b>New Holland</b> — inventory poll, 2 units updated`, time: "Jul 1 · 8:40 AM" },
  { code: "KB", html: `<b>Kubota</b> — API token refresh due in 3 days`, time: "Jul 1 · 7:15 AM" }
];

function renderStats() {
  const connected = OEMS.filter(o => o.status === "connected").length;
  const attention = OEMS.filter(o => o.status !== "connected").length;
  const cards = [
    { cls: "amber", label: "Integrations", value: OEMS.length, sub: "manufacturer connections" },
    { cls: "green", label: "Connected", value: connected, sub: "syncing normally" },
    { cls: "clay", label: "Needs Attention", value: attention, sub: "action or portal-only" },
    { cls: "blue", label: "Events Today", value: LOG.length, sub: "in the integration log" }
  ];
  document.getElementById("mf-stats").innerHTML = cards.map(c => `
    <div class="stat-card ${c.cls}">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      <div class="stat-delta">${c.sub}</div>
    </div>`).join("");
}

function renderOEMs() {
  document.getElementById("mf-oems").innerHTML = OEMS.map(o => `
    <div class="oem-card">
      <div class="oem-head">
        <div class="oem-badge">${o.code}</div>
        <div><div class="oem-name">${o.name}</div><div class="oem-auth">${o.auth}</div></div>
        <div class="oem-status ${o.status}">${o.statusLabel}</div>
      </div>
      ${o.caps.map(c => `
        <div class="cap-row">
          <span class="cap-name">${c.name}</span>
          <span class="cap-mode ${c.mode}">${c.modeLabel}</span>
          <span class="cap-fresh"><span class="cap-dot ${c.health}"></span>${c.fresh}</span>
        </div>`).join("")}
      ${o.note ? `<div class="oem-note">${o.note}</div>` : ""}
    </div>`).join("");
}

function renderLog() {
  document.getElementById("mf-log").innerHTML = LOG.map(e => `
    <div class="feed-row">
      <div class="feed-icon">${e.code}</div>
      <div><div class="feed-text">${e.html}</div><div class="feed-time">${e.time}</div></div>
    </div>`).join("");
}

(function () {
  renderStats();
  renderOEMs();
  renderLog();
})();
