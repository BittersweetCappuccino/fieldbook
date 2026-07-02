/* ============================================================
   Work order records — keyed by ID. The detail screen is one
   template; ?wo=<id> selects which record to render. Continuity
   with the dashboard tickets (index.html) and the manufacturer
   feed is intentional (see WO-88142 / Kubota serial flag).
   ============================================================ */
const RECORDS = {
  "88213": {
    dept: "service",
    bay: "BAY 2 · CUSTOMER-PAY + WARRANTY",
    title: "John Deere 8R 250 — Hydraulic Leak &amp; PTO Inspection",
    sub: [["Unit", "Hendricks Farm #4"], ["PIN", "1RW8R250_JD012947", true], ["Customer", "Hendricks Family Farms"], ["Opened", "Jun 28"]],
    stamp: { cls: "progress", label: "In Progress" },
    priority: `Promised: <b>Jul 3, 5:00 PM</b><br>2 days remaining`,
    elapsed: `Age <b>3d 4h</b> · Labor logged <b>6.5h</b> of 9.0h est.`,
    steps: [
      { name: "Checked In", time: "Jun 28 · 9:12a", state: "done" },
      { name: "Diagnosis", time: "Jun 28 · 2:40p", state: "done" },
      { name: "Estimate", time: "Jun 29 · 8:05a", state: "done" },
      { name: "Authorized", time: "Jun 29 · 11:20a", state: "done" },
      { name: "Labor", time: "In progress", state: "current" },
      { name: "Quality Check", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    threeC: {
      complaint: "Operator reports steady hydraulic fluid loss and slow 3-point hitch response under load. Requests PTO driveline inspected while in the shop.",
      cause: "Failed SCV coupler O-ring and weeping return-line fitting at the rear valve block. PTO shield worn but serviceable — driveline splines within spec.",
      correction: `<span class="muted">In progress — </span>Replace SCV coupler seal kit and return-line fitting, refill/bleed hydraulic system, replace worn PTO shield. Road-test under load before QC.`
    },
    laborTech: "Tech: R. Alvarez · Bay 2",
    labor: [
      { op: "Hydraulic diagnosis &amp; pressure test", code: "OP-HYD-DIAG · Straight time", est: "1.5h", actual: "1.5h", tag: ["done", "Complete"], amount: "$187.50" },
      { op: "SCV coupler seal &amp; return-line R&amp;R", code: "OP-HYD-SCV · Flat rate 3.2h", est: "3.2h", actual: "3.0h", tag: ["active", "In progress"], amount: "$400.00" },
      { op: "System bleed &amp; road test under load", code: "OP-HYD-BLEED · Straight time", est: "1.5h", actual: "2.0h", tag: ["active", "In progress"], amount: "$250.00" },
      { op: "PTO shield R&amp;R (warranty)", code: "OP-PTO-SHLD · JD warranty op 8R-4471", est: "0.8h", actual: "—", tag: ["warranty", "Warranty"], amount: "$100.00" }
    ],
    partsMeta: "4 lines · 1 backordered",
    parts: [
      { num: "RE-52341", desc: "Hydraulic filter kit", qty: "1", tag: ["done", "Picked"], ext: "$84.20" },
      { num: "AL-118842", desc: "SCV coupler seal kit", qty: "1", tag: ["done", "Picked"], ext: "$46.75" },
      { num: "R-234119", desc: "Return-line fitting, 1/2\" JIC", qty: "2", tag: ["done", "Picked"], ext: "$31.40" },
      { num: "JD-77410", desc: "PTO shield assembly (warranty)", qty: "1", tag: ["backorder", "Backordered · ETA Thu"], ext: "$0.00" }
    ],
    activity: [
      { node: "labor", text: "<b>R. Alvarez</b> clocked onto SCV seal R&amp;R", time: "Today · 10:42 AM" },
      { node: "warranty", text: "<b>Warranty</b> — JD claim WC-2291 pre-authorized for PTO shield op 8R-4471", time: "Today · 9:15 AM" },
      { node: "parts", text: "<b>Parts</b> — JD-77410 placed on backorder, ETA Thursday (blocks warranty op)", time: "Yesterday · 3:48 PM" },
      { node: "", text: "<b>D. Castellano</b> authorized estimate — customer approved by phone", time: "Jun 29 · 11:20 AM" },
      { node: "", text: "<b>R. Alvarez</b> completed diagnosis, added cause &amp; correction", time: "Jun 28 · 2:40 PM" }
    ],
    cost: {
      rows: [["Labor (6.5h billed)", "$837.50"], ["Parts", "$162.35"], ["Shop supplies", "$28.00"], ["Est. tax", "$74.60"]],
      customer: "$1,002.45", warranty: "$100.00", total: "$1,102.45"
    },
    auth: {
      dot: "ok", state: "Authorized up to $1,150",
      note: "Approved by phone; e-signature captured at check-in. Re-authorization required if estimate exceeds cap by more than 10%.",
      sigName: "M. Hendricks", sigMeta: "Jun 29 · 11:20 AM · verbal + SMS confirm"
    },
    warranty: {
      lines: [["OEM", "John Deere"], ["Claim #", `<a class="po-link" href="warranty.html?wc=2291">WC-2291</a>`], ["Coverage", "Powertrain 8R"], ["Op code", "8R-4471"]],
      status: `<b>Pre-authorized.</b> Submission held until PTO shield (JD-77410) is fitted and labor closed. Claim cannot be filed against an open op.`
    },
    meta: [["Model", "John Deere 8R 250"], ["PIN", `<span class="mono">1RW8R250_JD012947</span>`], ["Engine hrs", `<span class="mono">1,284 h</span>`], ["Customer", "Hendricks Family Farms"], ["Contact", "Marcus Hendricks"], ["Acct terms", "Net 30 · In good standing"]]
  },

  "88190": {
    dept: "service",
    bay: "BAY 4 · CUSTOMER-PAY",
    title: "Case IH Magnum 340 — 500-Hour Scheduled Service",
    sub: [["Unit", "Red River #2"], ["PIN", "ZFRE05512", true], ["Customer", "Red River Grain Co."], ["Opened", "Jun 27"]],
    stamp: { cls: "waiting", label: "Waiting on Parts" },
    priority: `Promised: <b>Jul 4, 12:00 PM</b><br><b class="warn">Blocked — waiting on parts</b>`,
    elapsed: `Age <b>4d 2h</b> · Labor logged <b>4.5h</b> of 6.0h est.`,
    steps: [
      { name: "Checked In", time: "Jun 27 · 8:30a", state: "done" },
      { name: "Inspection", time: "Jun 27 · 1:15p", state: "done" },
      { name: "Estimate", time: "Jun 27 · 4:40p", state: "done" },
      { name: "Authorized", time: "Jun 28 · 9:05a", state: "done" },
      { name: "Labor", time: "Held on parts", state: "current" },
      { name: "Quality Check", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    threeC: {
      complaint: "500-hour scheduled maintenance interval due. Customer wants full service completed before harvest season.",
      cause: "Routine interval. Inspection also found the hydraulic pump drive coupler worn beyond spec — recommended replacement while the pump is accessible.",
      correction: `<span class="muted">In progress — </span>Complete 500-hr service (oils, filters, inspections) and replace hydraulic pump drive coupler. Held pending backordered coupler (ETA Jul 3).`
    },
    laborTech: "Tech: J. Okafor · Bay 4",
    labor: [
      { op: "500-hour scheduled service", code: "OP-500HR · Flat rate 4.0h", est: "4.0h", actual: "4.0h", tag: ["done", "Complete"], amount: "$500.00" },
      { op: "Hydraulic pump drive coupler R&amp;R", code: "OP-HYD-CPLR · Flat rate 1.5h", est: "1.5h", actual: "0.5h", tag: ["hold", "Held — parts"], amount: "$62.50" }
    ],
    partsMeta: "4 lines · 1 backordered",
    parts: [
      { num: "CI-77120", desc: "Engine oil filter", qty: "1", tag: ["done", "Picked"], ext: "$28.50" },
      { num: "CI-77250", desc: "Fuel filter, set of 2", qty: "1", tag: ["done", "Picked"], ext: "$64.90" },
      { num: "CI-90040", desc: "Hydraulic oil, 20 gal", qty: "1", tag: ["done", "Picked"], ext: "$210.00" },
      { num: "CI-88231", desc: "Hydraulic pump drive coupler", qty: "1", tag: ["backorder", "Backordered · ETA Jul 3"], ext: "$45.50" }
    ],
    activity: [
      { node: "parts", text: "<b>Parts</b> — CI-88231 pump coupler backordered, ETA Jul 3 (blocks completion)", time: "Yesterday · 2:10 PM" },
      { node: "", text: "<b>D. Castellano</b> authorized 500-hr service + coupler replacement", time: "Jun 28 · 9:05 AM" },
      { node: "labor", text: "<b>J. Okafor</b> began 500-hr service checklist", time: "Jun 27 · 1:40 PM" },
      { node: "", text: "Unit checked in at 512 engine hours", time: "Jun 27 · 8:30 AM" }
    ],
    cost: {
      rows: [["Labor (4.5h billed)", "$562.50"], ["Parts", "$348.90"], ["Shop supplies", "$22.00"], ["Est. tax", "$56.20"]],
      customer: "$989.60", warranty: "$0.00", total: "$989.60"
    },
    auth: {
      dot: "ok", state: "Authorized up to $1,100",
      note: "Approved by phone at check-in; coupler replacement approved as an added line. Re-auth required beyond the 10% cap.",
      sigName: "R. Voss", sigMeta: "Jun 28 · 9:05 AM · verbal + SMS confirm"
    },
    warranty: null,
    meta: [["Model", "Case IH Magnum 340"], ["PIN", `<span class="mono">ZFRE05512</span>`], ["Engine hrs", `<span class="mono">512 h</span>`], ["Customer", "Red River Grain Co."], ["Contact", "Roland Voss"], ["Acct terms", "Net 30 · In good standing"]]
  },

  "88175": {
    dept: "service",
    bay: "BAY 1 · CUSTOMER-PAY",
    title: "Toro Groundsmaster 4000-D — Deck Belt Replacement",
    sub: [["Unit", "Meadowlark #7"], ["Serial", "40657-31204", true], ["Customer", "Meadowlark Golf Club"], ["Opened", "Jun 30"]],
    stamp: { cls: "ready", label: "Ready for Pickup" },
    priority: `<b>Completed Jun 30</b><br>Awaiting customer pickup`,
    elapsed: `Age <b>1d 6h</b> · Labor logged <b>2.0h</b> of 2.0h est.`,
    steps: [
      { name: "Checked In", time: "Jun 30 · 7:50a", state: "done" },
      { name: "Diagnosis", time: "Jun 30 · 8:30a", state: "done" },
      { name: "Estimate", time: "Jun 30 · 9:10a", state: "done" },
      { name: "Authorized", time: "Jun 30 · 9:40a", state: "done" },
      { name: "Labor", time: "Jun 30 · 2:15p", state: "done" },
      { name: "Quality Check", time: "Jun 30 · 3:00p", state: "done" },
      { name: "Invoiced", time: "Ready", state: "current" },
      { name: "Closed", time: "—", state: "" }
    ],
    threeC: {
      complaint: "Mower deck belt squealing and slipping; uneven cut height reported by the grounds crew.",
      cause: "Deck drive belt glazed and stretched past the tension range; idler pulley bearing dry and notchy.",
      correction: "Replaced 60\" deck drive belt and idler pulley, re-tensioned, balanced blades, and verified even cut height on a test strip. Ready for pickup."
    },
    laborTech: "Tech: M. Lindqvist · Bay 1",
    labor: [
      { op: "Deck belt &amp; idler pulley R&amp;R", code: "OP-MOW-BELT · Flat rate 1.5h", est: "1.5h", actual: "1.5h", tag: ["done", "Complete"], amount: "$187.50" },
      { op: "Blade balance &amp; test cut", code: "OP-MOW-TEST · Straight time", est: "0.5h", actual: "0.5h", tag: ["done", "Complete"], amount: "$62.50" }
    ],
    partsMeta: "2 lines · all in stock",
    parts: [
      { num: "TR-140-9600", desc: "Deck belt, 60\"", qty: "1", tag: ["done", "Installed"], ext: "$96.80" },
      { num: "TR-110-6892", desc: "Idler pulley assembly", qty: "1", tag: ["done", "Installed"], ext: "$49.50" }
    ],
    activity: [
      { node: "", text: "<b>Invoice INV-33108</b> generated — ready for customer pickup", time: "Jun 30 · 3:05 PM" },
      { node: "labor", text: "<b>QC passed</b> — verified even cut height on test strip", time: "Jun 30 · 3:00 PM" },
      { node: "labor", text: "<b>M. Lindqvist</b> completed deck belt &amp; idler R&amp;R", time: "Jun 30 · 2:15 PM" },
      { node: "", text: "<b>D. Castellano</b> authorized estimate — customer approved in person", time: "Jun 30 · 9:40 AM" }
    ],
    cost: {
      rows: [["Labor (2.0h)", "$250.00"], ["Parts", "$146.30"], ["Shop supplies", "$12.00"], ["Est. tax", "$30.55"]],
      customer: "$438.85", warranty: "$0.00", total: "$438.85"
    },
    auth: {
      dot: "ok", state: "Authorized · work complete",
      note: "Approved in person at drop-off. Invoice generated and ready for pickup.",
      sigName: "P. Nowak", sigMeta: "Jun 30 · 9:40 AM · signed in shop"
    },
    warranty: null,
    meta: [["Model", "Toro Groundsmaster 4000-D"], ["Serial", `<span class="mono">40657-31204</span>`], ["Engine hrs", `<span class="mono">3,140 h</span>`], ["Customer", "Meadowlark Golf Club"], ["Contact", "Petra Nowak"], ["Acct terms", "Net 15 · In good standing"]]
  },

  "88142": {
    dept: "overdue",
    bay: "UNASSIGNED · WARRANTY",
    title: "Kubota M7-172 — Warranty Claim, Engine Diagnostics",
    sub: [["Unit", "Thorson #1"], ["PIN", "⚠ unverified", true], ["Customer", "Thorson Dairy LLC"], ["Opened", "Jun 26"]],
    stamp: { cls: "overdue", label: "Overdue" },
    priority: `<b class="warn">Overdue — 5 days open</b><br>Needs technician assignment`,
    elapsed: `Age <b>5d 1h</b> · Labor logged <b>0.0h</b> — not started`,
    steps: [
      { name: "Checked In", time: "Jun 26 · 10:05a", state: "done" },
      { name: "Diagnosis", time: "Stalled · unassigned", state: "overdue" },
      { name: "Estimate", time: "—", state: "" },
      { name: "Authorized", time: "—", state: "" },
      { name: "Labor", time: "—", state: "" },
      { name: "Quality Check", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    threeC: {
      complaint: "Intermittent engine derate and DPF regeneration faults; loss of power under load, reported over the last two weeks.",
      cause: `<span class="muted">Pending — </span>Awaiting technician assignment and Kubota fault-code guidance. Warranty claim currently blocked on unit serial verification.`,
      correction: `<span class="muted">Not started.</span>`
    },
    laborTech: "Tech: Unassigned",
    labor: [
      { op: "Engine derate &amp; DPF diagnosis (warranty)", code: "OP-ENG-DIAG · Kubota warranty", est: "2.0h", actual: "—", tag: ["hold", "Not started"], amount: "$250.00" }
    ],
    partsMeta: "0 lines · pending diagnosis",
    parts: [],
    activity: [
      { node: "warranty", text: "<b>Kubota</b> — claim WC-2288 flagged, missing/invalid unit serial #", time: "Yesterday · 4:12 PM" },
      { node: "", text: "<b>Escalated</b> — 5 days open, still unassigned", time: "Yesterday · 8:00 AM" },
      { node: "warranty", text: "<b>Warranty</b> claim WC-2288 opened for engine derate", time: "Jun 26 · 11:20 AM" },
      { node: "", text: "Unit checked in — customer reports intermittent power loss", time: "Jun 26 · 10:05 AM" }
    ],
    cost: {
      rows: [["Labor (est 2.0h)", "$250.00"], ["Parts", "$0.00"], ["Est. tax", "$0.00"]],
      customer: "$0.00", warranty: "$250.00", total: "$250.00",
      note: "Estimated. Billed to warranty — no customer charge. Claim on hold pending serial verification."
    },
    auth: {
      dot: "hold", state: "Warranty — no customer charge",
      note: "Customer authorization not required; work billed to Kubota under warranty. Claim approval pending a valid unit serial.",
      sigName: null
    },
    warranty: {
      flagged: true,
      lines: [["OEM", "Kubota"], ["Claim #", `<a class="po-link" href="warranty.html?wc=2288">WC-2288</a>`], ["Coverage", "Powertrain M7"], ["Op code", "pending"]],
      status: `<b>Flagged — rejected.</b> Kubota returned the claim: the submitted unit serial does not match a warrantable PIN. Verify the serial on the frame plate and resubmit; the op cannot proceed until the unit is identified.`
    },
    meta: [["Model", "Kubota M7-172"], ["PIN", `<span class="warn">⚠ Serial unverified</span>`, "warn"], ["Engine hrs", `<span class="mono">892 h</span>`], ["Customer", "Thorson Dairy LLC"], ["Contact", "Erik Thorson"], ["Acct terms", "Net 30 · In good standing"]]
  },

  "88221": {
    dept: "service",
    bay: "BAY 3 · CUSTOMER-PAY",
    title: "New Holland T6.180 — No-Start, Electrical Diagnosis",
    sub: [["Unit", "Coteau Dairy #2"], ["PIN", "HCA6180_NH04471", true], ["Customer", "Coteau Dairy Co-op"], ["Opened", "Jun 30"]],
    stamp: { cls: "progress", label: "In Progress" },
    priority: `Promised: <b>Jul 2, 3:00 PM</b><br>1 day remaining`,
    elapsed: `Age <b>1d 6h</b> · Labor logged <b>2.0h</b> of 3.0h est.`,
    steps: [
      { name: "Checked In", time: "Jun 30 · 3:30p", state: "done" },
      { name: "Diagnosis", time: "Jul 1 · 8:40a", state: "done" },
      { name: "Estimate", time: "Jul 1 · 9:10a", state: "done" },
      { name: "Authorized", time: "Jul 1 · 9:35a", state: "done" },
      { name: "Labor", time: "In progress", state: "current" },
      { name: "Quality Check", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    threeC: {
      complaint: "Intermittent no-start; dash warning lights flicker while cranking. Worse in the morning.",
      cause: "Corroded main ground strap and a failing starter relay. Harness checked and ruled out.",
      correction: `<span class="muted">In progress — </span>Replace ground strap and starter relay, load-test the charging system, and verify a reliable cold start.`
    },
    laborTech: "Tech: T. Nguyen · Bay 3",
    labor: [
      { op: "Electrical no-start diagnosis", code: "OP-ELE-DIAG · Straight time", est: "1.5h", actual: "2.0h", tag: ["active", "In progress"], amount: "$250.00" },
      { op: "Ground strap &amp; starter relay R&amp;R", code: "OP-ELE-RLY · Flat rate 1.0h", est: "1.0h", actual: "—", tag: ["active", "In progress"], amount: "$125.00" }
    ],
    partsMeta: "2 lines · all in stock",
    parts: [
      { num: "NH-44120", desc: "Starter relay", qty: "1", tag: ["done", "Picked"], ext: "$62.40" },
      { num: "NH-33887", desc: "Ground strap kit", qty: "1", tag: ["done", "Picked"], ext: "$18.90" }
    ],
    activity: [
      { node: "labor", text: "<b>T. Nguyen</b> clocked onto electrical diagnosis", time: "Today · 9:20 AM" },
      { node: "", text: "<b>D. Castellano</b> authorized diagnosis + repair", time: "Jul 1 · 9:35 AM" },
      { node: "", text: "Unit checked in — customer reports intermittent no-start", time: "Jun 30 · 3:30 PM" }
    ],
    cost: {
      rows: [["Labor (2.0h billed)", "$250.00"], ["Parts", "$81.30"], ["Shop supplies", "$12.00"], ["Est. tax", "$20.65"]],
      customer: "$363.95", warranty: "$0.00", total: "$363.95"
    },
    auth: {
      dot: "ok", state: "Authorized up to $500",
      note: "Approved by phone at check-in. Re-auth required beyond the 10% cap.",
      sigName: "L. Coteau", sigMeta: "Jul 1 · 9:35 AM · verbal + SMS confirm"
    },
    warranty: null,
    meta: [["Model", "New Holland T6.180"], ["PIN", `<span class="mono">HCA6180_NH04471</span>`], ["Engine hrs", `<span class="mono">2,410 h</span>`], ["Customer", "Coteau Dairy Co-op"], ["Contact", "Lucille Coteau"], ["Acct terms", "Net 30 · In good standing"]]
  },

  "88205": {
    dept: "service",
    bay: "BAY 5 · CUSTOMER-PAY",
    title: "Bobcat S650 — Hydraulic Quick-Attach Repair",
    sub: [["Unit", "Sundquist #6"], ["Serial", "AHGM11342", true], ["Customer", "Sundquist Excavating"], ["Opened", "Jun 29"]],
    stamp: { cls: "ready", label: "Ready for Pickup" },
    priority: `<b>Completed Jun 30</b><br>Awaiting customer pickup`,
    elapsed: `Age <b>1d 8h</b> · Labor logged <b>2.5h</b> of 2.5h est.`,
    steps: [
      { name: "Checked In", time: "Jun 29 · 8:10a", state: "done" },
      { name: "Diagnosis", time: "Jun 29 · 9:20a", state: "done" },
      { name: "Estimate", time: "Jun 29 · 9:55a", state: "done" },
      { name: "Authorized", time: "Jun 29 · 10:15a", state: "done" },
      { name: "Labor", time: "Jun 30 · 2:40p", state: "done" },
      { name: "Quality Check", time: "Jun 30 · 3:55p", state: "done" },
      { name: "Invoiced", time: "Ready", state: "current" },
      { name: "Closed", time: "—", state: "" }
    ],
    threeC: {
      complaint: "Hydraulic quick-attach not locking; attachments releasing under load — flagged as a safety concern.",
      cause: "Failed quick-attach cylinder seals and a cracked lock-pin bushing.",
      correction: "Rebuilt the quick-attach cylinder, replaced the lock-pin bushing, and tested lock/unlock under load — verified secure. Ready for pickup."
    },
    laborTech: "Tech: D. Berg · Bay 5",
    labor: [
      { op: "Quick-attach cylinder rebuild", code: "OP-HYD-QA · Flat rate 2.0h", est: "2.0h", actual: "2.0h", tag: ["done", "Complete"], amount: "$250.00" },
      { op: "Function test under load", code: "OP-HYD-TEST · Straight time", est: "0.5h", actual: "0.5h", tag: ["done", "Complete"], amount: "$62.50" }
    ],
    partsMeta: "2 lines · all in stock",
    parts: [
      { num: "BC-77231", desc: "Quick-attach seal kit", qty: "1", tag: ["done", "Installed"], ext: "$58.60" },
      { num: "BC-40119", desc: "Lock-pin bushing", qty: "1", tag: ["done", "Installed"], ext: "$22.30" }
    ],
    activity: [
      { node: "", text: "<b>Invoice INV-33121</b> generated — ready for pickup", time: "Jun 30 · 4:10 PM" },
      { node: "labor", text: "<b>QC passed</b> — verified lock under load", time: "Jun 30 · 3:55 PM" },
      { node: "labor", text: "<b>D. Berg</b> completed cylinder rebuild", time: "Jun 30 · 2:40 PM" },
      { node: "", text: "<b>D. Castellano</b> authorized repair — approved in person", time: "Jun 29 · 10:15 AM" }
    ],
    cost: {
      rows: [["Labor (2.5h)", "$312.50"], ["Parts", "$80.90"], ["Shop supplies", "$14.00"], ["Est. tax", "$24.35"]],
      customer: "$431.75", warranty: "$0.00", total: "$431.75"
    },
    auth: {
      dot: "ok", state: "Authorized · work complete",
      note: "Approved in person at drop-off. Invoice generated and ready for pickup.",
      sigName: "K. Sundquist", sigMeta: "Jun 29 · 10:15 AM · signed in shop"
    },
    warranty: null,
    meta: [["Model", "Bobcat S650"], ["Serial", `<span class="mono">AHGM11342</span>`], ["Engine hrs", `<span class="mono">1,905 h</span>`], ["Customer", "Sundquist Excavating"], ["Contact", "Karl Sundquist"], ["Acct terms", "Net 30 · In good standing"]]
  },

  "88231": {
    dept: "service",
    bay: "SCHEDULED · CUSTOMER-PAY",
    title: "John Deere 6M 130 — Cooling System Diagnosis &amp; Thermostat",
    sub: [["Unit", "Halvorsen #3"], ["PIN", "1L06130_JD22190", true], ["Customer", "Halvorsen Farms"], ["Opened", "Jul 1"]],
    stamp: { cls: "scheduled", label: "Scheduled" },
    priority: `Scheduled for <b>Jul 2, 8:00 AM</b><br>Not yet started`,
    elapsed: `Age <b>4h</b> · Labor logged <b>0.0h</b> — not started`,
    steps: [
      { name: "Checked In", time: "Jul 1 · 10:30a", state: "done" },
      { name: "Diagnosis", time: "Scheduled Jul 2", state: "current" },
      { name: "Estimate", time: "—", state: "" },
      { name: "Authorized", time: "Jul 1 · 11:00a", state: "done" },
      { name: "Labor", time: "—", state: "" },
      { name: "Quality Check", time: "—", state: "" },
      { name: "Invoiced", time: "—", state: "" },
      { name: "Closed", time: "—", state: "" }
    ],
    threeC: {
      complaint: "Coolant temperature climbing under load; suspected thermostat or water pump. Customer needs it back Friday.",
      cause: `<span class="muted">Pending — </span>Cooling system diagnosis scheduled for Jul 2.`,
      correction: `<span class="muted">Not started. </span>Plan: diagnose cooling system, replace thermostat and housing, then pressure-test.`
    },
    laborTech: "Tech: R. Alvarez · Bay 2 (staged)",
    labor: [
      { op: "Cooling system diagnosis", code: "OP-COOL-DIAG · Straight time", est: "1.0h", actual: "—", tag: ["hold", "Scheduled"], amount: "$125.00" },
      { op: "Thermostat &amp; housing R&amp;R", code: "OP-COOL-THRM · Flat rate 1.5h", est: "1.5h", actual: "—", tag: ["hold", "Scheduled"], amount: "$187.50" }
    ],
    partsMeta: "2 lines · staged",
    parts: [
      { num: "RE-61120", desc: "Thermostat kit", qty: "1", tag: ["done", "Staged"], ext: "$46.80" },
      { num: "RE-61340", desc: "Coolant, 2 gal", qty: "1", tag: ["done", "Staged"], ext: "$28.40" }
    ],
    activity: [
      { node: "", text: "<b>D. Castellano</b> scheduled job for Jul 2, 8:00 AM", time: "Jul 1 · 11:00 AM" },
      { node: "", text: "Unit checked in — customer reports coolant temp climbing", time: "Jul 1 · 10:30 AM" }
    ],
    cost: {
      rows: [["Labor (est 2.5h)", "$312.50"], ["Parts", "$75.20"], ["Shop supplies", "$10.00"], ["Est. tax", "$23.90"]],
      customer: "$421.60", warranty: "$0.00", total: "$421.60",
      note: "Estimated — work scheduled, not yet started."
    },
    auth: {
      dot: "ok", state: "Authorized up to $550",
      note: "Approved at booking; customer needs the unit back Friday.",
      sigName: "P. Halvorsen", sigMeta: "Jul 1 · 11:00 AM · verbal + SMS confirm"
    },
    warranty: null,
    meta: [["Model", "John Deere 6M 130"], ["PIN", `<span class="mono">1L06130_JD22190</span>`], ["Engine hrs", `<span class="mono">640 h</span>`], ["Customer", "Halvorsen Farms"], ["Contact", "Pers Halvorsen"], ["Acct terms", "Net 30 · In good standing"]]
  }
};

/* ---------- render helpers ---------- */
function subHTML(sub) {
  return sub.map(([k, v, mono]) => `<span>${k}: <b${mono ? ' class="mono"' : ''}>${v}</b></span>`).join("");
}
function stepsHTML(steps) {
  return steps.map(s => `<div class="step ${s.state}"><span class="node"></span><div class="step-name">${s.name}</div><div class="step-time">${s.time}</div></div>`).join("");
}
function laborHTML(labor) {
  return labor.map(l => `<tr>
    <td><div class="op-name">${l.op}</div><div class="sub code">${l.code}</div></td>
    <td class="num">${l.est}</td><td class="num">${l.actual}</td>
    <td><span class="tag ${l.tag[0]}">${l.tag[1]}</span></td>
    <td class="num">${l.amount}</td></tr>`).join("");
}
function partsHTML(parts) {
  if (!parts.length) return `<tr><td colspan="5" class="empty">No parts added — pending diagnosis.</td></tr>`;
  return parts.map(p => `<tr>
    <td class="code">${p.num}</td><td>${p.desc}</td><td class="num">${p.qty}</td>
    <td><span class="tag ${p.tag[0]}">${p.tag[1]}</span></td>
    <td class="num">${p.ext}</td></tr>`).join("");
}
function activityHTML(rows) {
  return rows.map(a => `<div class="act-row">
    <div class="act-rail"><span class="act-node ${a.node}"></span></div>
    <div><div class="act-text">${a.text}</div><div class="act-time">${a.time}</div></div></div>`).join("");
}
function costChipsHTML(c) {
  if (c.warranty && c.warranty !== "$0.00") {
    return `<div class="cost-chip customer"><div class="clbl">Customer Pay</div><div class="cval">${c.customer}</div></div>
      <div class="cost-chip warranty"><div class="clbl">Warranty</div><div class="cval">${c.warranty}</div></div>`;
  }
  return `<div class="cost-chip customer" style="flex:1"><div class="clbl">Customer Pay</div><div class="cval">${c.customer}</div></div>`;
}
function metaHTML(meta) {
  return meta.map(([k, v, warn]) => `<div class="meta-row"><span class="k">${k}</span><span class="v${warn ? ' ' + warn : ''}">${v}</span></div>`).join("");
}
function authHTML(a) {
  if (!a) return "";
  const sig = a.sigName ? `<div class="auth-sig"><div class="sig-name">${a.sigName}</div><div class="sig-meta">${a.sigMeta}</div></div>` : "";
  return `<div class="side-card"><div class="side-head">Customer Authorization</div>
    <div class="auth-body">
      <div class="auth-state"><span class="auth-dot ${a.dot}"></span>${a.state}</div>
      <div class="auth-note">${a.note}</div>${sig}
    </div></div>`;
}
function warrantyHTML(w) {
  if (!w) return "";
  const lines = w.lines.map(([k, v]) => `<div class="warr-line"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
  return `<div class="side-card"><div class="side-head">Warranty Claim</div>
    <div class="warr-body">${lines}
      <div class="warr-status${w.flagged ? ' flagged' : ''}">${w.status}</div>
    </div></div>`;
}

/* ---------- Actions menu ----------
   The topbar Actions button opens a menu whose top item is contextual to
   where the job sits in its lifecycle (stamp.cls); the rest are the
   standard work-order operations. sidebar.js owns open/close + outside
   click; here we only build the items. Items with data-href navigate,
   data-act="print" prints; the rest are placeholders that just close
   (consistent with the account menu in this prototype). */
const AI = {
  qc:      '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  invoice: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
  tech:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  play:    '<polygon points="5 3 19 12 5 21 5 3"/>',
  box:     '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
  labor:   '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  edit:    '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  status:  '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
  print:   '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  mail:    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  shield:  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  cancel:  '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>'
};
function aicon(p) { return '<span class="mi-ico"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + p + '</svg></span>'; }

// contextual lead action, keyed by lifecycle stamp
const LEAD_ACTION = {
  progress:  { ico: AI.qc,      text: "Mark ready for QC" },
  waiting:   { ico: AI.box,     text: "Update parts ETA" },
  ready:     { ico: AI.invoice, text: "Generate invoice" },
  overdue:   { ico: AI.tech,    text: "Assign technician" },
  scheduled: { ico: AI.play,    text: "Start job" }
};

function buildActionsMenu(rec) {
  const btn = document.getElementById("wo-actions");
  if (!btn) return;
  // opt: { attrs: extra attributes, cls: extra class on the item }
  const mi = (ico, text, opt) => `<div class="menu-item${opt && opt.cls ? " " + opt.cls : ""}"${opt && opt.attrs ? " " + opt.attrs : ""}>${aicon(ico)}${text}</div>`;
  const sep = '<div class="menu-sep"></div>';
  const label = t => '<div class="menu-label">' + t + '</div>';

  let html = '<div class="menu wo-actions-menu">';

  const lead = LEAD_ACTION[rec.stamp.cls];
  if (lead) html += mi(lead.ico, lead.text);

  html += sep + label("Work order");
  html += mi(AI.labor, "Add labor line");
  html += mi(AI.box, "Add parts");
  html += mi(AI.status, "Update status");
  html += mi(AI.edit, "Edit details");

  html += sep + label("Share");
  html += mi(AI.print, "Print work order", { attrs: 'data-act="print"' });
  html += mi(AI.mail, "Email to customer");

  const w = rec.warranty;
  if (w && Array.isArray(w.lines)) {
    const claim = w.lines.find(([k]) => k === "Claim #");
    const m = claim && /wc=(\d+)/.exec(claim[1]);
    if (m) html += sep + mi(AI.shield, "View warranty claim WC-" + m[1], { attrs: 'data-href="warranty.html?wc=' + m[1] + '"' });
  }

  html += sep + mi(AI.cancel, "Cancel work order", { cls: "danger" });

  html += '</div>';
  btn.insertAdjacentHTML("beforeend", html);
}

function render(rec) {
  const c = rec.cost;
  document.getElementById("content").innerHTML = `
    <div class="wo-head ${rec.dept === 'overdue' ? 'dept-overdue' : ''}">
      <div class="wo-head-l">
        <div class="wo-id-row"><span class="wo-id">${rec.id}</span><span class="wo-bay">${rec.bay}</span></div>
        <div class="wo-title">${rec.title}</div>
        <div class="wo-sub">${subHTML(rec.sub)}</div>
      </div>
      <div class="wo-head-r">
        <div class="stamp ${rec.stamp.cls}">${rec.stamp.label}</div>
        <div class="wo-priority">${rec.priority}</div>
      </div>
    </div>

    <div class="lifecycle">
      <div class="lifecycle-head"><div class="section-title">Work Order Lifecycle</div><div class="elapsed">${rec.elapsed}</div></div>
      <div class="stepper">${stepsHTML(rec.steps)}</div>
    </div>

    <div class="wo-body">
      <div>
        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>Complaint · Cause · Correction</div></div>
          <div>
            <div class="threec"><div class="threec-label complaint">Complaint</div><div class="threec-text">${rec.threeC.complaint}</div></div>
            <div class="threec"><div class="threec-label cause">Cause</div><div class="threec-text">${rec.threeC.cause}</div></div>
            <div class="threec"><div class="threec-label correction">Correction</div><div class="threec-text">${rec.threeC.correction}</div></div>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--amber)"></span>Labor Operations</div><div class="card-meta">${rec.laborTech}</div></div>
          <div class="table-wrap"><table class="ltable">
            <thead><tr><th>Op / Flat-Rate</th><th class="num">Est</th><th class="num">Actual</th><th>Status</th><th class="num">Amount</th></tr></thead>
            <tbody>${laborHTML(rec.labor)}</tbody>
          </table></div>
        </div>

        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--field-green)"></span>Parts</div><div class="card-meta">${rec.partsMeta}</div></div>
          <div class="table-wrap"><table class="ltable">
            <thead><tr><th>Part #</th><th>Description</th><th class="num">Qty</th><th>Status</th><th class="num">Ext.</th></tr></thead>
            <tbody>${partsHTML(rec.parts)}</tbody>
          </table></div>
        </div>

        <div class="card">
          <div class="card-head"><div class="card-title"><span class="swatch" style="background:var(--charcoal-3)"></span>Activity Log</div></div>
          <div class="activity">${activityHTML(rec.activity)}</div>
        </div>
      </div>

      <div>
        <div class="side-card">
          <div class="side-head">Cost Summary</div>
          <div class="cost-body">
            ${c.rows.map(([l, v]) => `<div class="cost-row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join("")}
            <div class="cost-split">${costChipsHTML(c)}</div>
            <div class="cost-total"><span class="lbl">${rec.dept === 'overdue' ? 'Est. Total' : 'Est. Total'}</span><span class="val">${c.total}</span></div>
            ${c.note ? `<div class="cost-note">${c.note}</div>` : ""}
          </div>
        </div>
        ${authHTML(rec.auth)}
        ${warrantyHTML(rec.warranty)}
        <div class="side-card">
          <div class="side-head">Unit &amp; Customer</div>
          <div class="meta-body">${metaHTML(rec.meta)}</div>
        </div>
      </div>
    </div>`;
}

/* ---------- boot ---------- */
(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get("wo") || "88213";
  const rec = RECORDS[id] || RECORDS["88213"];
  rec.id = "WO-" + (RECORDS[id] ? id : "88213");
  render(rec);
  buildActionsMenu(rec);
  document.title = "Fieldbook — " + rec.id;
  document.getElementById("crumb-here").textContent = rec.id;
  document.getElementById("bay-link").href = "bay.html?wo=" + (RECORDS[id] ? id : "88213");
})();
