# See Skill M v2.0 for pre-build gates: 35d663704e4081a78514c99bb6716c54

## SKILL M v2.0 — PRE-BUILD GATES (operative 2026-05-11)

### LAYER 1 — BEFORE TOUCHING CODE

STEP 1 — PRE-BUILD PURPOSE CHECK
Before touching any file, answer:
"What does a real user do after this ships?"
- Can name a specific user action → log one line to dispatch page:
  "Layer 1 check: PASS — [user action named]. Building."
- Cannot name a user action → file HALT to CA inbox. Do not touch code.

STEP 2 — DONE LOOKS LIKE FEASIBILITY
Can CC complete the DONE LOOKS LIKE in this session?
- Yes → proceed
- No → file HALT to CA inbox before touching code

### LAYER 2 — BEFORE FILING CLAIMED_DONE

STEP 3 — EVAL GATE (all must pass)
- FILE_EXISTS: target files present in repo
- HTTP_200: affected routes return 200
- SMOKE_PASS: Skill B (Vercel Deploy Verifier) — run vercel_deployment_status
- ENV_SET: any new env vars confirmed in Doppler
- DB_TABLE: any new tables exist and are accessible

STEP 4 — DONE LOOKS LIKE TEST
Can CC demonstrate the outcome as a user action right now?
- Yes → file CLAIMED_DONE with git log -1 --oneline included
- No → do not file. Partial work stays in progress.

STEP 5 — POST-PUSH SHA VERIFICATION (locked 2026-05-11)
After every git commit: git push + git ls-remote to confirm SHA
exists on remote before filing CLAIMED_DONE.
No exceptions. F-01 pattern (fabricated remote state) is real.

### HALT RECOVERY
HALT page → CA inbox (tagged FOR: CA).
CA clears by updating HALT page RE-ENTRY CONDITIONS field to CLEARED.
CC reads this field at next session start — not from chat.

## REPO IDENTITY
ENGINE_NAME=ak-dental
DOPPLER_PROJECT=ak-dental
GLOBAL_HUB_PAGE_ID=338663704e40814aaa92fd7293923e4f
LAST_UPDATED=2026-04-16
RUN_QUESTIONS_VERSION=v4.8

## SESSION START PROTOCOL
1. Read this file top to bottom.
2. Extract GLOBAL_HUB_PAGE_ID from REPO IDENTITY block above.
3. Fetch that Notion page in one API call. Read it. Internalize it. Display key state to Brad before doing any work.
4. You now have full fleet context. Begin work.
5. Check Agent Inbox (32f663704e4081f3ac93e81a3782412a). Read open tasks. Begin the top task.
6. Do not ask Brad what the system state is. The hub tells you.


## SESSION START (run in this order, no exceptions)
1. Read this file top to bottom
2. Read MEMORY.md if it exists
3. Fetch Notion Agent Inbox: https://www.notion.so/32f663704e4081f3ac93e81a3782412a
   - Find all items tagged FOR: CC with STATUS: Ready
   - List them to Brad before doing anything else
4. Run `tsc --noEmit` — note errors, do NOT fix unless they are your task
5. Run `vercel env ls` — note any missing vars vs the Bible secrets contract
6. Report back: "Ready. [N] inbox items. [N] TS errors. [N] missing env vars."

## SESSION END (all required before writing Complete)
1. Run `tsc --noEmit` — must pass with zero NEW errors
2. Run `git push`
3. Wait 90 seconds
4. Check Vercel deploy state via API (projectId in .vercel/project.json, teamId: team_bYIyKsRVx31gkNWeZnSU9KaP)
5. If state = READY → proceed to step 6
6. If state = ERROR → STOP. Read the build logs. Fix the error. Re-push. Repeat from step 2.
7. If state = BUILDING → wait 60s and re-check. Max 5 retries.
8. Write Build Results row to Notion DB: 71a68629-8b6f-4e70-97f5-3dc6134628e9
9. Set Alert CA = YES

## NEVER WRITE "Status: Complete" UNTIL VERCEL STATE = READY CONFIRMED

## HARD STOPS (pause and tell Brad before proceeding)
- Spending real money
- Dropping production data or running DELETE without WHERE clause
- Disabling a running production service
- Same error 3 times in a row
- Vercel state = ERROR after 2 re-push attempts

## NEVER STOP FOR
- Reading files
- Running builds / tsc / lint
- Installing packages already in package.json
- Committing and pushing
- Writing to Notion

## REPO IDENTITY
PROJECT_ID: prj_97XbZizPQPmKmGM0rmxmd9x1y7Qy
NOTION_BIBLE: https://www.notion.so/32f663704e4081afb964eddeab7b40e1
LIVE_URL: https://ak-dental-website.vercel.app
PRIMARY_DB: Supabase (see .env.local)

## UI Design Standard

Before building any frontend component, page, or artifact:

1. **Commit to an aesthetic direction first** (luxury/refined, editorial, industrial, brutalist, retro-futuristic, etc.) — never default to generic
2. **Typography**: Use distinctive Google Fonts pairings — never Inter, Roboto, Arial, or system fonts. Pair a display serif with a clean body font.
3. **Color**: CSS variables for all colors. Dominant color + sharp accent. Never purple gradients on white backgrounds.
4. **Motion**: Staggered load animations (animation-delay cascading). Hover states that surprise. CSS-only preferred for HTML.
5. **Atmosphere**: Gradient meshes, grain textures, dramatic shadows, layered transparencies — never flat solid backgrounds.
6. **Layout**: Asymmetry, overlap, grid-breaking elements. Generous negative space OR controlled density — never safe centered columns.

**Every design must be context-specific and unforgettable. No two builds should look the same.**

Color system for Accrefi/NuStack work:
- Navy: #0A1628
- Gold: #F5C842  
- Purple: #7B4FBF (fixed/subscription tools)
- Blue: #2563EB (usage-based tools)
- Green: #16A34A (free/per-transaction tools)
- Gold chips: NuStack-built tools



---

## RUN QUESTIONS
Run Questions: https://www.notion.so/338663704e4081e3939de2f3b7b6c4d3 (v4.3 OPERATIVE — reference only, do not copy)
Trigger: Brad says "run the questions" or "/run-questions" — Two-Pass default
Single-pass: Brad says "quick pass" or "CC only"

---

Q1 — 10 MUST-HAVE ITEMS
List the 10 universal must-haves. For each one, state: PRESENT or MISSING.
1. /api/health endpoint — runtime dependency check
2. CLAUDE.md with populated Briefing Card block
3. Sentry DSN confirmed in Vercel production env
4. All Clerk keys are LIVE (no sk_test_ in production)
5. Bible score is linter-verified (not self-reported)
6. Zone 1 / Zone 2 sections defined in Bible
7. Every cron in vercel.json documented with schedule + status
8. Every DB table documented from schema source files
9. Operator access model explicit (Brad / Ken / CC / CFC)
10. Dependency map — what connects to this engine
Add project-specific must-haves as needed.

---

Q2 — 10 IMPROVEMENTS
Read: current Bible, Sentry top issues, last 3 build results, Briefing Card.
List 10 improvements. Tag each P1 / P2 / P3.
P1 = blocking production or blocking next build.
P2 = high impact, not blocking.
P3 = enhancement, schedulable.
Format: [P1] Fix: description — NUS-XXX or file new Linear issue.

---

Q3 — BUILD WITHOUT ASSUMING
Run ALL of these commands and report every result before answering Q3:

  find src/app/api -name "route.ts" | wc -l
  find src/app/api -name "route.ts" | sed 's|src/app/api/||' | cut -d'/' -f1 | sort | uniq -c
  cat vercel.json | grep path
  find src -name "*.ts" -path "*/db/schema*" | xargs cat
  ls supabase/migrations/ | sort
  cat CLAUDE.md
  cat .env.local | grep -v "#" | cut -d= -f1
  Vercel MCP: last deploy status + commit hash
  Sentry MCP: open issue count + top 5 errors by frequency

Then answer:
- What is missing that would block the build?
- What Brad decisions are needed before code is written?

---

Q4 — 100 USERS TODAY
Evaluate each category. State the failure mode and severity.
Database: N+1 queries? Missing indexes? RLS gaps?
Crons: Race conditions at volume?
Auth: Clerk rate limits at concurrent sessions?
Storage: Bucket scope verified in browser?
Payments: Stripe idempotency? Duplicate charge risk?
Email: Resend rate limits at user volume?
AI: Anthropic per-minute throttle risk?
Monitoring: Sentry noise masking real errors?
Onboarding: Cold account first-run tested?
Data isolation: Client A data visible to Client B in browser?

---

Q5 — GAPS THAT FORCE A REBUILD
List every gap discovered in Q3 and Q4 that, if found after this session ends,
would require a rebuild or rollback.
For each: file a Linear issue tagged research-gap.

---

STANDING RULES — These apply on every build, not just on Run Questions:

ROLLBACK: Before pushing any commit, identify the last known-good commit hash
and document the revert command. State it in the build result.

SUCCESS SIGNAL: TypeScript compiling is NOT a success signal. tsc --noEmit
passing means nothing about runtime. Every build requires a runtime smoke test:
hit /api/health, test one authenticated route, confirm one DB write returned
the expected result.

MIGRATIONS: Before any session touching the DB schema, run:
  ls supabase/migrations/ | sort
Confirm no gaps in the sequence. A missing migration is a silent production killer.

ENV VAR PARITY: .env.local, Vercel Preview, and Vercel Production are three
separate environments. Confirm key parity across all three before any build
that adds or changes env vars.

USER TYPE: Before writing any page or route, confirm: who is the authenticated
user for this surface? Brad only? Client with Clerk account? Unauthenticated
borrower? Anonymous public? State it before writing.

INNGEST: An event-driven feature is not complete until Inngest function
registration is confirmed. A deployed but unregistered function silently never
fires. Confirm registration before closing any Inngest task.

FILE GAPS: Every P1 gap from Q3 or Q4 goes to Linear with label research-gap
before code is written. Gaps do not live only in this terminal session.


---

## CHALLENGE PROTOCOL

Before writing each file:
State whether the spec's assumption for that file is still valid
given everything built so far. If it is not: stop and surface to CA
before continuing.

If you find yourself writing logic the spec never specified:
Stop. State the assumption explicitly. Surface to CA before continuing.

Mid-build checkpoint — mandatory:
After the DB layer is complete, before writing any route or component:
Ask: does this schema actually produce what the UI spec describes?
If the answer is no or unclear: stop. Surface to CA before continuing.

CA does not want to hear about this after the file is written.
CA wants to hear about it before.

## SECRETS RULE
All API keys and secrets live in Doppler.
Never create credentials.md or any secrets file.
Never paste a key into chat, Notion, or a .env file committed to git.
To get a key: doppler run -- [command] or vault_get_key from Brain MCP.
To add a new key: doppler secrets set KEY_NAME=value --project nustack-[engine] --config prd

## Brad Visibility Rules
Brad Visibility Rules: https://www.notion.so/33a663704e408157bfc5e85d034895cb
Before writing any NEEDS BRAD item:
  - Tier 1 (system handles it): do NOT surface to Brad. Log in CLAUDE.md only.
  - Tier 2 (action card needed): file to /api/credential-actions. Do NOT put in chat.
  - Tier 3 (production affected): fire Twilio SMS via agency-engine. Then log.
  - Tier 4 (genuine decision): surface to Brad in chat as A vs B with CA recommendation.
Default: if you're unsure which tier, it's Tier 2. File a card, not a chat message.

## Hero Section Standard

Every marketing page / homepage MUST have a hero section with:

### Layout
- Desktop: Two-column grid — text LEFT, visual RIGHT
- Mobile: Single column — text first, visual below
- Min height: 80vh
- Character fills right column with shadow + rounded corners

### Left column (text) must include IN ORDER:
1. Social proof pill at top (star rating + one testimonial quote, customer name + city)
2. H1 — bold, brand primary color, with ONE accent phrase in brand orange/accent
3. Subline — 1-2 sentences, what it is + who it's for + key differentiator
4. Trust bullets — 3 items max, checkmark + short phrase
5. Two CTAs — primary (filled, brand orange) + secondary (outlined, brand green/dark)

### Right column (visual):
- Hero image or product shot
- Rounded corners, drop shadow
- Floating stat badge on image (bottom-left preferred): big number + label

### Bottom of hero — HIGHLIGHT STRIP (MANDATORY)
- Full-width dark brand color bar (dark green, navy, or primary dark)
- 4 columns on desktop, 2x2 on mobile
- Each column: large bold stat or label + small descriptor below in lighter color
- Content: the 4 most compelling differentiators for that specific vertical
- Height: ~60-80px
- Sits at the absolute bottom of the hero section, flush

### Example strip content by vertical:
| Vertical | Col 1 | Col 2 | Col 3 | Col 4 |
|---|---|---|---|---|
| Kids art/education | 48hrs — Art returned | Local Only — Never shipped | No Surprises — Fixed pricing | Female-Owned — Las Vegas, NV |
| Dental | Same-Day — Emergency slots | In-Network — Most insurances | 5★ Reviews — 200+ patients | Local — [City], [State] |
| Legal/attorney | Free — Initial consultation | 20+ Years — Combined experience | No Fee — Unless you win | Local — [City] courts |
| Equipment rental | Same-Day — Delivery available | No Deposit — Credit card hold | Local Fleet — [City] area | 24/7 — Emergency line |
| Counseling/therapy | Private — HIPAA compliant | Same-Week — New patient slots | Sliding Scale — Available | Telehealth — All Nevada |
| SaaS/tech | Free Trial — 14 days | No Card — Required to start | Cancel — Anytime | Live Support — Real humans |

---

## SESSION ASSUMPTIONS

At the start of every CC session on this engine, CC must confirm the Prerequisite State
before writing any code or running any migrations.

**Required checks before build starts:**
1. Read the Prerequisite State section in the current D3 Brief
2. Confirm every listed service, table, or env var is accessible and ready
3. If any item is NOT confirmed → file BLOCKED to Agent Inbox with:
   - Which prerequisite failed
   - What CC needs to proceed
   - Exact state at halt (last confirmed migration, last successful deploy)
4. Do NOT build around a missing prerequisite. Halt is correct. Fabrication is the failure mode.

**Session start checklist:**
- [ ] Agent Inbox read (new CC tasks? BLOCKED responses from prior sessions?)
- [ ] Prerequisite State for current D3 Brief confirmed
- [ ] Git status clean (or stash documented)
- [ ] Vercel project ID confirmed (use Brad Agent MCP, not memory)

---

## D3 BRIEF STANDARD — 8 Elements (CO-BLUEPRINT-01)

Every CA → CC handoff must include all 8 elements:
1. Task title + priority (P0/P1/P2)
2. Repo path (absolute, e.g., `C:/Users/bradp/dev/ak-dental-website`)
3. Files to touch (or "unknown — CC investigates")
4. Definition of done (specific, verifiable, observable)
5. Known blockers (or "none known")
6. Spend-gate status (CONFIRMED / NOT REQUIRED / PENDING)
7. EVAL GATE CHECKLIST (every line has a named verification tool)
8. Prerequisite State — list every upstream service CC must confirm ready before starting.
   If any prereq not met → file BLOCKED to Agent Inbox. Do not build around it.

## EVAL GATE CHECKLIST

Every D3 Brief task requires all applicable lines to pass before CLAIMED_DONE.

- [ ] FILE_EXISTS: src/app/api/[route]/route.ts
- [ ] HTTP_200: health_check(https://ak-dental-website.vercel.app/api/[route]) expect { pass: true }
- [ ] DEPLOY_READY: vercel_deployment_status(prj_97XbZizPQPmKmGM0rmxmd9x1y7Qy) expect { pass: true }
- [ ] SMOKE_PASS: [Brad Agent MCP tool] expect { pass: true }
- [ ] TWILIO_SMS: twilio_check_recent_sms(+1XXX, withinMinutes=10) expect { pass: true }
- [ ] RESEND_EMAIL: resend_check_recent_email(user@email.com, withinMinutes=10) expect { pass: true }
- [ ] DB_WRITE: supabase_row_count([table], last_5min) expect > 0
- [ ] SCREENSHOT: https://[url] data-testid="[id]" expect_text="[text]"

**Rules:**
- Background processes use DB_WRITE not HTTP_200
- Screenshot checks use `data-testid` — never CSS selectors or class names
- If the element has no data-testid → add it before running the EVAL GATE
- CLAIMED_DONE is blocked if any applicable EVAL GATE line fails

---

## KNOWN REGRESSIONS

Bugs or broken states known at build time. Documented so CC does not silently carry them
or mark features CLAIMED_DONE when a known issue is present.

| Bug | Affected feature | Discovered | Status | Workaround |
|-----|-----------------|------------|--------|------------|
| (none at this time) | — | — | — | — |

**Rule:** If CC discovers a regression mid-build → add a row here before filing CLAIMED_DONE.
Do not bury it in a commit message.
