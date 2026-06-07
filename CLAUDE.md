# The Idea Matrix — project notes (for Claude)

A static, single-page SaaS-idea decision-matrix tool. A solo founder scores the
ideas they're considering across 9 weighted criteria under 3 pillars
(Desirability / Feasibility / Viability), and the matrix ranks them, flags fatal
weaknesses, and shows the strongest one.

- **Live:** https://theideamatrix.com (also https://isaacvaughan21-cmyk.github.io/SaaSDM/)
- **Repo:** https://github.com/isaacvaughan21-cmyk/SaaSDM  (default branch `main`)
- **Owner/founder:** Isaac (isaacvaughan21@gmail.com), new to SaaS, mechanical-eng background.
- **Local path:** `C:\Claude Cowork\SaaS\SaaS Decision Matrix\SaaS Decision Matrix`
- Windows machine. `gh` CLI is NOT installed; use the web UI for GitHub settings.

## Stack
- **Vite 7** + **React 19** + **TypeScript**, **Tailwind CSS v4** (via `@tailwindcss/vite`).
- **Supabase** (`@supabase/supabase-js`) for backend (email list + feedback).
- **jsPDF** + `jspdf-autotable` (lazy-loaded) for the PDF export.
- Fonts via Google Fonts `<link>` in `index.html`: **Fraunces** (display serif) + **Instrument Sans** (body).

### Critical tooling history / gotchas
- Tailwind **v3 + PostCSS had a dev-mode bug** here: `npm run dev` injected only the
  base layer (no utilities) → app looked unstyled. **Fixed by migrating to Tailwind v4
  + `@tailwindcss/vite`.** Do NOT go back to v3/PostCSS. Theme is defined with `@theme`
  tokens in `src/index.css` (class names like `bg-ink`, `text-paper`, `border-line`,
  `font-display`, `shadow-card`).
- The scaffold originally pulled **Vite 8 (beta)** which also broke dev; pinned to **Vite 7**.
- **Watch for zombie `npm run dev` processes** on port 5173 from old sessions — they serve
  stale builds and cause confusing "it's broken" reports. Kill the port if a fresh dev
  server reports "Port 5173 is in use, trying another one…".
- **MCP preview server caches CSS** across restarts — verify visual changes against the
  **production build** (`npm run build` + `vite preview`) when in doubt, or curl the live site.
- `vite preview` serves at the base path; with relative base it's at `http://localhost:4173/`.

## Design system (editorial, intentionally NOT "AI-generated")
- Warm paper background `#FBFAF6`, near-black ink `#1B1A17`. Brand is **monochrome ink/paper**.
- **Colour is reserved for data only:** Okabe-Ito colourblind-safe palette
  (good `#0072B2`, mid `#E69F00`, bad `#D55E00`) for score traffic-lights, shown as
  **shapes + colour** (▲ Strong / ● Caution / ▼ Weak) — the owner is colourblind, keep redundancy.
- Pillars use neutral ink shades (see `PILLAR_COLORS` in `src/state/defaults.ts`):
  desirability `#1B1A17`, feasibility `#46423B`, viability `#6B6660`. The venn and the
  scoring-framework headers share these so they read as one system.
- Comparison-table rows are tinted neutral grey by composite score (darker = better),
  with a "★ Top pick" badge on the best idea.

## Scoring model (see `src/state/`)
- 3 pillars, equal 33.3% each. 9 sub-criteria, each weighted, scored 1–5.
- `scoring.ts`: `pillarScores`, `compositeScore` (mean of 3 pillars), `trafficLight`
  (≥3.5 green / 2.0–3.49 yellow / <2.0 red), `isFlagged` (any pillar <2.0 → flagged).
- State in `useReducer` + localStorage key `saas-decision-matrix-v1`. No accounts.
- `defaults.ts` has `CRITERIA` with `label` (Title Case), `weightPct`, `description`
  (shown via ⓘ tooltip in the slider), and `anchors` (always shown under the slider).

## Key components (`src/components/`)
- `Header` — lightbulb logo (img `src/assets/lightbulb.jpg`, multiply blend) + "The Idea Matrix";
  buttons: feedback (chat icon), Weights, Export PDF, New idea.
- `Hero` — editorial headline; primary CTA "Score a new idea"; secondary "How it works"
  smooth-scrolls to `#framework`.
- `Dashboard` / `EmptyState` — empty state shows an **ExampleMatrix** (sample data),
  the DVF venn (`DVFTriangle`), and the **Scoring Framework** (`RubricCards`).
- `ComparisonTable` — sortable, neutral row shading, ScoreDot markers. Edit/Delete only
  (Duplicate was removed). `ScoreDot.tsx` exports `LIGHT_STYLES` + `ScoreLegend`.
- `DVFTriangle` — venn; circles + labels in pillar shades; bulb image in the centre
  overlap; labels sit outside the circles ("People want it." etc.).
- `IdeaModal`, `WeightsDrawer`, `FeedbackDrawer`, `FounderNote`.

## Backend — Supabase
- Project ref: `ggcjyevedvmrpvsapypo` → URL `https://ggcjyevedvmrpvsapypo.supabase.co`.
- Anon key (public, RLS-protected) is in **`.env.production`** (committed) and `.env.local`
  (gitignored). Vite vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Tables (see `supabase/schema.sql`): `subscribers` (email unique) and `feedback`
  (type 'feature'|'bug', message). **RLS: anon can INSERT only; nobody can read via the
  API** — owner reads in Supabase Table Editor.
- `src/lib/supabase.ts`: `addSubscriber`, `addFeedback`. If env vars are missing the
  helpers return `'unconfigured'` and the forms fall back to a `mailto:` to the owner.
- FounderNote signup → `subscribers`; FeedbackDrawer → `feedback` (no email step for visitor).

## Deployment — GitHub Pages via Actions
- `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
- **Custom domain** `theideamatrix.com` via `public/CNAME`. DNS at **Squarespace**:
  apex A records → GitHub IPs (185.199.108–111.153), AAAA → 2606:50c0:800x::153,
  `www` CNAME → `isaacvaughan21-cmyk.github.io`. HTTPS is enforced (cert issued by GitHub).
- **`vite.config.ts` uses `base: './'`** (relative) so the build works at both the
  github.io subpath and the custom-domain root. Do NOT set a hardcoded `/SaaSDM/` base.

## Commands
- Dev: `npm run dev` (http://localhost:5173). Build: `npm run build`. Preview: `npm run preview`.
- Commit style: imperative summary + body; end with
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
  Only commit/push when asked (owner has been asking for it each change). Branch is `main`.

## Open / possible next steps (not yet done)
- New-feedback notifications (Supabase Database Webhook → email/Slack/Discord).
- Sending broadcasts to the email list (Supabase only stores; needs an ESP later).
- Basic spam protection (honeypot / rate limit / captcha) on the public forms.
- Clean up the 2 connection-test rows in Supabase (feedback "__connection test__",
  subscriber connection-test@example.com) if still present.
