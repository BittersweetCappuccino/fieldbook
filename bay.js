/* ============================================================
   Technician bay view. Scoped to one tech at one bay: a single
   active job, a live labor clock, and an operation checklist.
   Reads ?wo=<id> so the work order screen's "Open bay view" hands
   off the same job. Data mirrors the manager-side RECORDS but is
   trimmed to what a tech in the bay actually acts on.
   ============================================================ */
const M = 60, H = 3600;
const BAY_JOBS = {
  "88213": {
    tech: "R. Alvarez", init: "RA", bay: "Bay 2 · Service", dept: "service",
    wo: "WO-88213", unit: "Hendricks Farm #4", model: "John Deere 8R 250",
    stamp: { cls: "progress", label: "In Progress" },
    complaint: "Steady hydraulic fluid loss and slow 3-point hitch response under load. Inspect PTO driveline while in the shop.",
    ops: [
      { name: "Hydraulic diagnosis & pressure test", code: "OP-HYD-DIAG", state: "done", logged: 90 * M },
      { name: "SCV coupler seal & return-line R&R", code: "OP-HYD-SCV", state: "active", logged: 180 * M },
      { name: "System bleed & road test under load", code: "OP-HYD-BLEED", state: "pending", logged: 0 },
      { name: "PTO shield R&R (warranty)", code: "OP-PTO-SHLD", state: "blocked", logged: 0, block: "Waiting on part JD-77410 · ETA Thu" }
    ],
    parts: [
      { pn: "RE-52341", pd: "Hydraulic filter kit", st: "ready", stl: "In bin" },
      { pn: "AL-118842", pd: "SCV coupler seal kit", st: "ready", stl: "In bin" },
      { pn: "R-234119", pd: "Return-line fitting", st: "ready", stl: "In bin" },
      { pn: "JD-77410", pd: "PTO shield assembly", st: "backorder", stl: "ETA Thu" }
    ]
  },
  "88231": {
    tech: "R. Alvarez", init: "RA", bay: "Bay 2 · Service", dept: "service",
    wo: "WO-88231", unit: "Halvorsen #3", model: "John Deere 6M 130",
    stamp: { cls: "scheduled", label: "Scheduled" },
    complaint: "Coolant temperature climbing under load; suspected thermostat or water pump. Customer needs it back Friday.",
    ops: [
      { name: "Cooling system diagnosis", code: "OP-COOL-DIAG", state: "pending", logged: 0 },
      { name: "Thermostat & housing R&R", code: "OP-COOL-THRM", state: "pending", logged: 0 }
    ],
    parts: [
      { pn: "RE-61120", pd: "Thermostat kit", st: "ready", stl: "In bin" },
      { pn: "RE-61340", pd: "Coolant, 2 gal", st: "ready", stl: "In bin" }
    ]
  },
  "88190": {
    tech: "J. Okafor", init: "JO", bay: "Bay 4 · Service", dept: "service",
    wo: "WO-88190", unit: "Red River #2", model: "Case IH Magnum 340",
    stamp: { cls: "waiting", label: "Waiting on Parts" },
    complaint: "500-hour scheduled service. Inspection found the hydraulic pump drive coupler worn beyond spec — replace while pump is accessible.",
    ops: [
      { name: "500-hour scheduled service", code: "OP-500HR", state: "done", logged: 240 * M },
      { name: "Hydraulic pump coupler R&R", code: "OP-HYD-CPLR", state: "blocked", logged: 30 * M, block: "Waiting on part CI-88231 · ETA Jul 3" }
    ],
    parts: [
      { pn: "CI-77120", pd: "Engine oil filter", st: "ready", stl: "In bin" },
      { pn: "CI-77250", pd: "Fuel filter, set of 2", st: "ready", stl: "In bin" },
      { pn: "CI-90040", pd: "Hydraulic oil, 20 gal", st: "ready", stl: "In bin" },
      { pn: "CI-88231", pd: "Pump drive coupler", st: "backorder", stl: "ETA Jul 3" }
    ],
    upNext: null
  },
  "88175": {
    tech: "M. Lindqvist", init: "ML", bay: "Bay 1 · Service", dept: "service",
    wo: "WO-88175", unit: "Meadowlark #7", model: "Toro Groundsmaster 4000-D",
    stamp: { cls: "ready", label: "Ready for Pickup" },
    complaint: "Deck belt squealing and slipping; uneven cut height reported by grounds crew.",
    ops: [
      { name: "Deck belt & idler pulley R&R", code: "OP-MOW-BELT", state: "done", logged: 90 * M },
      { name: "Blade balance & test cut", code: "OP-MOW-TEST", state: "done", logged: 30 * M }
    ],
    parts: [
      { pn: "TR-140-9600", pd: "Deck belt, 60\"", st: "ready", stl: "Installed" },
      { pn: "TR-110-6892", pd: "Idler pulley assembly", st: "ready", stl: "Installed" }
    ],
    upNext: null
  },
  "88142": {
    tech: "Unassigned", init: "—", bay: "Unassigned · Warranty", dept: "overdue",
    wo: "WO-88142", unit: "Thorson #1", model: "Kubota M7-172",
    stamp: { cls: "overdue", label: "Overdue" },
    complaint: "Intermittent engine derate and DPF regen faults; loss of power under load. Warranty claim on hold pending unit serial verification.",
    ops: [
      { name: "Engine derate & DPF diagnosis", code: "OP-ENG-DIAG", state: "pending", logged: 0 }
    ],
    parts: [],
    upNext: null
  }
};

/* ---------- state ---------- */
let job, ops, current, clockedIn, sessionStart;
let shiftBase = 3 * H + 41 * M; // ~3h41m into the shift

function loadJob(id) {
  const src = BAY_JOBS[id] || BAY_JOBS["88213"];
  job = src;
  ops = src.ops.map(o => ({ ...o }));
  current = ops.findIndex(o => o.state === "active");
  if (current < 0) current = ops.findIndex(o => o.state === "pending");
  clockedIn = current >= 0 && ops[current].state === "active";
  sessionStart = clockedIn ? Date.now() : null;
}

/* ---------- time formatting ---------- */
function fmtClock(sec) {
  sec = Math.floor(sec);
  const h = Math.floor(sec / H), m = Math.floor((sec % H) / 60), s = sec % 60;
  return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0");
}
function fmtLogged(sec) {
  const h = Math.floor(sec / H), m = Math.floor((sec % H) / 60);
  return h ? h + "h " + m + "m" : m + "m";
}
function curLoggedSec() {
  if (current < 0) return 0;
  return ops[current].logged + (clockedIn ? (Date.now() - sessionStart) / 1000 : 0);
}

/* ---------- render ---------- */
const svg = {
  part: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="4"/></svg>',
  photo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  note: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
  flag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>',
  check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>',
  lock: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
};

function clockBlockHTML() {
  if (ops.every(o => o.state === "done")) {
    return `<div class="bay-clock alldone">
      <div class="co">All operations complete</div>
      <div class="time">✓ Ready for QC</div>
      <div class="co" style="color:var(--slate-light)">Total logged ${fmtLogged(ops.reduce((s, o) => s + o.logged, 0))}</div>
    </div>`;
  }
  const startable = current >= 0 && (ops[current].state === "pending" || ops[current].state === "active");
  if (!startable) {
    const blk = ops.find(o => o.state === "blocked");
    return `<div class="bay-clock alldone">
      <div class="co">Work blocked — waiting on parts</div>
      <div class="opname">${blk ? blk.name : ""}</div>
      <div class="time" style="color:var(--clay-deep)">On hold</div>
      <div class="co" style="color:var(--clay-deep)">${blk ? blk.block : ""}</div>
    </div>`;
  }
  const op = ops[current];
  return `<div class="bay-clock">
    <div class="co">${clockedIn ? "On the clock" : "Current operation"}</div>
    <div class="opname">${op.name}</div>
    <div class="time ${clockedIn ? "running" : ""}" id="labortime">${fmtClock(curLoggedSec())}</div>
    <button class="clock-btn ${clockedIn ? "out" : "in"}" onclick="toggleClock()">${clockedIn ? "◼ Clock Out" : "▶ Clock In"}</button>
    <div><span class="clock-done-link" onclick="completeOp()">✓ Mark operation done</span></div>
  </div>`;
}

function opHTML(o, i) {
  if (o.state === "done") {
    return `<div class="op done"><div class="ck">${svg.check}</div>
      <div class="opmain"><div class="opn">${o.name}</div><div class="opsub">${o.code}</div></div>
      <div class="optime">${fmtLogged(o.logged)}</div></div>`;
  }
  if (o.state === "blocked") {
    return `<div class="op blocked"><div class="lock">${svg.lock}</div>
      <div class="opmain"><div class="opn">${o.name}</div><div class="opsub block">${o.block}</div></div></div>`;
  }
  if (i === current && o.state === "active") {
    return `<div class="op active"><div class="ck" onclick="completeOp()"></div>
      <div class="opmain"><div class="opn">${o.name}</div><div class="opsub">${o.code} · current</div></div>
      <div class="optime">${fmtLogged(Math.floor(curLoggedSec()))}</div></div>`;
  }
  return `<div class="op"><div class="ck"></div>
    <div class="opmain"><div class="opn">${o.name}</div><div class="opsub">${o.code}</div></div>
    <button class="op-start" onclick="startOp(${i})">Start</button></div>`;
}

function stampDot(cls) {
  return { progress: "var(--amber)", waiting: "var(--clay)", ready: "var(--field-green)", overdue: "var(--clay)", scheduled: "var(--steel-blue)" }[cls] || "var(--slate-light)";
}
function queueHTML() {
  const ids = Object.keys(BAY_JOBS).filter(id => BAY_JOBS[id].tech === job.tech);
  if (ids.length <= 1) return "";
  return `<div class="bay-sec" style="margin-top:0">My Jobs<span class="cnt">${ids.length} assigned</span></div>
    <div class="bay-queue">` + ids.map(id => {
    const j = BAY_JOBS[id], cur = j.wo === job.wo;
    return `<a class="qchip ${cur ? "current" : ""}" href="bay.html?wo=${id}">
      <div class="qc-lbl"><span class="qc-dot" style="background:${stampDot(j.stamp.cls)}"></span>${cur ? "Working now" : j.stamp.label}</div>
      <div class="qc-t">${j.model}</div>
      <div class="qc-wo">${j.wo} · ${j.bay.split(" · ")[0]}</div>
    </a>`;
  }).join("") + `</div>`;
}

function render() {
  document.getElementById("ba-init").textContent = job.init;
  document.getElementById("ba-name").textContent = job.tech;
  document.getElementById("ba-bay").textContent = job.bay;
  document.getElementById("ba-back").href = "work-order.html?wo=" + job.wo.replace("WO-", "");

  const partsHTML = job.parts.length
    ? job.parts.map(p => `<div class="bpart"><div class="pn">${p.pn}</div><div class="pd">${p.pd}</div><div class="ps ${p.st}">${p.stl}</div></div>`).join("")
    : `<div class="bpart"><div class="pd" style="color:var(--slate-light);font-style:italic">No parts on this job yet.</div></div>`;

  document.getElementById("scroll").innerHTML = `
    ${queueHTML()}
    <div class="bay-hero ${job.dept === "overdue" ? "dept-overdue" : ""}">
      <div class="hero-top">
        <div><div class="wo">${job.wo} · ${job.model}</div><div class="unit">${job.unit}</div></div>
        <div class="stamp ${job.stamp.cls}">${job.stamp.label}</div>
      </div>
      <div class="bay-complaint"><span class="lbl">Complaint</span>${job.complaint}</div>
    </div>

    ${clockBlockHTML()}

    <div class="bay-actions">
      <div class="qbtn" onclick="toast('Part request sent to Parts desk')">${svg.part}Request part</div>
      <div class="qbtn" onclick="toast('Camera opened (demo)')">${svg.photo}Add photo</div>
      <div class="qbtn" onclick="toast('Note added to work order')">${svg.note}Add note</div>
      <div class="qbtn" onclick="toast('Issue flagged to service manager')">${svg.flag}Flag issue</div>
    </div>

    <div class="bay-sec">Operations<span class="cnt">${ops.filter(o => o.state === "done").length}/${ops.length} done</span></div>
    ${ops.map((o, i) => opHTML(o, i)).join("")}

    <div class="bay-sec">Parts on this job<span class="cnt">${job.parts.length} lines</span></div>
    ${partsHTML}
  `;

  renderBottom();
}

function renderBottom() {
  const remaining = ops.filter(o => o.state !== "done");
  const blocked = ops.find(o => o.state === "blocked");
  let html;
  if (remaining.length === 0) {
    html = `<button class="complete-btn" onclick="completeJob()">Complete Job → QC</button>`;
  } else if (blocked && remaining.every(o => o.state === "blocked")) {
    html = `<button class="complete-btn blocked" onclick="toast('Blocked: ${blocked.block}')">Blocked — can't complete</button>
      <div class="bay-hint">${blocked.block}</div>`;
  } else {
    html = `<button class="complete-btn blocked" onclick="toast('Finish the current operation first')">Complete Job → QC</button>
      <div class="bay-hint">${remaining.length} operation${remaining.length > 1 ? "s" : ""} still open</div>`;
  }
  document.getElementById("bottom").innerHTML = html;
}

/* ---------- interactions ---------- */
function toggleClock() {
  if (current < 0) return;
  if (clockedIn) {
    ops[current].logged = curLoggedSec();
    clockedIn = false;
    sessionStart = null;
  } else {
    ops[current].state = "active";
    clockedIn = true;
    sessionStart = Date.now();
  }
  render();
}

function startOp(i) {
  if (ops[i].state === "blocked" || ops[i].state === "done") return;
  if (clockedIn && current >= 0) ops[current].logged = curLoggedSec();
  current = i;
  ops[i].state = "active";
  clockedIn = true;
  sessionStart = Date.now();
  render();
}

function completeOp() {
  if (current < 0) return;
  ops[current].logged = curLoggedSec();
  ops[current].state = "done";
  clockedIn = false;
  sessionStart = null;
  let next = ops.findIndex(o => o.state === "pending");
  if (next < 0) next = ops.findIndex(o => o.state === "active");
  current = next;
  toast("Operation logged");
  render();
}

function completeJob() {
  toast("Job completed — sent to Quality Check");
}

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- ticking clocks ---------- */
function tick() {
  shiftBase += 1;
  document.getElementById("shiftclock").textContent = fmtClock(shiftBase);
  if (clockedIn) {
    const el = document.getElementById("labortime");
    if (el) el.textContent = fmtClock(curLoggedSec());
  }
}

/* ---------- boot ---------- */
(function () {
  const id = new URLSearchParams(location.search).get("wo") || "88213";
  loadJob(BAY_JOBS[id] ? id : "88213");
  document.title = "Fieldbook — " + job.wo + " · Bay";
  render();
  setInterval(tick, 1000);
})();
