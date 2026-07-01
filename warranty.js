/* ============================================================
   Warranty claim detail. ?wc=<id> selects the record. Reuses the
   work order detail shell with a claim lifecycle (Opened ->
   Submitted -> Under Review -> Approved -> Credit Posted ->
   Closed). Cross-links to the work order, part, and PO involved.
   ============================================================ */
const CLAIMS = {
  "2285": {
    oem: "John Deere", accent: "warranty",
    title: "John Deere 6R 145 — Fuel Injection Pump",
    sub: [["OEM", "John Deere"], ["PIN", "1L06R145_JD08822", true], ["Customer", "Ostrander Farms"], ["Decision", "Jun 30"]],
    stamp: { cls: "ready", label: "Approved" },
    priority: `Credit posted: <b>$842.00</b><br>Approved Jun 30`,
    elapsed: `Submitted Jun 27 · <b>credit posted</b> in 3 days`,
    steps: [
      { name: "Opened", time: "Jun 27 · 8:10a", state: "done" },
      { name: "Submitted", time: "Jun 27 · 2:00p", state: "done" },
      { name: "Under Review", time: "Jun 28", state: "done" },
      { name: "Approved", time: "Jun 30 · 11:00a", state: "done" },
      { name: "Credit Posted", time: "Jun 30 · 3:20p", state: "current" },
      { name: "Closed", time: "—", state: "" }
    ],
    claimed: [
      ["Labor", "Fuel injection pump R&R · op 6R-3120", "2.5h", "$312.50"],
      ["Parts", "Injection pump (RE-49920)", "—", "$498.00"]
    ],
    coverage: [["Coverage", "Powertrain — 2 yr / 2,000 h"], ["In warranty", "Yes · 1,180 h · 14 mo"], ["Deductible", "$0.00"]],
    activity: [
      ["Credit $842.00 posted to dealer warranty account", "Jun 30 · 3:20 PM"],
      ["Claim approved by John Deere", "Jun 30 · 11:00 AM"],
      ["Under review — adjuster assigned", "Jun 28 · 9:00 AM"],
      ["Claim submitted via Service ADVISOR", "Jun 27 · 2:00 PM"]
    ],
    cost: { rows: [["Labor claimed (2.5h)", "$312.50"], ["Parts claimed", "$498.00"], ["Handling allowance", "$31.50"], ["Deductible", "$0.00"]], total: "$842.00" },
    statusNote: { html: `<b>Approved — credit posted.</b> $842.00 posted to the dealer warranty account on Jun 30.` },
    meta: [["OEM", "John Deere"], ["Claim #", "WC-2285"], ["PIN", `<span class="mono">1L06R145_JD08822</span>`], ["Unit", "John Deere 6R 145"], ["Customer", "Ostrander Farms"], ["Linked WO", "WO-88061 (closed)"], ["Submitted", "Jun 27"], ["Decision", "Approved Jun 30"]]
  },
  "2291": {
    oem: "John Deere", accent: "warranty",
    title: "John Deere 8R 250 — PTO Shield (Warranty Op)",
    sub: [["OEM", "John Deere"], ["PIN", "1RW8R250_JD012947", true], ["Customer", "Hendricks Family Farms"], ["WO", "WO-88213"]],
    stamp: { cls: "scheduled", label: "Pre-Authorized" },
    priority: `Est. credit: <b>$100.00</b><br>Submission held — part backordered`,
    elapsed: `Opened Jun 30 · <b>submission held</b>`,
    steps: [
      { name: "Opened", time: "Jun 30 · 3:48p", state: "done" },
      { name: "Submitted", time: "Held", state: "current" },
      { name: "Under Review", time: "—", state: "" },
      { name: "Approved", time: "—", state: "" },
      { name: "Credit Posted", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    claimed: [
      ["Labor", "PTO shield R&R · op 8R-4471", "0.8h", "$100.00"],
      ["Parts", "PTO shield (JD-77410) · supplied", "—", "$0.00"]
    ],
    coverage: [["Coverage", "Powertrain 8R — 2 yr / 2,000 h"], ["In warranty", "Yes · 1,284 h"], ["Deductible", "$0.00"]],
    activity: [
      ["Pre-authorization received for op 8R-4471", "Today · 9:15 AM"],
      ["Claim opened — held pending PTO shield (JD-77410 backordered)", "Jun 30 · 3:48 PM"]
    ],
    cost: { rows: [["Labor (0.8h · op 8R-4471)", "$100.00"], ["Parts (warranty-supplied)", "$0.00"], ["Deductible", "$0.00"]], total: "$100.00 (est.)", note: "Submission held — see status." },
    statusNote: { html: `<b>Pre-authorized.</b> Can't submit until the PTO shield (<a class="po-link" href="part.html?p=JD-77410">JD-77410</a>) is fitted and the op closed — you can't file against an open op. Part is backordered (<a class="po-link" href="po.html?po=7729">PO-7729</a>, ETA Thu).` },
    meta: [["OEM", "John Deere"], ["Claim #", "WC-2291"], ["PIN", `<span class="mono">1RW8R250_JD012947</span>`], ["Unit", "John Deere 8R 250"], ["Customer", "Hendricks Family Farms"], ["Linked WO", `<a class="po-link" href="work-order.html?wo=88213">WO-88213</a>`], ["Submitted", "Held"], ["Decision", "—"]]
  },
  "2288": {
    oem: "Kubota", accent: "overdue",
    title: "Kubota M7-172 — Engine Derate (Warranty)",
    sub: [["OEM", "Kubota"], ["PIN", "⚠ unverified", true], ["Customer", "Thorson Dairy LLC"], ["WO", "WO-88142"]],
    stamp: { cls: "overdue", label: "Rejected" },
    priority: `<b class="warn">Rejected</b><br>Serial does not match a warrantable PIN`,
    elapsed: `Submitted Jun 26 · <b>rejected</b> Jun 30`,
    steps: [
      { name: "Opened", time: "Jun 26 · 11:20a", state: "done" },
      { name: "Submitted", time: "Jun 26 · 11:30a", state: "done" },
      { name: "Under Review", time: "Rejected Jun 30", state: "overdue" },
      { name: "Approved", time: "—", state: "" },
      { name: "Credit Posted", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    claimed: [
      ["Labor", "Engine derate & DPF diagnosis", "2.0h", "$250.00"],
      ["Parts", "— (pending diagnosis)", "—", "$0.00"]
    ],
    coverage: [["Coverage", "Powertrain M7"], ["In warranty", "Unverified — serial mismatch"], ["Deductible", "—"]],
    activity: [
      ["Kubota rejected claim — serial does not match a warrantable PIN", "Yesterday · 4:12 PM"],
      ["Claim submitted", "Jun 26 · 11:30 AM"],
      ["Claim opened for engine derate", "Jun 26 · 11:20 AM"]
    ],
    cost: { rows: [["Labor claimed (2.0h)", "$250.00"], ["Parts", "$0.00"], ["Deductible", "—"]], total: "$0.00 — rejected", note: "No credit until the serial is verified and the claim resubmitted." },
    statusNote: { flagged: true, html: `<b>Rejected — serial mismatch.</b> Kubota returned the claim: the submitted serial doesn't match a warrantable PIN. Verify the serial on the frame plate and resubmit. Blocks <a class="po-link" href="work-order.html?wo=88142">WO-88142</a>.` },
    meta: [["OEM", "Kubota"], ["Claim #", "WC-2288"], ["PIN", `<span class="warn">⚠ unverified</span>`, "warn"], ["Unit", "Kubota M7-172"], ["Customer", "Thorson Dairy LLC"], ["Linked WO", `<a class="po-link" href="work-order.html?wo=88142">WO-88142</a>`], ["Submitted", "Jun 26"], ["Decision", "Rejected Jun 30"]]
  }
};

/* ---------- render helpers ---------- */
function subHTML(sub) {
  return sub.map(([k, v, mono]) => `<span>${k}: <b${mono ? ' class="mono"' : ''}>${v}</b></span>`).join("");
}
function stepsHTML(steps) {
  return steps.map(s => `<div class="step ${s.state}"><span class="node"></span><div class="step-name">${s.name}</div><div class="step-time">${s.time}</div></div>`).join("");
}
function kvLines(rows) {
  return rows.map(([k, v, warn]) => `<div class="meta-row"><span class="k">${k}</span><span class="v${warn ? " " + warn : ""}">${v}</span></div>`).join("");
}
function claimedHTML(rows) {
  return rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="num">${r[2]}</td><td class="num">${r[3]}</td></tr>`).join("");
}
function activityHTML(rows) {
  return rows.map(([text, time]) => `<div class="act-row">
    <div class="act-rail"><span class="act-node warranty"></span></div>
    <div><div class="act-text">${text}</div><div class="act-time">${time}</div></div></div>`).join("");
}

function render(rec) {
  const c = rec.cost;
  document.getElementById("content").innerHTML = `
    <div class="wo-head ${rec.accent === "overdue" ? "dept-overdue" : "dept-warranty"}">
      <div class="wo-head-l">
        <div class="wo-id-row"><span class="wo-id">${rec.wc}</span><span class="wo-bay">WARRANTY CLAIM · ${rec.oem}</span></div>
        <div class="wo-title">${rec.title}</div>
        <div class="wo-sub">${subHTML(rec.sub)}</div>
      </div>
      <div class="wo-head-r">
        <div class="stamp ${rec.stamp.cls}">${rec.stamp.label}</div>
        <div class="wo-priority">${rec.priority}</div>
      </div>
    </div>

    <div class="lifecycle">
      <div class="lifecycle-head"><div class="section-title">Claim Lifecycle</div><div class="elapsed">${rec.elapsed}</div></div>
      <div class="stepper">${stepsHTML(rec.steps)}</div>
    </div>

    <div class="wo-body">
      <div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--steel-blue)"></span>Claimed Amounts</div></div>
          <div class="table-wrap"><table class="ltable">
            <thead><tr><th>Type</th><th>Detail</th><th class="num">Hrs</th><th class="num">Amount</th></tr></thead>
            <tbody>${claimedHTML(rec.claimed)}</tbody>
          </table></div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>Coverage</div></div>
          <div class="meta-body">${kvLines(rec.coverage)}</div>
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--charcoal-3)"></span>Activity Log</div></div>
          <div class="activity">${activityHTML(rec.activity)}</div>
        </div>
      </div>

      <div>
        <div class="side-card">
          <div class="side-head">Claim Value</div>
          <div class="cost-body">
            ${c.rows.map(([l, v]) => `<div class="cost-row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join("")}
            <div class="cost-total"><span class="lbl">Net Credit</span><span class="val">${c.total}</span></div>
            ${c.note ? `<div class="cost-note">${c.note}</div>` : ""}
          </div>
        </div>
        <div class="side-card">
          <div class="side-head">Status</div>
          <div class="warr-body"><div class="warr-status${rec.statusNote.flagged ? " flagged" : ""}">${rec.statusNote.html}</div></div>
        </div>
        <div class="side-card">
          <div class="side-head">Unit &amp; Claim</div>
          <div class="meta-body">${kvLines(rec.meta)}</div>
        </div>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const id = new URLSearchParams(location.search).get("wc");
  const rec = CLAIMS[id] || CLAIMS["2285"];
  rec.wc = "WC-" + (CLAIMS[id] ? id : "2285");
  render(rec);
  document.title = "Fieldbook — " + rec.wc;
  document.getElementById("crumb-here").textContent = rec.wc;
})();
