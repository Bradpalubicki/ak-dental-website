## Global Living System
Read before every session: https://www.notion.so/32f663704e4081afb964eddeab7b40e1
Agent Inbox: https://www.notion.so/32f663704e4081f3ac93e81a3782412a
GLS Version: 1.2

**CONFLICT RULE: If anything below conflicts with the Operating Bible, the Bible wins. Flag the conflict. Do not reconcile silently.**

## Post-Push Deploy Verification (MANDATORY)
After every `git push` to main:
1. Wait 30s, then check deploy state via Vercel API (projectId in .vercel/project.json)
2. `BUILDING`/`QUEUED` → wait 30s, poll again (max 5 attempts)
3. `READY` → session complete
4. `ERROR` → DO NOT mark done. Fix the error. Push again. Re-check.
NEVER declare session done until Vercel confirms state: READY.

<!-- IMA:ak-dental-website:gls-header:1.2 -->

---

# ak-dental-website — Briefing Card

## Engine Identity
- **Product:** AK Dental Website + SEO Engine
- **Repo:** `C:/Users/bradp/dev/ak-dental-website`
- **Bible:** `OPERATING_BIBLE_v2.html` — READ THIS FIRST, IT WINS
- **Stack:** Next.js App Router · Supabase · Vercel · Tailwind · TypeScript strict
- **Payments:** None (lead gen only)

## BRIEFING CARD (fill in at session start)
```
LAST DEPLOY:           [check Vercel]
LAST COMMIT:           [git log -1 --oneline]
OPEN SENTRY ERRORS:    [check Sentry]
IN PROGRESS LINEAR:    [check Linear]
LAST VERIFIED WORKING: [list features]
KNOWN BROKEN:          [list issues]
CURRENT_BRANCH:        main
SCHEMA_VERSION:        [check migrations/]
PAYMENT_PROVIDER:      None
JOBS_SYSTEM:           Vercel Cron
```
