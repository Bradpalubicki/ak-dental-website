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

