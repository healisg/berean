# Berean — Development Handoff

> Keep this file updated as the project progresses. Reference it at the start of each session.

---

## Project location

**Local (Windows):**
```
C:\Users\gheal\OneDrive\LenzoLabs\berean\apps\web
```

**Replit:** the app lives at `apps/web` inside the imported repo root (this is an npm-workspaces monorepo: `apps/web`, `apps/mobile`, `packages/*`). Always run commands from the repo root, targeting the workspace with `--workspace=@berean/web`, or `cd apps/web` first.

---

## Starting the dev server

### Locally (Windows)

```bash
cd C:\Users\gheal\OneDrive\LenzoLabs\berean\apps\web
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

Keep the terminal open while working. Press `Ctrl+C` to stop. Restart after adding new environment variables.

### On Replit

A root `.replit` config is included, so clicking **Run** does the right thing automatically:
- Installs all workspace deps from the root (`npm install`)
- Starts Next.js dev bound to `0.0.0.0` on Replit's assigned `$PORT` (not fixed at 3000 — binding to localhost-only shows a blank webview)
- Opens the **Webview** tab on the forwarded port

Manual equivalent from the Replit Shell tab:
```bash
npm install
npm run dev:replit --workspace=@berean/web
```
`dev:replit` / `start:replit` are Replit-specific scripts on `apps/web/package.json`, wrapping `next dev` / `next start` with `-p $PORT -H 0.0.0.0`.

**Use Secrets, not `.env.local`:** `.env.local` is gitignored and never reaches Replit. Add each variable from the Environment variables table below under **Tools → Secrets** with the same key names — Replit injects them as env vars. Restart the Repl after changing secrets.

**Things that need a one-time fix on Replit:**
- **Supabase OAuth redirect** — add the Repl's URL under Supabase → Authentication → URL Configuration, or Google sign-in fails with a redirect mismatch.
- **YouVersion / ESV key restrictions** — add the Repl's domain to any allow-list.
- **`apps/mobile` (Expo)** — Replit's webview is a browser tab, not a phone; Expo's dev server/QR flow does not map onto it. Keep Expo Go/EAS for mobile — this `.replit` config targets `apps/web` only.
- **Idle sleep** — a free/low-tier Repl sleeps and drops the dev server (Supabase data is unaffected, it is external). Use Replit **Deploy → Autoscale** (already wired in `.replit`) for an always-on URL.

---

## What's built so far

| Feature | Status | Location |
|---------|--------|----------|
| Live Conversation Mode (JW profile) | ✅ Complete | `/profiles/jehovahs-witness/chat` |
| Experience levels (Beginner / Moderate / Experienced) | ✅ Complete | Level selector on profile page |
| Clickable scripture references → verse modal | ✅ Complete | YouVersion API |
| Verse range support (e.g. Acts 10:25–26) | ✅ Complete | Fixed USFM range format |
| Bible translation picker | ✅ Complete | BSB, ASV, LSV, WEB, GNV, ESV |
| Greek / Hebrew word popovers | ✅ Complete | Static lexicon + Claude Haiku fallback |
| Chat history persistence | ✅ Complete | localStorage per profile |
| Debate Practice Mode (JW) | ✅ Complete | `/profiles/jehovahs-witness/practice` |
| Practice session scoring & feedback | ✅ Complete | Score/10, gaps, focus area |
| Progress dashboard | ✅ Complete | `/progress` |
| Supabase auth (email + Google) | ✅ Complete | `/auth` |
| Supabase session storage | ✅ Complete | `practice_sessions` table |

---

## Pending setup steps

### 1. ~~Create the Supabase database table~~ ✅ Done
Go to **supabase.com → your project → SQL Editor → New query**, paste and run:

```sql
create table practice_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  profile text not null default 'jehovahs-witness',
  score integer not null,
  score_label text not null,
  strongest_moment text,
  gaps jsonb default '[]',
  focus_area text,
  message_count integer default 0,
  created_at timestamptz default now()
);

alter table practice_sessions enable row level security;

create policy "Users can view own sessions"
  on practice_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on practice_sessions for insert
  with check (auth.uid() = user_id);
```

### 2. Enable Google sign-in in Supabase ⏳ Come back to this
Go to **Authentication → Providers → Google** and add your Google OAuth credentials from Google Cloud Console.

If running on Replit, also add the Repl's URL as an authorized origin/redirect URI on the Google Cloud OAuth client, alongside the local one — Google matches the exact origin, so each domain needs its own entry.

### 3. ESV API key
Pending approval from Crossway. Once received, set `ESV_API_KEY` in `.env.local` locally and as a Replit **Secret**. Never hardcode it in source.

---

## Key files

| File | Purpose |
|------|---------|
| `src/app/profiles/jehovahs-witness/chat/page.tsx` | Live conversation chat page |
| `src/app/profiles/jehovahs-witness/practice/page.tsx` | Debate practice page |
| `src/app/progress/page.tsx` | Progress dashboard |
| `src/app/auth/page.tsx` | Sign in / sign up (email + Google) |
| `src/app/api/chat/route.ts` | Claude API — live conversation |
| `src/app/api/practice/route.ts` | Claude API — JW roleplay |
| `src/app/api/practice/evaluate/route.ts` | Claude API — session scoring |
| `src/app/api/scripture/route.ts` | Bible verse fetching |
| `src/app/api/lexicon/route.ts` | Greek/Hebrew word lookup |
| `src/lib/supabase.ts` | Supabase client + PracticeSession type |
| `src/lib/lexicon.ts` | Greek/Hebrew static dictionary (~50 terms) |
| `src/lib/scripture-utils.ts` | Scripture reference parsing (USFM) |
| `src/lib/translations.ts` | Bible translation definitions |
| `.env.local` | API keys, local only — do not commit to git (on Replit use Secrets instead) |
| `.replit` | Replit run + deploy config — lives at the **repo root**, not in `apps/web` |
| `ROADMAP.md` | Full feature roadmap with status |
| `HANDOFF.md` | This file |

---

## Environment variables

Same key names in both environments — `.env.local` locally, **Tools → Secrets** on Replit. `.env.local` is gitignored, so it never travels with the repo; secrets must be re-entered once per Repl.

| Variable | Purpose | Status |
|----------|---------|--------|
| `ANTHROPIC_API_KEY` | Claude AI | ✅ Set |
| `YOUVERSION_API_KEY` | Bible verse API | ✅ Set |
| `ESV_API_KEY` | ESV translation | ⏳ Pending Crossway approval |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key | ✅ Set |

`NEXT_PUBLIC_*` vars are inlined at build time — after changing either Supabase value on Replit, restart (or rebuild) rather than just refreshing the webview.

---

## Roadmap status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Core foundation | ✅ Complete |
| Phase 2 | In-the-field utility (practice, NWT comparator, quick cards, offline, voice) | 🔨 In progress — 2.1 done |
| Phase 3 | More opponent profiles (Islam, Mormonism, Unitarianism, Progressive Christianity) | ⬜ Not started |
| Phase 4 | Study mode, daily training, conversation logs, progress tracking | ⬜ Not started |
| Phase 5 | Supabase auth + cloud sync, mobile app, multi-language | 🔨 In progress — auth + session storage done |

Full detail: `ROADMAP.md`

---

## Next up (Phase 2 continuation)

- ~~**2.2** Counterargument Simulator~~ ✅ Done — `/profiles/jehovahs-witness/counterarguments`
- **2.3** NWT vs Original Language Comparator
- **2.4** Quick Reference Cards
- **2.5** Offline mode
- **2.6** Voice input

---

*Last updated: October 2026*
