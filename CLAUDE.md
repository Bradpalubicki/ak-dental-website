# NuStack Global Session Protocol
> This block is the same in every NuStack repo. Do not edit it locally.
> Last updated: 2026-03-28

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
Trigger: Brad types "Run Questions" or /rq
Action: STOP all build work immediately. Run the full loop before writing a single line of code.

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
