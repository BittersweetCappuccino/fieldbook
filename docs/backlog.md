# Fieldbook — Product Backlog

**Product:** Fieldbook — Dealer Management System (DMS) for agriculture, construction, and turf equipment dealerships.
**Scope of this backlog:** Productionizing the concept from scratch as a full-stack application. The existing HTML/CSS/JS mockup is the **reference design**, not the codebase — every screen it shows becomes real, backend-backed functionality.
**Author:** Product (technical PM)
**Status:** Draft for team refinement

---

## How to read this backlog

The backlog is three levels deep:

- **Epic** — a body of work too large for one sprint, delivering a coherent slice of product value (usually one department or platform capability).
- **Feature** — a shippable capability inside an epic; typically 1–2 sprints of work.
- **Story (ticket)** — a vertical slice sized to fit **inside a single sprint**. This is the unit the team pulls into a sprint. Every story below carries a user story, testable acceptance criteria, scope boundaries, and technical notes.

**Numbering:** `E{n}` epics, `E{n}.F{m}` features, `E{n}.F{m}.S{k}` stories. IDs are stable references — carry them into Jira/Linear as the external key.

### Ticket conventions

- **Acceptance criteria** are written Given/When/Then and define "done" for QA. They cover error and edge states, not just the happy path.
- **Designs** link to the reference mockup screen(s) under `/pages` and `/docs`. The mockup is the source of truth for layout and interaction language; engineers own the *how*.
- **Scope boundaries** state what is explicitly **out** of each ticket to prevent scope creep and gold-plating.
- **Technical notes** flag known constraints and dependencies. They are flags, not mandates — implementation is the team's call.
- **Estimate** is a rough size (S / M / L) to aid sprint planning, not a commitment. Anything larger than L is a signal the story needs splitting.

### Definition of Ready (before a story enters a sprint)
Acceptance criteria agreed · design linked · dependencies identified · testable · estimable by the team · no open blocking question.

### Definition of Done (before a story is accepted)
Code reviewed and merged · acceptance criteria pass in QA · automated tests cover the criteria · accessible (keyboard + contrast, per the shop-floor-legibility bar) · telemetry/logging in place where noted · documented if it changes an API contract.

---

## Reference material

- **Interactive mockup:** https://bittersweetcappuccino.github.io/fieldbook/ (screens live under `/pages/*.html`)
- **User Flows (routing board):** [docs/user-flows.html](user-flows.html) — every screen and the action that advances each record
- **Screen Map (wireframe sitemap):** [docs/user-flows-sitemap.html](user-flows-sitemap.html)
- **Pressure Test (OEM API reality check):** [docs/pressure-test.html](pressure-test.html) — stress-tests the sync feed against John Deere's public developer docs; **required reading for Epic 9**
- **Product rationale:** [README.md](../README.md)

---

## Epic map & suggested sequencing

| # | Epic | Delivers | Depends on |
|---|------|----------|------------|
| **E1** | Platform Foundation & Delivery Infrastructure | The skeleton every feature is built on: environments, CI/CD, API + DB, design-system componentization, observability | — |
| **E2** | Identity, Access & Multi-Location Workspace | Sign-in, roles/permissions, per-location workspace, profile & settings | E1 |
| **E3** | Customer & Equipment Master Data | The cross-cutting hub — customers, equipment/units, "start work" entry points | E1, E2 |
| **E4** | Service — Work Order to Paid Invoice | The signature lifecycle: bay board → assigned job → QC → invoice → paid | E1–E3 |
| **E5** | Bay View — Technician Shop-Floor App | The responsive tablet role-switch: labor clock, checklist, Complete → QC | E4 |
| **E6** | Parts — Inventory, Reorder & Receiving | Reorder queue → PO → receive into stock; feeds Service backorders | E1–E3 |
| **E7** | Rentals — Fleet, Extension & Return | Out-on-rent lifecycle: fleet board → extend → return inspection | E1–E3 |
| **E8** | Sales — Deal Pipeline to Won | Pipeline board → deal → quote → won | E1–E3 |
| **E9** | Manufacturer Sync & Warranty Integration | OEM integration: sync feed + warranty claim → submission → credit | E1–E4 |
| **E10** | Dashboard & Cross-Department Reporting | The four-blocker dashboard, module boards, and reporting | E4–E9 (incremental) |

**Recommended delivery order:** E1 → E2 → E3 establish the foundation. Then deliver **E4 + E5 as the first end-to-end vertical slice** (Service is the product's signature flow and proves the whole stack). E6–E9 can then run in parallel across squads. E10's dashboard tiles light up incrementally as each department epic lands — build the dashboard shell early (in E1) and wire each tile as its data source ships.

---
---

# E1 — Platform Foundation & Delivery Infrastructure

**Epic goal:** Stand up the technical foundation so that every subsequent feature is a vertical slice on a working stack — not a rewrite of plumbing. This epic produces no end-user department feature, but without it nothing else can ship to production.

**Why:** The concept is a static front-end. A real DMS needs a persistent backend, a multi-tenant/multi-location data model, authenticated APIs, a componentized design system (the torn-ticket card, stamp badges, department colors), and the CI/CD + observability to ship safely to dealerships that run on this daily.

**Out of scope for the epic:** Any department business logic (lives in E4–E9); real OEM connectivity (E9).

### Feature E1.F1 — Environments, CI/CD & observability

#### E1.F1.S1 — Provision dev/staging/prod environments as code
**User story:** As an engineer, I want reproducible environments provisioned from code so that I can deploy Fieldbook safely and identically across dev, staging, and production.
**Acceptance criteria:**
- Given the infra repo, when an engineer runs the provisioning pipeline, then dev, staging, and prod environments are created/updated from version-controlled definitions with no manual console steps.
- Given a fresh environment, when provisioning completes, then it exposes an app tier, a managed relational database, and secret storage, each network-isolated per environment.
- Given secrets (DB creds, API keys), when the app runs, then secrets are injected from the secret store and never present in the repo or logs.
**Scope boundaries:** No application features deployed yet. No multi-region/DR (separate future ticket).
**Technical notes:** Infrastructure-as-code (Terraform or equivalent). Postgres recommended (relational, transactional — the domain is invoice/ledger-shaped). Flag: choice of cloud provider is a team decision; document it in the ADR log.
**Estimate:** L

#### E1.F1.S2 — CI pipeline: build, test, lint on every PR
**User story:** As an engineer, I want every pull request to build, lint, and run the test suite automatically so that broken code never reaches the main branch.
**Acceptance criteria:**
- Given a PR, when it is opened or updated, then CI runs build, linters, and the automated test suite and reports status back on the PR.
- Given a failing check, when CI completes, then the PR is blocked from merge until checks pass.
- Given a green PR, when it merges to main, then an artifact is produced and published ready for deploy.
**Scope boundaries:** Deployment automation is S3. No release-notes automation.
**Technical notes:** Wire branch protection to required checks. Keep pipeline under ~10 min to protect flow.
**Estimate:** M

#### E1.F1.S3 — Continuous deployment to staging + gated prod release
**User story:** As the team, we want merges to auto-deploy to staging and a one-click gated promotion to production so that releasing is routine and low-risk.
**Acceptance criteria:**
- Given a merged artifact, when the pipeline runs, then it deploys automatically to staging.
- Given a staged build, when a maintainer approves promotion, then it deploys to production with zero-downtime (rolling or blue/green).
- Given a failed prod deploy, when health checks fail, then the release rolls back automatically to the last healthy version.
**Scope boundaries:** Feature-flag framework is S4. Canary/percentage rollouts out of scope for v1.
**Technical notes:** Health-check endpoint required (depends on nothing else — can be a stub). Depends on E1.F1.S1.
**Estimate:** M

#### E1.F1.S4 — Observability baseline: logging, metrics, error tracking
**User story:** As an on-call engineer, I want centralized logs, metrics, and error alerts so that I can detect and diagnose production problems before dealerships report them.
**Acceptance criteria:**
- Given any environment, when the app handles a request, then a structured log line with a correlation/request ID is emitted to a centralized log store.
- Given an unhandled exception, when it occurs, then it is captured in an error-tracking tool with stack trace and request context, and an alert fires for a spike.
- Given the running app, when I open the metrics dashboard, then I can see request rate, latency (p50/p95), and error rate per service.
**Scope boundaries:** SLO definitions and paging rotations are a later ops ticket. No business-metric dashboards (that's E10).
**Technical notes:** Correlation ID must thread from API gateway through to DB queries to support later debugging of cross-department flows.
**Estimate:** M

### Feature E1.F2 — Core backend & data platform

#### E1.F2.S1 — API service skeleton with health, auth middleware hook, and error contract
**User story:** As a backend engineer, I want a running API service with a consistent request/response and error contract so that every department endpoint is built the same way.
**Acceptance criteria:**
- Given the API service, when it starts, then `GET /health` returns 200 with build/version info.
- Given any endpoint, when it returns an error, then the body follows a single documented error schema (code, message, correlation ID) and uses correct HTTP status codes.
- Given an unauthenticated request to a protected route, when auth middleware runs, then it returns 401 (the middleware is present but pluggable; real auth lands in E2).
**Scope boundaries:** No business endpoints. No authorization rules yet (E2).
**Technical notes:** Establishes the pattern (routing, validation, error handling, OpenAPI generation) that E3–E9 endpoints follow. Publish the OpenAPI spec from day one.
**Estimate:** M

#### E1.F2.S2 — Core data model & migration framework
**User story:** As an engineer, I want a versioned migration framework and the core shared entities modeled so that department data builds on a consistent schema.
**Acceptance criteria:**
- Given the migration tool, when I add a migration, then it runs forward/rollback deterministically in every environment via CI.
- Given the initial migration set, when applied, then it creates the shared backbone tables — `location` (store), `customer`, `equipment_unit`, `user` — with keys, timestamps, and soft-delete columns.
- Given any record, when created or modified, then created/updated timestamps and actor are recorded (audit backbone).
**Scope boundaries:** Department-specific tables (work orders, POs, rentals, deals, claims) are defined in their own epics. No data seeding beyond a minimal fixture.
**Technical notes:** Every business record is scoped to a `location` — see E2.F3 (multi-location). Model the location foreign key now to avoid a painful retrofit.
**Estimate:** L

#### E1.F2.S3 — Seed & demo-data harness
**User story:** As a developer or demoer, I want a command that loads realistic sample data so that every screen can be built and demoed against representative records.
**Acceptance criteria:**
- Given an empty database, when I run the seed command, then it loads the four locations (Fargo / Bismarck / Grand Forks / Minot), sample customers, equipment, and users across roles.
- Given seeded data, when department epics add their tables, then each can extend the seed harness without rewriting it.
- Given a non-prod environment, when seeding runs, then it is idempotent (re-runnable without duplicating records); production refuses to seed.
**Scope boundaries:** Not a data-import/migration tool for real dealership data (separate future onboarding epic).
**Technical notes:** Mirror the fixtures implied by the mockup so UI work matches demo expectations.
**Estimate:** S

### Feature E1.F3 — Design system componentization

#### E1.F3.S1 — Extract the shop-floor design tokens & base components
**User story:** As a front-end engineer, I want the mockup's visual language extracted into reusable tokens and components so that every screen is consistent and I don't re-implement the torn-ticket card five times.
**Acceptance criteria:**
- Given the design system, when I build a screen, then department colors (amber/service, green/parts, steel-blue/rentals, clay/sales-alert), typography (Oswald display, monospace IDs, legible sans body), and spacing are available as tokens — no hard-coded hex values in feature code.
- Given a work record, when I render its card, then a shared **torn-ticket card** component renders the perforated edge, department stripe, and rotated **ink-stamp status badge** (Ready / In Progress / Waiting on Parts / Overdue).
- Given an overdue/critical state, when rendered, then status is conveyed by **both** the stamp label and color, never color alone (shop-floor legibility requirement).
**Designs:** [css/styles.css](../css/styles.css), all `/pages` screens; rationale in [README.md](../README.md).
**Scope boundaries:** Only the shared primitives (card, stamp badge, button, topbar, board layout, table, form controls). Screen-specific composition lives in each department epic.
**Technical notes:** Framework choice (React/Vue/etc.) is a team decision — record it in an ADR. Whatever is chosen, the stamp/card must be a single component reused everywhere.
**Estimate:** L

#### E1.F3.S2 — App shell: topbar, location switcher slot, and module navigation
**User story:** As any operator, I want a persistent app shell so that navigation, the location switcher, and my account menu are in the same place on every screen.
**Acceptance criteria:**
- Given any authenticated screen, when it renders, then the topbar shows the module nav, the location switcher slot, and the account menu in fixed positions.
- Given a narrow viewport, when the shell renders, then navigation collapses responsively without breaking the board layout.
- Given the account menu, when opened, then it exposes Profile, Settings, and Sign out (wired in E2).
**Designs:** topbar across all `/pages`; `js/sidebar.js` action router in the mockup.
**Scope boundaries:** Location switcher *behavior* is E2.F3; here it is a placed-but-inert slot. Account actions are wired in E2.
**Technical notes:** The mockup's `js/sidebar.js` encodes the intended nav/action structure — mine it for the routing map.
**Estimate:** M

---
---

# E2 — Identity, Access & Multi-Location Workspace

**Epic goal:** Let real people sign in as themselves, see only what their role and location allow, and work within one of the dealership's stores at a time.

**Why:** A DMS is used by distinct roles — GM, service manager, technician, parts counter, sales, admin — across multiple physical locations. Permissions and location scoping aren't polish; they gate every record in the system. The mockup shows sign-in, profile, settings, and a Fargo/Bismarck/Grand Forks/Minot switcher.

**Out of scope for the epic:** SSO/SAML federation (future enterprise ticket); customer-facing accounts (customers are data, not users — see E3).

### Feature E2.F1 — Authentication

#### E2.F1.S1 — Email/password sign-in with secure sessions
**User story:** As an operator, I want to sign in with my credentials so that I reach the board that shows what's blocking work today.
**Acceptance criteria:**
- Given valid credentials, when I submit the sign-in form, then I'm authenticated and landed on the dashboard for my default location.
- Given invalid credentials, when I submit, then I see a generic "invalid email or password" error (no user enumeration) and remain on sign-in.
- Given repeated failures, when a threshold is exceeded, then further attempts are rate-limited/locked out for a cool-down period.
- Given an authenticated session, when it exceeds its idle/absolute lifetime, then I am signed out and must re-authenticate.
**Designs:** [pages/login.html](../pages/login.html)
**Scope boundaries:** No "remember me" device trust, no social login. Password reset is S2; MFA is S3.
**Technical notes:** Store password hashes with a modern KDF (bcrypt/argon2). Sessions via secure, httpOnly cookies or signed tokens — team's call; document in ADR.
**Estimate:** M

#### E2.F1.S2 — Password reset via email link
**User story:** As an operator who forgot my password, I want to reset it via an emailed link so that I can regain access without an admin.
**Acceptance criteria:**
- Given the sign-in screen, when I request a reset for an email, then I always see the same confirmation (no account enumeration) and, if the account exists, a single-use, time-limited reset link is emailed.
- Given a valid reset link, when I set a new password meeting the policy, then the password updates, the link is consumed, and active sessions for that account are invalidated.
- Given an expired or already-used link, when I open it, then I see an error and can request a new one.
**Scope boundaries:** Admin-forced resets are S4 (user admin). No SMS reset.
**Technical notes:** Requires a transactional email provider (shared dependency with quote/invoice emails in E4/E8 — provision once here).
**Estimate:** M

#### E2.F1.S3 — Optional MFA (TOTP)
**User story:** As a security-conscious dealership, I want operators to be able to enable two-factor auth so that a stolen password alone can't access financial records.
**Acceptance criteria:**
- Given my profile, when I enable MFA, then I can enroll an authenticator via QR and confirm with a valid code, and receive recovery codes.
- Given MFA is enabled, when I sign in, then I must supply a valid TOTP code after my password.
- Given a lost device, when I use a recovery code, then I authenticate and that code is consumed.
**Scope boundaries:** Not mandatory-org-wide enforcement (an admin policy ticket, future). No hardware-key/WebAuthn in v1.
**Technical notes:** Depends on E2.F1.S1. Can ship after the department epics — not on the critical path.
**Estimate:** M

### Feature E2.F2 — Roles & permissions

#### E2.F2.S1 — Role model & permission enforcement in the API
**User story:** As the business, I want each operator's role to gate what they can see and do so that a technician can't void an invoice and a parts clerk can't advance a sales deal.
**Acceptance criteria:**
- Given the seeded roles (GM/admin, Service Manager, Technician, Parts, Sales, and a read-only role), when a user is assigned a role, then their permissions derive from it.
- Given an API request, when the user's role lacks permission for the action, then the API returns 403 and the action is not performed (enforcement is server-side, not just hidden in UI).
- Given a permission matrix document, when reviewed, then every department action maps to the roles allowed to perform it.
**Scope boundaries:** Custom/granular per-user permissions out of scope — role-based only in v1. UI hiding is S2.
**Technical notes:** This is the authorization layer the E1.F2.S1 middleware hook was built for. Publish the role×action matrix as a living doc; department epics reference it.
**Estimate:** L

#### E2.F2.S2 — Role-aware UI (hide/disable unauthorized actions)
**User story:** As an operator, I want to only see the actions I'm allowed to take so that the interface isn't cluttered with buttons that would just error.
**Acceptance criteria:**
- Given my role, when a screen renders, then actions I lack permission for are hidden or disabled with an explanatory tooltip.
- Given a disabled/hidden action, when I attempt it by other means, then the server still enforces the rule (UI is convenience, not the security boundary).
**Scope boundaries:** Depends on E2.F2.S1 being the real gate.
**Technical notes:** Drive from the same permission matrix; don't fork the rules client-side.
**Estimate:** S

### Feature E2.F3 — Multi-location workspace

#### E2.F3.S1 — Location switcher scoping all data to the active store
**User story:** As an operator working at one store, I want to switch and pin my active location so that every board and record I see belongs to that store.
**Acceptance criteria:**
- Given the topbar switcher, when I select a location (Fargo / Bismarck / Grand Forks / Minot), then all department boards, lists, and dashboards reload scoped to that location.
- Given a chosen location, when I navigate or reload within the session, then the choice persists per session.
- Given a user assigned to a subset of locations, when the switcher renders, then only permitted locations are selectable.
- Given a record from location A, when my active location is B, then I cannot view/edit it via direct URL (server enforces location scope).
**Designs:** topbar switcher, referenced in [docs/user-flows.html](user-flows.html) ("persists per session").
**Scope boundaries:** Cross-location transfers (e.g. parts stock transfer) are handled in their department epics; here we only scope *viewing/editing*. No "all locations" roll-up view except in reporting (E10).
**Technical notes:** Every business query filters by active location (built on the E1.F2.S2 location FK). This is a cross-cutting dependency for E3–E9 — land it early.
**Estimate:** L

### Feature E2.F4 — Account: profile, settings, user admin

#### E2.F4.S1 — Operator profile
**User story:** As an operator, I want to view and edit my identity, role, and preferences so that my account reflects who I am and how I work.
**Acceptance criteria:**
- Given the account menu, when I open Profile, then I see my name, email, role (read-only), assigned locations, and editable preferences.
- Given an edit to an editable field, when I save, then it persists and is reflected immediately; role is not self-editable.
**Designs:** [pages/profile.html](../pages/profile.html), `js/account.js`
**Scope boundaries:** Role/location assignment is admin-only (S3). Notification preferences limited to what exists in the mockup.
**Estimate:** S

#### E2.F4.S2 — Workspace & account settings + sign-out
**User story:** As an operator, I want account/workspace settings and a confirmed sign-out so that I can configure my workspace and safely end my session.
**Acceptance criteria:**
- Given Settings, when I open it, then I can view/adjust the workspace/account configuration shown in the mockup, and changes persist.
- Given the account menu, when I choose Sign out, then a confirmation modal appears; on confirm my session is invalidated and I return to the sign-in screen.
**Designs:** [pages/settings.html](../pages/settings.html); sign-out flow in [docs/user-flows.html](user-flows.html) (confirmation modal → login).
**Scope boundaries:** Org-wide/admin settings are S3.
**Estimate:** S

#### E2.F4.S3 — User administration (admin)
**User story:** As an admin/GM, I want to invite, deactivate, and assign roles/locations to operators so that I control who has access to the workspace.
**Acceptance criteria:**
- Given admin rights, when I invite a user by email, then they receive an enrollment link to set a password and appear as pending until enrolled.
- Given a user, when I assign a role and one or more locations, then their access reflects it on next request.
- Given a departing employee, when I deactivate their account, then their sessions are revoked and they can no longer sign in, while their historical actions remain attributed for audit.
**Scope boundaries:** No bulk CSV user import in v1. No self-service org signup (Fieldbook is provisioned per dealership).
**Technical notes:** Deactivate = soft-disable, never hard-delete (audit trail). Depends on E2.F2.S1.
**Estimate:** M

---
---

# E3 — Customer & Equipment Master Data

**Epic goal:** Build the cross-cutting hub. One customer touches every department, and their record — plus the equipment they own — is where new work starts.

**Why:** Service, Parts, Rentals, and Sales all reference the same customer and the same physical machines. Getting this shared model right (and the "start work" entry points) prevents four departments from each inventing their own half-customer.

**Out of scope for the epic:** Department transactions themselves (work orders, POs, rentals, deals) — this epic owns the *entities* and the *launch points*, not the transactions.

### Feature E3.F1 — Customer records

#### E3.F1.S1 — Customer list with search and filter
**User story:** As any operator, I want to find a customer quickly so that I can start or look up their work.
**Acceptance criteria:**
- Given the Customers screen, when it loads, then I see accounts for the active location with name, contact, and activity summary.
- Given a search term, when I type it, then the list filters by name/company/phone/email in near-real-time.
- Given many customers, when the list is long, then it paginates or virtualizes without a full reload.
**Designs:** [pages/customers.html](../pages/customers.html), `js/customers.js`
**Scope boundaries:** Creating a customer is S3. Cross-location customer visibility deferred to reporting.
**Estimate:** M

#### E3.F1.S2 — Customer detail with cross-department activity
**User story:** As an operator, I want one customer record showing their contact info, equipment owned, and activity across all departments so that I have full context before I act.
**Acceptance criteria:**
- Given a customer, when I open their record, then I see contact details, the equipment they own, and a unified activity list spanning service, parts, rentals, and sales.
- Given the record, when a linked transaction exists (e.g. an open work order), then it deep-links to that record.
- Given the record actions, when I choose Print statement or Email, then the respective flow launches (statement generation may be stubbed until billing exists; email uses the shared provider).
**Designs:** [pages/customer.html](../pages/customer.html), `js/customer.js`
**Scope boundaries:** Activity feed is read-only aggregation; it does not let you edit those transactions inline. Print statement full billing logic may be a follow-up if department invoicing isn't yet live.
**Technical notes:** The activity aggregation depends on department tables existing; build it to gracefully show only the departments that have shipped, and extend as E4/E6/E7/E8 land.
**Estimate:** L

#### E3.F1.S3 — Create & edit customer
**User story:** As an operator, I want to add and update customer accounts so that new business has a home record.
**Acceptance criteria:**
- Given the create form, when I submit valid contact details, then a customer is created scoped to the active location and I land on their record.
- Given required fields missing or malformed (e.g. bad email/phone), when I submit, then inline validation blocks save and explains what's wrong.
- Given an edit, when I save, then changes persist and the audit trail records who changed what and when.
**Scope boundaries:** No dedup/merge of duplicate customers in v1 (flag as future). No credit-limit/AR fields beyond what the mockup shows.
**Estimate:** M

### Feature E3.F2 — Equipment/unit records

#### E3.F2.S1 — Equipment unit record linked to a customer
**User story:** As an operator, I want each machine tracked as a unit tied to its owner so that service, warranty, and rentals all reference the same physical equipment.
**Acceptance criteria:**
- Given a customer, when I add a unit (make/model/serial/meter), then it is linked to that customer and appears on their record.
- Given a unit, when I open it, then I see its identity, meter reading, and its history across departments (service jobs, warranty claims).
- Given a serial number, when I enter one that already exists at the location, then I'm warned of the potential duplicate.
**Scope boundaries:** Full equipment lifecycle/telematics integration out of scope. Rental fleet units (dealer-owned) are modeled in E7 but should reuse this unit entity.
**Technical notes:** `equipment_unit` was created in E1.F2.S2 — this story builds its UI/API. Warranty (E9) and Service (E4) both foreign-key to it.
**Estimate:** M

### Feature E3.F3 — "Start work" launch points

#### E3.F3.S1 — Unified "new record" launcher from a customer
**User story:** As an operator, I want to start a new work order, rental, or deal directly from a customer so that new work is always attached to the right account without re-entering the customer.
**Acceptance criteria:**
- Given a customer record, when I choose Start work, then I can launch a new Service work order, Rental, or Sales deal, prefilled with that customer.
- Given the launcher, when a target department epic isn't live yet, then its option is disabled with a "coming soon" state rather than a broken link.
- Given a launched record, when it's created, then it is correctly attributed to the originating customer and active location.
**Designs:** customers flow in [docs/user-flows.html](user-flows.html): `new.html?type=work-order | rental | deal`; [pages/new.html](../pages/new.html), `js/new.js`
**Scope boundaries:** The department-specific creation logic lives in E4/E7/E8; this ticket owns the *launcher and prefill contract* only.
**Technical notes:** Establish the `new?type=…` routing/prefill contract here so each department epic just implements its handler.
**Estimate:** M

---
---

# E4 — Service: Work Order to Paid Invoice

**Epic goal:** Deliver the product's signature lifecycle end-to-end: a job moves from the bay board, gets assigned, has labor and parts logged, passes QC, becomes an invoice, and is sent to the customer — the same journey a paper work-order ticket once made.

**Why:** Service is the operational heart of an equipment dealership and Fieldbook's flagship flow. Shipping this as the first full vertical slice proves the entire stack (E1–E3) against real business value.

**Out of scope for the epic:** The technician's tablet experience (E5, tightly coupled — sequence together); parts *procurement* (E6 — this epic consumes parts availability but doesn't reorder); warranty claims (E9).

### Feature E4.F1 — Bay board & work order lifecycle

#### E4.F1.S1 — Service bay board
**User story:** As a service manager, I want a board of all bays with color-coded, stamped ticket cards so that I can read the whole shop's status in one glance.
**Acceptance criteria:**
- Given the Service board, when it loads for the active location, then each bay shows its current job as a torn-ticket card with department stripe and ink-stamp status (Ready / In Progress / Waiting on Parts / Overdue).
- Given an overdue job, when rendered, then it shows both the Overdue stamp and color treatment.
- Given a card, when I click it, then I open that work order.
- Given no job in a bay, when rendered, then the bay shows an empty/available state.
**Designs:** [pages/service.html](../pages/service.html), `js/service.js`
**Scope boundaries:** Drag-to-reassign between bays is out of scope (assignment is via the assign screen, E4.F1.S3). Real-time multi-user live updates are S-later; initial load + manual refresh acceptable for v1.
**Technical notes:** Reuses the E1.F3 torn-ticket component. Board is location-scoped (E2.F3).
**Estimate:** M

#### E4.F1.S2 — Work order detail (the torn ticket)
**User story:** As a service operator, I want a full work order record showing status, labor and parts lines, and history so that I have everything about the job in one place.
**Acceptance criteria:**
- Given a work order, when I open it, then I see customer, unit, status, labor lines, parts lines, running total, and an activity history.
- Given the record, when I use the primary actions, then Add labor/parts, Change status, Edit, and Print are available per my role.
- Given a Print action, when invoked, then a print-formatted view of the work order is produced.
- Given a work order that references a backordered part, when rendered, then the "Waiting on Parts" state is visible and links to the parts ETA.
**Designs:** [pages/work-order.html](../pages/work-order.html), `js/work-order.js`, `js/workflow.js`
**Scope boundaries:** Creating labor/parts lines is E4.F2. Status transition rules are E4.F1.S4. Invoice generation is E4.F3.
**Technical notes:** `js/work-order.js` (36KB in the mockup) encodes the intended detail structure — the richest reference screen; mine it carefully.
**Estimate:** L

#### E4.F1.S3 — Assign technician, bay, priority & scheduled start
**User story:** As a service manager, I want to assign a job to a technician and bay with a priority and start time so that work is scheduled and the tech knows what's next.
**Acceptance criteria:**
- Given an unassigned/assignable work order, when I open Assign, then I can pick a technician, bay, priority, and scheduled start.
- Given a valid assignment, when I save, then the work order reflects the tech/bay/priority and appears in that bay on the board and in the tech's queue (E5).
- Given a bay already occupied by an in-progress job, when I assign another job to it, then I'm warned of the conflict before confirming.
**Designs:** [pages/assign.html](../pages/assign.html)
**Scope boundaries:** No auto-scheduling/optimization. No calendar/Gantt view.
**Technical notes:** The tech's queue consumer is E5.F1.S3 — define the assignment→queue contract here.
**Estimate:** M

#### E4.F1.S4 — Work order status transitions
**User story:** As a service operator, I want work order status to follow valid transitions so that the board's stamps always reflect a legitimate state of the job.
**Acceptance criteria:**
- Given a work order in a given status, when I change status, then only valid next states are offered (e.g. can't invoice a job that hasn't passed QC).
- Given a status change, when saved, then the stamp updates everywhere the job appears and the transition is recorded in history with actor and timestamp.
- Given a terminal state (Invoiced), when reached, then the work order is locked from further line edits.
**Designs:** [pages/status.html](../pages/status.html), `js/status.js`; lifecycle in [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Cancel/void handled via the shared confirm flow (E4.F4.S1).
**Technical notes:** Define the status state machine once; the board, detail, and bay view all read from it.
**Estimate:** M

### Feature E4.F2 — Labor, parts & line items

#### E4.F2.S1 — Add & edit labor lines
**User story:** As a technician or service writer, I want to log labor on a work order so that the customer is billed for the time the job took.
**Acceptance criteria:**
- Given a work order, when I add a labor line (operation, hours, rate), then it appears on the order and updates the running total.
- Given a labor line, when I edit or remove it (per role, before invoicing), then totals recompute.
- Given invalid input (negative hours, missing rate), when I save, then validation blocks it.
**Designs:** [pages/line-item.html](../pages/line-item.html), `js/line-item.js`
**Scope boundaries:** Automatic time capture from the bay-view labor clock is E5 (the clock *feeds* labor lines). Flat-rate/labor-guide lookups out of scope for v1.
**Estimate:** M

#### E4.F2.S2 — Add & edit parts lines with availability
**User story:** As a service writer, I want to add parts to a work order and see their availability so that I know immediately if a part will hold up the job.
**Acceptance criteria:**
- Given a work order, when I add a part, then it shows quantity, price, and current stock availability, and updates the total.
- Given a part that is out of stock/backordered, when added, then the line flags it and the work order can enter "Waiting on Parts".
- Given a parts line, when the part is later received (E6), then the line's availability reflects the update.
**Designs:** [pages/line-item.html](../pages/line-item.html), parts flow linkage in [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Actually *ordering* the backordered part is E6 (Parts). This story reads availability and reflects backorder state; it does not create POs.
**Technical notes:** Depends on the E6 parts/inventory read API for stock levels. If E6 lags, stub availability behind an interface and swap later.
**Estimate:** M

#### E4.F2.S3 — Update backordered-part ETA on a waiting job
**User story:** As a service writer, I want to revise the arrival estimate of a backordered part while a job waits so that the board and the customer reflect reality.
**Acceptance criteria:**
- Given a work order waiting on a backordered part, when I open Update parts ETA and set a new date, then the ETA updates on the work order and the parts line.
- Given the ETA passes without receipt, when the board renders, then the job surfaces as at-risk/overdue appropriately.
**Designs:** [pages/parts-eta.html](../pages/parts-eta.html)
**Scope boundaries:** The authoritative ETA from a PO lives in E6; this is the service-side view/override.
**Estimate:** S

### Feature E4.F3 — QC, invoicing & delivery

#### E4.F3.S1 — QC checklist
**User story:** As a technician/QC checker, I want to complete a quality checklist before a job is billable so that we don't invoice work that hasn't been verified.
**Acceptance criteria:**
- Given a job ready for QC, when I open the checklist, then I can record the checks the mockup defines (road test, fluids, torque, codes cleared) and mark pass/fail.
- Given all required checks pass, when I mark ready, then the job can advance to invoicing.
- Given a failed check, when recorded, then the job returns to an in-progress/rework state and cannot be invoiced.
**Designs:** [pages/qc.html](../pages/qc.html)
**Scope boundaries:** Configurable per-job-type checklists out of scope for v1 (fixed list). Photo capture optional/later.
**Technical notes:** This is the return point for the E5 "Complete Job → QC" handoff — align the contract with E5.F2.S2.
**Estimate:** M

#### E4.F3.S2 — Generate invoice (labor + parts + tax)
**User story:** As a service writer, I want to roll a completed job's labor, parts, and tax into an invoice so that the customer can be billed accurately.
**Acceptance criteria:**
- Given a QC-passed work order, when I generate an invoice, then labor + parts + applicable tax are totaled into an invoice preview.
- Given the preview, when I confirm, then the invoice is created, the work order moves to Invoiced (terminal, locked), and an immutable invoice record is stored.
- Given tax rules for the location, when computed, then the correct rate is applied and shown as a line.
**Designs:** [pages/invoice.html](../pages/invoice.html)
**Scope boundaries:** Payment capture/processing (marking paid, card processing) is not in v1 — invoice is generated and sent; "paid" tracking is a follow-up billing ticket. Multi-currency out of scope.
**Technical notes:** Invoice numbering must be sequential/auditable per location. Coordinate tax approach with a real tax source before hard-coding rates.
**Estimate:** L

#### E4.F3.S3 — Email invoice to customer & close the ticket
**User story:** As a service writer, I want to email the finished invoice to the customer so that the job is delivered and the ticket closes.
**Acceptance criteria:**
- Given an invoiced work order, when I choose Email customer, then the invoice is emailed to the customer's address via the shared email provider and the send is logged on the record.
- Given a missing/invalid customer email, when I try to send, then I'm prompted to correct it first.
- Given a successful send, when complete, then the ticket reflects closed/delivered and appears in the customer's activity.
**Designs:** [pages/email.html](../pages/email.html), `js/email.js`; email is a terminal action in the service flow.
**Scope boundaries:** Reuses the E2.F1.S2 email provider. No email open/read tracking.
**Estimate:** S

### Feature E4.F4 — Shared destructive actions

#### E4.F4.S1 — Cancel/void with confirmation
**User story:** As an authorized operator, I want cancel and void to require explicit confirmation so that irreversible actions aren't taken by accident.
**Acceptance criteria:**
- Given a cancellable/voidable record, when I trigger cancel/void, then a confirmation modal states the consequence and requires explicit confirm.
- Given confirmation, when I confirm, then the action is performed, recorded in history with actor/reason, and the record moves to the correct terminal/void state; on cancel, nothing changes.
- Given a role without void permission, when they attempt it, then the action is unavailable and server-enforced.
**Designs:** [pages/confirm.html](../pages/confirm.html), `js/confirm.js` (shared confirmation used across departments)
**Scope boundaries:** This is the shared confirm component; other epics reuse it rather than reinventing.
**Technical notes:** Build generic (message, consequence, confirm handler) so Parts/Rentals/Sales/Warranty reuse it.
**Estimate:** S

---
---

# E5 — Bay View: Technician Shop-Floor App

**Epic goal:** Deliver the product's one deliberate role-switch: from any work order, "Open bay view" opens the *same job* as a glove-friendly, single-column tablet screen the technician actually works from — with a live labor clock as its center of gravity — and closes the loop back to the manager via Complete Job → QC.

**Why:** A manager *reads* a dense board; a technician *acts on one job* with greasy gloves. Same data, different job to do. This is the concept's signature responsive insight and should ship alongside E4.

**Out of scope for the epic:** The manager's board (E4); native mobile apps (this is a responsive web view sized for a propped tablet).

### Feature E5.F1 — Bay view core

#### E5.F1.S1 — Responsive single-column bay view of a work order
**User story:** As a technician, I want the job rendered as a large, single-column, touch-friendly screen so that I can work from it at the bay with gloves on.
**Acceptance criteria:**
- Given a work order, when I open bay view (from the work order's persistent button or the Start job action), then the *same job's* data renders in a single-column, large-touch-target layout scoped to one tech/one bay.
- Given a tablet-sized viewport, when the view renders, then targets, type, and spacing meet touch/legibility sizing without horizontal scrolling.
- Given the same job open on the manager's board, when data changes in one place, then both reflect the same underlying record (no divergent copy).
**Designs:** [pages/bay.html](../pages/bay.html), `js/bay.js`; [assets/bay-view-annotated.svg](../assets/bay-view-annotated.svg), [assets/bay-view-handoff.svg](../assets/bay-view-handoff.svg); rationale in [README.md](../README.md)
**Scope boundaries:** Offline mode is out of scope for v1 (assume shop Wi-Fi). No barcode/VIN scanning yet.
**Technical notes:** Same API/record as E4's work order — bay view is a different *presentation*, not a different data model.
**Estimate:** L

#### E5.F1.S2 — Live labor clock
**User story:** As a technician, I want a live labor clock I can start/pause/stop so that my actual time on the job is captured accurately as I work.
**Acceptance criteria:**
- Given the bay view, when I start the clock, then elapsed time runs visibly and persists across reloads/device sleep (server-anchored, not just client timer).
- Given a running clock, when I pause/resume, then intervals are recorded accurately.
- Given I stop the clock, when the job's labor is finalized, then the accumulated time feeds a labor line on the work order (E4.F2.S1).
**Designs:** labor clock is the annotated center of gravity in [assets/bay-view-annotated.svg](../assets/bay-view-annotated.svg)
**Scope boundaries:** Multi-tech simultaneous clocks on one job out of scope for v1 (one active tech per bay). Payroll integration out of scope.
**Technical notes:** Anchor time server-side to survive device sleep — a propped tablet will sleep. This is the clock→labor-line contract with E4.F2.S1.
**Estimate:** L

#### E5.F1.S3 — Technician's self-sufficient job queue
**User story:** As a technician, I want my own job queue in the bay view's app bar so that my device never depends on the manager's dashboard to know what I do next.
**Acceptance criteria:**
- Given I'm a technician on a tablet, when I open bay view, then my assigned job queue (from E4.F1.S3 assignments) is available in the app bar.
- Given I finish a job, when I return to the queue, then the next job is selectable and opens its bay view.
- Given no dashboard access, when I use the device all shift, then the queue functions standalone.
**Designs:** tech job queue in the bay-view app bar, per [README.md](../README.md) and [assets/bay-view-annotated.svg](../assets/bay-view-annotated.svg)
**Scope boundaries:** Reordering/declining jobs by the tech is out of scope (manager assigns).
**Estimate:** M

### Feature E5.F2 — Job execution & handoff

#### E5.F2.S1 — Operation checklist & one-tap quick actions
**User story:** As a technician, I want an operation checklist and one-tap quick actions so that I can record progress on the job without fine-grained typing.
**Acceptance criteria:**
- Given a job in bay view, when I work through it, then I can check off operations and use the quick actions the mockup defines, each updating the job in one tap.
- Given a quick action that needs a part flagged as backordered, when tapped, then it reflects the waiting-on-parts state consistent with E4.
- Given progress recorded, when the manager views the board, then the job's status reflects the tech's updates.
**Designs:** operation checklist & quick actions in [assets/bay-view-annotated.svg](../assets/bay-view-annotated.svg), `js/bay.js`
**Scope boundaries:** Free-text notes limited to what the mockup shows; rich media/photos optional/later.
**Estimate:** M

#### E5.F2.S2 — Complete Job → QC handoff
**User story:** As a technician, I want a Complete Job action that hands the finished job to QC so that the loop closes back into the manager's service flow.
**Acceptance criteria:**
- Given a job I've finished, when I tap Complete Job, then the labor clock stops, its time is committed to labor, and the job advances into the QC state (E4.F3.S1) in the manager's flow.
- Given required operations incomplete, when I tap Complete, then I'm warned and the job doesn't advance.
- Given the handoff, when complete, then the job leaves my active bay and my queue advances.
**Designs:** "Complete Job → QC" handoff described in [README.md](../README.md); returns into the E4 service flow.
**Scope boundaries:** QC itself is E4.F3.S1 — this ticket owns the *handoff transition* only.
**Technical notes:** This is the return edge of the responsive loop; align the transition contract with E4.F3.S1 and the E4.F1.S4 state machine.
**Estimate:** M

---
---

# E6 — Parts: Inventory, Reorder & Receiving

**Epic goal:** Clear a backordered-part alert end to end: see what's low, open the part, adjust/transfer stock, raise a purchase order, track it against the manufacturer's ETA, and receive it into stock.

**Why:** Parts availability is what stalls service jobs. A real inventory + procurement loop is what turns "Waiting on Parts" from a dead end into a tracked, resolvable state.

**Out of scope for the epic:** Warranty parts credits (E9); the service-side consumption of parts (E4 reads this epic's availability).

### Feature E6.F1 — Inventory & stock

#### E6.F1.S1 — Reorder queue (low-stock & backordered)
**User story:** As a parts manager, I want a queue of low-stock and backordered parts with reorder/track actions so that I can act on what's about to stall a job.
**Acceptance criteria:**
- Given the Parts screen, when it loads for the active location, then low-stock and backordered parts are listed with the actions to reorder or track.
- Given a Reorder action, when clicked, then it opens a new PO prefilled with that part (E6.F2.S1).
- Given a Track action on a part already on order, when clicked, then it opens the existing PO (E6.F2.S2).
**Designs:** [pages/parts.html](../pages/parts.html), `js/parts.js`; dashboard "Reorder"/"Track" deep links in [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Reorder-point *configuration* is part of the part record (S2); this screen consumes it.
**Estimate:** M

#### E6.F1.S2 — Part record: on-hand, bin, supplier, movement history
**User story:** As a parts operator, I want a full part record so that I can see where it is, how much I have, who supplies it, and how stock has moved.
**Acceptance criteria:**
- Given a part, when I open it, then I see on-hand count, bin location, supplier, reorder point, and movement history.
- Given the record actions, when used, then Adjust stock, Transfer, Order more, and Edit are available per role.
- Given an Order more action, when clicked, then it launches a prefilled PO (E6.F2.S1).
**Designs:** [pages/part.html](../pages/part.html), `js/part.js`
**Scope boundaries:** Multi-warehouse beyond the four store locations out of scope. Barcode scanning optional/later.
**Estimate:** M

#### E6.F1.S3 — Adjust & transfer stock (with movement audit)
**User story:** As a parts operator, I want to correct on-hand counts and transfer stock between store locations so that inventory reflects physical reality.
**Acceptance criteria:**
- Given a part, when I perform a cycle-count adjustment with a reason, then on-hand updates and a movement record is written (who/when/why/delta).
- Given a transfer from location A to B, when I confirm, then A decrements and B increments, and both movements are auditable.
- Given an adjustment that would drive stock negative, when submitted, then it's blocked or explicitly flagged per policy.
**Designs:** [pages/adjust-stock.html](../pages/adjust-stock.html), [pages/transfer-stock.html](../pages/transfer-stock.html)
**Scope boundaries:** In-transit tracking for transfers out of scope for v1 (immediate transfer). Transfer is a cross-location action and is exempt from the E2.F3 single-location view restriction by design.
**Technical notes:** All stock changes go through one movement ledger so on-hand is always derivable/auditable.
**Estimate:** M

### Feature E6.F2 — Purchasing & receiving

#### E6.F2.S1 — Create purchase order (prefilled reorder)
**User story:** As a parts manager, I want to raise a PO with the part prefilled so that reordering a low/backordered part is one step from the alert.
**Acceptance criteria:**
- Given a Reorder/Order more entry point, when I open a new PO, then it's prefilled with the part, supplier, and a suggested quantity.
- Given the PO, when I add/adjust lines and submit, then a PO record is created with a unique number and lands on the PO tracking screen.
- Given required fields missing (supplier, qty), when I submit, then validation blocks it.
**Designs:** [pages/new.html](../pages/new.html) (`?type=po&part=…`), [pages/po.html](../pages/po.html), `js/new.js`, `js/po.js`; reorder deep links in [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Multi-line POs across many parts supported; supplier catalog/pricing integration out of scope (manual entry v1).
**Technical notes:** Reuses the E3.F3 `new?type=…` prefill contract.
**Estimate:** M

#### E6.F2.S2 — Track purchase order against shipment ETA
**User story:** As a parts operator, I want to track a PO against the manufacturer's shipment ETA so that I can tell a waiting service writer when the part lands.
**Acceptance criteria:**
- Given a PO, when I open it, then I see its lines, status, and shipment ETA, with actions to add a line, change status, print, and email the vendor.
- Given an ETA update (manual, or from the OEM feed in E9), when applied, then the PO reflects it and any linked service job's parts ETA (E4.F2.S3) can update.
- Given a PO status change, when saved, then it's recorded in history.
**Designs:** [pages/po.html](../pages/po.html), `js/po.js`
**Scope boundaries:** Automatic ETA from the OEM sync is E9 — here ETA is manual, with a seam for E9 to feed it.
**Estimate:** M

#### E6.F2.S3 — Receive against a PO into stock
**User story:** As a parts operator, I want to receive a shipment against its PO — counting, condition, and bin — so that stock is updated and waiting jobs are unblocked.
**Acceptance criteria:**
- Given an arriving PO, when I receive it, then I record received quantity, condition, and bin, and on-hand increases via the movement ledger.
- Given a partial receipt, when recorded, then the PO shows partially received and remains open for the balance.
- Given a fully received PO, when complete, then it moves to Received (terminal) and any backordered service parts lines reflect availability.
**Designs:** [pages/receive.html](../pages/receive.html); "Received" terminal state in [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Over-receipt handling per policy; damaged-goods RMA flow out of scope for v1.
**Technical notes:** Receiving is the event that clears E4's "Waiting on Parts" — emit an event/notification the service side can consume.
**Estimate:** M

---
---

# E7 — Rentals: Fleet, Extension & Return

**Epic goal:** Manage an out-on-rent unit through its lifecycle: see the fleet with due-back dates and overdue stamps, open a rental agreement, extend it, and process the return inspection with damage/meter/fuel charges.

**Why:** Rentals is a distinct department with its own clock — due-back dates, overdue exposure, and condition-based charges at return — that the other flows don't model.

**Out of scope for the epic:** Rental *sales/quoting* of new units (that's Sales, E8); reservation/availability calendar (future).

### Feature E7.F1 — Fleet & agreements

#### E7.F1.S1 — Rental fleet board
**User story:** As a rentals coordinator, I want a board of units on rent with due-back dates and overdue stamps so that I can see what's out and what's late.
**Acceptance criteria:**
- Given the Rentals screen, when it loads for the active location, then units on rent show unit, customer, due-back date, and status, with an Overdue stamp when past due.
- Given an overdue unit, when rendered, then it uses both the Overdue stamp and color treatment.
- Given a unit card, when clicked, then it opens the rental agreement.
**Designs:** [pages/rentals.html](../pages/rentals.html), `js/rentals.js`
**Scope boundaries:** Availability/what's-not-yet-rented view out of scope for v1.
**Estimate:** M

#### E7.F1.S2 — Rental agreement record
**User story:** As a rentals operator, I want the full rental record so that I can see the agreement, unit, term, meter, and charges in one place.
**Acceptance criteria:**
- Given a rental, when I open it, then I see the agreement, unit, term, meter reading, and current charges, with actions to add a charge, change status, edit, and print.
- Given the record, when I add a charge, then it updates the running total.
- Given a status change, when saved, then it's recorded and reflected on the fleet board.
**Designs:** [pages/rental.html](../pages/rental.html), `js/rental.js`
**Scope boundaries:** New rental *creation* is via the E3.F3 launcher (`new?type=rental`). Billing/invoicing of the rental reuses the shared invoice approach where applicable.
**Technical notes:** Rental units are dealer-owned equipment — reuse the E3.F2 unit entity rather than a parallel model.
**Estimate:** M

### Feature E7.F2 — Extend & return

#### E7.F2.S1 — Extend rental
**User story:** As a rentals operator, I want to extend a rental with a new due-back date, term, and added charges so that an ongoing rental stays accurate.
**Acceptance criteria:**
- Given an active rental, when I extend it, then I set a new due-back date/term and any added charges, and the agreement and fleet board update.
- Given a new due-back in the past, when submitted, then validation blocks it.
- Given an extension, when saved, then the change is recorded in history.
**Designs:** [pages/extend.html](../pages/extend.html)
**Scope boundaries:** Pricing/rate-card automation out of scope (charges entered per agreement).
**Estimate:** S

#### E7.F2.S2 — Return inspection / check-in
**User story:** As a rentals operator, I want to check a unit back in — meter, fuel, condition, damage charges — so that the rental closes with the right final charges.
**Acceptance criteria:**
- Given a unit being returned, when I complete check-in, then I record meter, fuel level, condition, and any damage charges, and the total updates.
- Given check-in completion, when confirmed, then the rental moves to Returned (terminal) and the unit is no longer shown as on-rent.
- Given damage charges, when added, then they appear as itemized lines on the final agreement.
**Designs:** [pages/checkin.html](../pages/checkin.html); "Returned" terminal state in [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Post-return refurbishment/service work is a separate Service work order (E4), optionally launched from here as a follow-up. Photo capture of damage optional/later.
**Estimate:** M

---
---

# E8 — Sales: Deal Pipeline to Won

**Epic goal:** Move a deal down the pipeline to a signed, quoted, won sale: a pipeline board by stage with weighted value, a deal record with trade-in and financing, stage advancement, quote line items, and a quote emailed to the customer.

**Why:** Sales is where equipment enters a customer's hands, and a single sale can involve financing, a trade-in, and a manufacturer allocation. The pipeline is how a GM forecasts, and quoting is the deliverable.

**Out of scope for the epic:** Manufacturer allocation/ordering of new units against the deal (touches E9's OEM relationship — model the link but defer deep integration); e-signature.

### Feature E8.F1 — Pipeline & deals

#### E8.F1.S1 — Pipeline board by stage with weighted value
**User story:** As a sales manager, I want deals organized by pipeline stage with a weighted pipeline value so that I can see the health of the book at a glance.
**Acceptance criteria:**
- Given the Sales screen, when it loads for the active location, then deals are grouped by stage and a weighted pipeline value is shown.
- Given a deal card, when clicked, then it opens the deal record.
- Given deals across stages, when the board renders, then each stage's count and value are visible.
**Designs:** [pages/sales.html](../pages/sales.html), `js/sales.js`
**Scope boundaries:** Drag-and-drop stage changes optional/later — stage advancement via the deal (E8.F2.S1) is sufficient for v1.
**Estimate:** M

#### E8.F1.S2 — Deal record: customer, unit, trade-in, financing, quote lines
**User story:** As a salesperson, I want a full deal record so that I can manage the customer, unit, trade-in, financing, and quote in one place.
**Acceptance criteria:**
- Given a deal, when I open it, then I see customer, unit of interest, trade-in, financing, and quote lines, with actions to add a line item, advance stage, and edit.
- Given a trade-in, when entered, then it's reflected in the deal's net figures.
- Given edits, when saved, then they persist and the pipeline value recomputes.
**Designs:** [pages/deal.html](../pages/deal.html), `js/deal.js`
**Scope boundaries:** New deal *creation* is via the E3.F3 launcher (`new?type=deal`). Real financing/credit-app integration out of scope (fields captured, not submitted to a lender).
**Estimate:** L

### Feature E8.F2 — Quote & close

#### E8.F2.S1 — Advance deal stage
**User story:** As a salesperson, I want to push a deal to the next pipeline stage so that the board reflects where the deal really is.
**Acceptance criteria:**
- Given a deal, when I advance the stage, then only valid next stages are offered and the board/weighting updates.
- Given a stage change, when saved, then it's recorded in history with actor/timestamp.
- Given the Won terminal stage, when reached, then the deal is marked closed-won.
**Designs:** [pages/status.html](../pages/status.html) (shared stage/status update), pipeline stages in [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Reuses the shared status component; lost/dead-deal handling via the shared confirm/void flow (E4.F4.S1).
**Estimate:** S

#### E8.F2.S2 — Build quote line items
**User story:** As a salesperson, I want to add unit, options, and trade toward a quote so that the customer gets an accurate priced offer.
**Acceptance criteria:**
- Given a deal, when I add line items (unit, options, trade), then the quote total and net (after trade/financing) compute correctly.
- Given an invalid line (missing price), when saved, then validation blocks it.
- Given a completed quote, when ready, then it can be emailed (E8.F2.S3).
**Designs:** [pages/line-item.html](../pages/line-item.html), `js/line-item.js`
**Scope boundaries:** Manufacturer option/config catalog out of scope (manual entry v1).
**Estimate:** M

#### E8.F2.S3 — Email quote to customer
**User story:** As a salesperson, I want to email the quote to the customer so that the offer is out the door and the deal advances toward close.
**Acceptance criteria:**
- Given a deal with a quote, when I email it, then a formatted quote is sent via the shared email provider, logged on the deal, and the deal advances per the flow.
- Given a missing/invalid customer email, when I try to send, then I'm prompted to fix it first.
**Designs:** [pages/email.html](../pages/email.html), `js/email.js`; email advances the deal toward Won in [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Reuses the E2.F1.S2 email provider and the E4.F3.S3 email pattern. No e-signature/acceptance capture.
**Estimate:** S

---
---

# E9 — Manufacturer Sync & Warranty Integration

**Epic goal:** Build the OEM relationship as a real integration: a transactional sync feed of manufacturer events (credits posted, shipment ETAs, flagged claims), and the warranty claim lifecycle — claim detail, submission to the manufacturer (dealer portal/EDI), and posted credit — with the explicit understanding that a stalled sync directly blocks Service.

**Why:** The manufacturer relationship is specific to how dealer networks work — allocations, warranty claims, and co-op all flow through the OEM. A flagged claim can hold a technician from closing a job, which is why the feed is transactional, not a notification dump.

**⚠️ Required reading:** [docs/pressure-test.html](pressure-test.html) — this addendum stress-tests the concept's sync feed against John Deere's *real* public developer documentation and enumerates what each real-world constraint (auth, rate limits, async claim processing, data shape) changes in the product. **Refine this epic's stories against that document before estimating** — several acceptance criteria here will tighten once the team reads it.

**Out of scope for the epic:** Building a live certified integration with any specific OEM in v1 (that's a per-manufacturer onboarding effort). This epic builds the *integration framework, the sync feed, and the warranty lifecycle* against a well-defined adapter interface, with one reference adapter.

### Feature E9.F1 — OEM integration framework & sync feed

#### E9.F1.S1 — OEM adapter interface & connection config
**User story:** As the platform, I want a manufacturer-integration adapter interface so that each OEM (Deere, etc.) can be onboarded behind one contract instead of bespoke code per manufacturer.
**Acceptance criteria:**
- Given the adapter interface, when a new OEM adapter is added, then it implements a defined contract for auth, event polling/receipt, ETA lookups, and claim submission — without changing feed/claim UI code.
- Given OEM credentials, when configured per location/dealer, then they're stored in the secret store and used by the adapter (never exposed to the client).
- Given the pressure-test findings, when the interface is designed, then it accommodates the real constraints documented there (e.g. token auth, rate limits, async processing).
**Designs:** [pages/manufacturers.html](../pages/manufacturers.html), `js/manufacturers.js`; **constraints in [docs/pressure-test.html](pressure-test.html)**
**Scope boundaries:** One reference/sandbox adapter only in v1; production certification with a specific OEM is a separate onboarding epic.
**Technical notes:** Design against the pressure-test's real-API reality (OAuth, pagination, rate limits, eventual consistency). Build a mock adapter for dev/test so the feed and claims are demoable without live OEM access.
**Estimate:** L

#### E9.F1.S2 — Transactional sync feed (integration log)
**User story:** As an operator, I want a feed of OEM events, each with a business consequence, so that I can act on credits posted, shipment ETAs, and flagged claims — not just read notifications.
**Acceptance criteria:**
- Given OEM events via the adapter, when they arrive, then each appears in the integration log as a transactional line (credit posted, ETA, claim flagged) with its linked record and a clear next action.
- Given a "claim flagged" event, when shown, then it deep-links to the warranty claim (E9.F2).
- Given a shipment-ETA event, when received, then it can update the linked PO's ETA (E6.F2.S2).
- Given a sync failure/stall, when it occurs, then it's visibly surfaced (not silently dropped) because a stalled sync can block Service.
**Designs:** [pages/manufacturers.html](../pages/manufacturers.html); "transactional, not a notification dump" in [README.md](../README.md) and [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Feed shows events and links to their records; it does not itself resolve claims (that's the warranty flow).
**Technical notes:** Idempotent event ingestion (OEM may redeliver). Correlate events to POs/claims/work orders.
**Estimate:** L

#### E9.F1.S3 — Sync health & service-blocking surfacing
**User story:** As a service manager, I want stalled or failed OEM syncs surfaced where they block work so that a flagged claim doesn't silently hold a technician from closing a job.
**Acceptance criteria:**
- Given a work order blocked by an unresolved OEM dependency (e.g. a flagged warranty claim), when the service board/work order renders, then the block is visible and traceable to the sync event.
- Given sync health, when I check it, then I can see last-successful-sync time and any current failures per OEM connection.
- Given a resolved event, when it clears, then the corresponding service block lifts.
**Designs:** service-blocking linkage described in [docs/user-flows.html](user-flows.html) and [README.md](../README.md)
**Scope boundaries:** Depends on E4 for the service-side surface. Alerting/paging on sync health reuses E1.F1.S4 observability.
**Estimate:** M

### Feature E9.F2 — Warranty claims

#### E9.F2.S1 — Warranty claim record
**User story:** As a warranty administrator, I want a claim record with labor, parts, amount, and OEM status so that I can prepare and track a claim against the manufacturer.
**Acceptance criteria:**
- Given a claim (opened from a service job or the feed), when I open it, then I see labor, parts, claimed amount, linked unit/work order, and OEM status, with actions to add labor/parts, change status, and edit.
- Given claim lines, when added/edited, then the claimed amount recomputes.
- Given a claim linked to a work order, when viewed, then it deep-links back to that job.
**Designs:** [pages/warranty.html](../pages/warranty.html), `js/warranty.js`
**Scope boundaries:** Claim eligibility rules per OEM out of scope for v1 (manual preparation). Reuses the E3.F2 unit and E4 work order links.
**Estimate:** M

#### E9.F2.S2 — Submit claim to manufacturer & track to credit
**User story:** As a warranty administrator, I want to submit a prepared claim to the manufacturer and track it to a posted credit so that the dealership recovers what it's owed.
**Acceptance criteria:**
- Given a complete claim, when I submit it, then it's sent via the OEM adapter (portal/EDI) and moves to a submitted/awaiting-credit state.
- Given the OEM responds (async), when a decision/credit arrives via the feed, then the claim updates to Credit posted (terminal) or a rejected/needs-info state with the reason.
- Given a submission error (validation/rate limit), when it occurs, then the claim stays in a safe re-submittable state and the error is surfaced, not lost.
**Designs:** [pages/claim-submit.html](../pages/claim-submit.html); "Credit posted" terminal state and async nature in [docs/user-flows.html](user-flows.html) and **[docs/pressure-test.html](pressure-test.html)**
**Scope boundaries:** Live certified OEM submission is per-manufacturer onboarding; v1 targets the reference/sandbox adapter. The async credit posting arrives via the E9.F1.S2 feed — model the round trip, don't assume synchronous.
**Technical notes:** The pressure-test doc specifically flags async claim processing — design the submit→await→credit round trip accordingly, not as a blocking call.
**Estimate:** L

---
---

# E10 — Dashboard & Cross-Department Reporting

**Epic goal:** Deliver "Today's Board" — the GM's dashboard that leads with what's blocking work — plus the reporting surface, so leadership can tell at a glance whether today is going fine or going sideways.

**Why:** The dashboard leads with the four numbers that matter — open work orders, backordered parts, overdue rentals, pipeline value — over five module boards and a sync feed. It's the product's front door and depends on every department epic for its data.

**Out of scope for the epic:** The department boards themselves (owned by E4–E9). This epic owns the *aggregating dashboard* and *reporting*, consuming each department's data.

### Feature E10.F1 — Dashboard

#### E10.F1.S1 — Dashboard shell with the four blocker KPIs
**User story:** As a GM, I want the dashboard to lead with open work orders, backordered parts, overdue rentals, and pipeline value so that I immediately know what's blocking work today.
**Acceptance criteria:**
- Given the dashboard for the active location, when it loads, then the four headline numbers (open work orders, backordered parts, overdue rentals, weighted pipeline value) are shown prominently and are accurate against source data.
- Given a headline number, when clicked, then it drills into the relevant department board/list filtered to that condition.
- Given a department epic not yet live, when the dashboard renders, then its tile shows a graceful "not yet available" state rather than a zero that reads as real.
**Designs:** [index.html](../index.html), `js/dashboard.js`; four-blocker rationale in [README.md](../README.md)
**Scope boundaries:** The shell can be built in E1 with placeholder tiles; this story wires the real numbers. Module boards are S2.
**Technical notes:** Each KPI reads from its department's API; build tiles to degrade independently so one slow source doesn't block the board.
**Estimate:** M

#### E10.F1.S2 — Five module boards + OEM sync feed tile
**User story:** As a GM, I want the dashboard's module boards — bay board, parts alerts, rental fleet, sales pipeline, OEM sync — so that I can jump from the overview into any department's live state.
**Acceptance criteria:**
- Given the dashboard, when it loads, then each module tile summarizes its department (top items/counts) and links into the full board.
- Given the OEM sync tile, when it renders, then it shows the transactional feed's latest consequential events (E9.F1.S2), not a raw notification list.
- Given each tile, when its department epic ships, then that tile lights up with real data via the same contract.
**Designs:** [index.html](../index.html); module structure in [README.md](../README.md) and [docs/user-flows.html](user-flows.html)
**Scope boundaries:** Deep filtering within tiles out of scope — tiles summarize and link.
**Technical notes:** Land tiles incrementally as E4–E9 deliver; each tile is independently shippable.
**Estimate:** L

### Feature E10.F2 — Reporting

#### E10.F2.S1 — Reporting surface (department KPIs)
**User story:** As a GM, I want a reporting screen with the key operational and financial metrics so that I can review performance beyond today's blockers.
**Acceptance criteria:**
- Given the Reporting screen, when it loads, then it presents the metrics the mockup defines across departments (e.g. service throughput, parts turns, rental utilization, pipeline conversion), for the active location and a chosen date range.
- Given a date range/location filter, when changed, then the figures recompute correctly.
- Given a metric, when I need the detail, then I can export or drill down as the mockup indicates.
**Designs:** [pages/reporting.html](../pages/reporting.html), `js/reporting.js`
**Scope boundaries:** Custom report builder and scheduled emailed reports out of scope for v1. Cross-location roll-up is S2.
**Technical notes:** Reporting reads across all department tables — depends on E4–E9 data being present; scope initial metrics to shipped departments.
**Estimate:** L

#### E10.F2.S2 — Cross-location roll-up view
**User story:** As an owner/GM over multiple stores, I want a roll-up across all four locations so that I can compare and total performance network-wide.
**Acceptance criteria:**
- Given a user with multi-location access, when I choose the roll-up, then metrics aggregate across Fargo/Bismarck/Grand Forks/Minot with per-location breakdowns.
- Given a single-location user, when they open reporting, then the roll-up is not offered (permission-scoped).
- Given the roll-up, when rendered, then totals reconcile with the sum of per-location figures.
**Scope boundaries:** This is the one deliberate exception to E2.F3 single-location scoping — read-only, reporting only, permission-gated.
**Technical notes:** Depends on E10.F2.S1 and E2.F2/F3 (permissions + location model).
**Estimate:** M

---
---

## Backlog summary

| Epic | Features | Stories |
|------|----------|---------|
| E1 — Platform Foundation | 3 | 9 |
| E2 — Identity & Access | 4 | 9 |
| E3 — Customer & Equipment | 3 | 6 |
| E4 — Service | 4 | 11 |
| E5 — Bay View | 2 | 5 |
| E6 — Parts | 2 | 6 |
| E7 — Rentals | 2 | 4 |
| E8 — Sales | 2 | 6 |
| E9 — Manufacturer & Warranty | 2 | 5 |
| E10 — Dashboard & Reporting | 2 | 5 |
| **Total** | **26** | **66** |

**Cross-cutting dependencies to watch:**
- **Location scoping (E2.F3.S1)** touches every department query — land it before E4–E9.
- **The `new?type=…` prefill contract (E3.F3.S1)** is reused by Service, Parts, Rentals, and Sales creation.
- **The shared email provider (E2.F1.S2)** serves password reset, service invoices, and sales quotes.
- **The shared confirm/void component (E4.F4.S1)** is reused across all departments.
- **The status/stage state machines (E4.F1.S4, E8.F2.S1)** and the **torn-ticket + stamp component (E1.F3.S1)** are shared primitives — build once.
- **Parts receiving (E6.F2.S3)** emits the event that clears Service's "Waiting on Parts" (E4).
- **The OEM feed (E9.F1.S2)** feeds PO ETAs (E6), warranty credits (E9.F2), and dashboard/service blocks (E10, E4) — and its stories must be refined against the **pressure-test** doc.

*This backlog is a living document. Stories are contracts about **what** and **why**, and an invitation to collaborate on **how** — engineering owns the implementation path. Refine estimates and split any story the team can't confidently fit in a sprint.*
