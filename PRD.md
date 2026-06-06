# SaaS Decision Matrix — MVP Spec

A browser-based decision matrix that helps a solo founder downselect SaaS business ideas using a weighted Desirability / Feasibility / Viability (DVF) framework, inspired by Simon Hoiberg.

---

## 1. Goal

Take a list of SaaS ideas and rank them by composite weighted score across three pillars, with auto-flagging of fatal weaknesses. Replace gut-feel with a repeatable scoring rubric, while preserving Simon's "crosshair" visual intuition.

## 2. Non-goals (MVP)

- No user accounts, login, or backend
- No collaboration / multi-user features
- No AI suggestions, market research lookups, or external API calls
- No export to PDF / image (export-as-JSON only)
- No mobile-first design — desktop-first; mobile can render but isn't optimized
- No demo data / sample ideas

## 3. Framework

### 3.1 Three pillars, equally weighted (33.3% each)

Pillar-level weighting is fixed at the design level (rationale: all three are necessary; over-indexing any one of them produces brittle decisions). Sub-criteria within each pillar are weighted differently with recommended defaults, **user-adjustable** via a weights drawer.

### 3.2 Sub-criteria (3 per pillar, 9 total)

**Desirability (33.3%)**

| Criterion | Weight | Scoring anchors |
|---|---|---|
| Problem severity | 40% | 1 = small + infrequent, 3 = moderate, 5 = big + frequent. Encodes Simon's problem crosshair as one score. |
| Dogfooding fit | 30% | 1 = I'd never use this, 3 = I'd use it occasionally, 5 = I'd use it weekly+ and need it now. |
| Market wedge clarity | 30% | 1 = saturated with no differentiation, 3 = some angle, 5 = clear, defensible wedge in a proven market. |

**Feasibility (33.3%)**

| Criterion | Weight | Scoring anchors |
|---|---|---|
| Time to MVP | 40% | 1 = >6 months, 3 = ~2 months, 5 = ≤4 weeks. |
| Skill match | 35% | 1 = mostly new skills required, 3 = stretch but doable, 5 = squarely in my wheelhouse. |
| Operational complexity | 25% | 1 = 24/7 uptime, heavy infra, many third-party deps; 3 = moderate; 5 = minimal deps, low maintenance. |

**Viability (33.3%)**

| Criterion | Weight | Scoring anchors |
|---|---|---|
| Profitability | 40% | 1 = low revenue + high cost, 3 = moderate margin, 5 = high revenue + low cost. Encodes Simon's profitability crosshair. |
| Distribution path | 30% | 1 = no clear way to reach customers, 3 = some channels, 5 = customers congregate in accessible communities I can reach organically. |
| Willingness to pay clarity | 30% | 1 = "nice to have" / unclear pricing, 3 = plausible, 5 = clear pain + proven willingness to pay for similar tools. |

### 3.3 Composite score formula

For each idea:

```
pillarScore = sum(subScore[i] * subWeight[i]) for each sub-criterion in pillar
compositeScore = (Desirability + Feasibility + Viability) / 3
```

All scores are on a 1–5 scale and displayed to one decimal place.

### 3.4 Auto-flag rule

**If any single pillar score is < 2.0, the idea is flagged RED regardless of composite score.** A weak pillar cannot be averaged away by strength elsewhere. Display a warning banner on flagged ideas in both dashboard and detail views.

### 3.5 Traffic-light thresholds (per pillar)

- 🟢 Green: ≥ 3.5
- 🟡 Yellow: 2.0 – 3.49
- 🔴 Red: < 2.0

---

## 4. UI specification

### 4.1 Screens

There are effectively two views, both on a single page (SPA, no routing needed):

1. **Dashboard** (default landing view)
2. **Idea entry modal** (overlay)

Plus a **help drawer** triggered by a "?" icon.

### 4.2 Dashboard — populated state

Header bar:
- App title ("SaaS Decision Matrix") left
- "?" help icon, "⚙ Weights" button, "Export JSON" / "Import JSON" buttons, "+ New Idea" primary button (right)

Main area, top section — **Comparison table**:
- Columns: `Idea` (name + truncated description on hover) | `Composite` | `Desirability` | `Feasibility` | `Viability` | `Actions`
- Each pillar cell shows the numeric score (e.g. `3.8`) with a colored dot (🟢/🟡/🔴) by threshold
- Composite cell shows score + auto-flag indicator (red warning icon + tooltip "Pillar score below 2.0") if applicable
- Default sort: composite descending; column headers are clickable to re-sort
- Row actions: `Edit`, `Duplicate`, `Delete` (delete confirms first)
- Flagged-red rows have a subtle red left border

Main area, bottom section — **Crosshair visualizations**:
- Two side-by-side 2×2 plots:
  - **Problem crosshair**: X axis = problem frequency (low → high), Y axis = problem size (small → big). Plotted from the Problem severity score (treated as a single combined axis — for MVP, plot all ideas along a 45° line based on the single score; if user later wants to disaggregate, that's a v2 change).
  - **Profitability crosshair**: same treatment for revenue vs. expense, derived from Profitability score.
- Each idea is a labeled dot. Hover shows full idea name + score.
- Quadrants labeled per Simon's terminology: "Great", "Good", "Bad", "Good" (for problem); same convention for profitability.

> Note for Claude Code: the MVP can plot dots on a single diagonal axis derived from the composite Problem severity / Profitability scores. A future v2 could add separate sliders for "size" and "frequency", but that's out of scope here.

### 4.3 Dashboard — empty state (first-time / cleared)

Replaces the comparison table when `ideas.length === 0`:
- Headline: "Score your first SaaS idea"
- Brief 2–3 sentence framework explanation
- Inline mini-version of the scoring rubric (the 9 criteria as a clean card layout)
- The two crosshair diagrams with quadrant labels (no dots — just the framework)
- Large CTA button: "+ Add your first idea"

The empty state IS the instructions — no separate page.

### 4.4 Idea entry modal

Triggered by `+ New Idea` or `Edit`.

Fields:
- Idea name (required, max 80 chars)
- One-line description (optional, max 200 chars)
- Three collapsible sections (Desirability, Feasibility, Viability), each containing 3 sliders (1–5, integer steps)
- Each slider shows: criterion name, current value, weight badge ("40%"), and an info icon revealing the scoring anchors on hover
- Live composite score and pillar scores at the top of the modal, updating as sliders move
- Footer: `Cancel` (secondary), `Save` (primary, disabled until name is filled)

Default slider value on new idea: 3 (neutral midpoint).

### 4.5 Weights drawer

Triggered by `⚙ Weights` in header.

- 9 number inputs grouped by pillar
- Per pillar, the three weights must sum to 100% — show running total, prevent save if invalid
- "Reset to defaults" button
- "Save" button — recomputes all idea scores on save
- Weights are stored in local storage and persist

Pillar-level weights are NOT user-editable in MVP (locked at 33.3% each).

### 4.6 Help drawer

Triggered by "?" icon. Right-side drawer with the same content as the empty-state instructions plus:
- Full scoring anchors for all 9 criteria
- Explanation of the auto-flag rule
- Explanation of traffic-light thresholds
- Brief credit / inspiration note (Simon Hoiberg)

---

## 5. Data model

Single local-storage key: `saas-decision-matrix-v1`

```ts
type AppState = {
  schemaVersion: 1;
  ideas: Idea[];
  weights: Weights; // user's current weights (or defaults)
};

type Idea = {
  id: string;            // uuid
  name: string;
  description: string;
  scores: {
    desirability: { problemSeverity: 1|2|3|4|5; dogfoodingFit: 1|2|3|4|5; wedgeClarity: 1|2|3|4|5 };
    feasibility:  { timeToMvp: 1|2|3|4|5; skillMatch: 1|2|3|4|5; opComplexity: 1|2|3|4|5 };
    viability:    { profitability: 1|2|3|4|5; distributionPath: 1|2|3|4|5; wtpClarity: 1|2|3|4|5 };
  };
  createdAt: string;     // ISO
  updatedAt: string;     // ISO
};

type Weights = {
  desirability: { problemSeverity: number; dogfoodingFit: number; wedgeClarity: number }; // sum = 1.0
  feasibility:  { timeToMvp: number; skillMatch: number; opComplexity: number };
  viability:    { profitability: number; distributionPath: number; wtpClarity: number };
};
```

Default weights:
```ts
{
  desirability: { problemSeverity: 0.40, dogfoodingFit: 0.30, wedgeClarity: 0.30 },
  feasibility:  { timeToMvp: 0.40, skillMatch: 0.35, opComplexity: 0.25 },
  viability:    { profitability: 0.40, distributionPath: 0.30, wtpClarity: 0.30 }
}
```

### 5.1 Storage behavior

- Read on app mount; if key absent or schemaVersion mismatch, initialize with `{ schemaVersion: 1, ideas: [], weights: defaultWeights }`
- Write on every mutation (debounced 250ms is fine but not required for MVP)
- Wrap reads in try/catch — corrupted JSON falls back to fresh state with a one-time toast

### 5.2 Export / Import

- **Export**: download `saas-ideas-YYYY-MM-DD.json` containing the full AppState
- **Import**: file picker; validate schemaVersion matches; on mismatch, show error toast; on success, overwrite current state (prompt to confirm if current state is non-empty)

---

## 6. Tech stack recommendation

**Framework**: Vite + React + TypeScript
- Reason: SPA, no SSR needed, no routing needed. Vite is fastest to scaffold and deploy. Next.js is overkill for a single-page tool with no backend.

**Styling**: Tailwind CSS + shadcn/ui
- Reason: Clean defaults, accessible primitives (modal, drawer, slider, table, toast all pre-built), trivial to theme later. Matches the "clean UI" requirement in the project brief.

**State**: React `useState` + a single `useReducer` for the AppState, plus a `useEffect` that syncs to localStorage. No Redux, no Zustand needed for MVP.

**Charting**: Plain SVG for the 2×2 crosshairs (it's just two lines and labeled dots — no chart library needed). Saves a dependency.

**Build / Deploy**: Vite build → static files → drop into Vercel / Netlify / Cloudflare Pages. Zero backend.

**Recommended file structure**:

```
src/
  App.tsx                    # top-level layout, modal/drawer state
  main.tsx
  state/
    types.ts                 # AppState, Idea, Weights types
    defaults.ts              # default weights, scoring anchors
    reducer.ts               # AppState reducer (add/edit/delete/import/setWeights)
    storage.ts               # localStorage read/write/clear
    scoring.ts               # pillarScore(), compositeScore(), trafficLight(), isFlagged()
  components/
    Header.tsx
    Dashboard.tsx
    ComparisonTable.tsx
    EmptyState.tsx
    Crosshair.tsx            # reusable 2x2 SVG component
    IdeaModal.tsx
    ScoreSlider.tsx
    WeightsDrawer.tsx
    HelpDrawer.tsx
  lib/
    uuid.ts
  index.css                  # tailwind directives
tailwind.config.js
vite.config.ts
tsconfig.json
package.json
```

---

## 7. Acceptance criteria (MVP done = all of these)

1. User can add a new idea via modal, fill name + 9 scores, save it, and see it appear in the comparison table.
2. Comparison table displays composite + 3 pillar scores with correct traffic-light colors.
3. Ideas with any pillar < 2.0 show a red flag indicator in both the table row and the idea modal.
4. User can edit, duplicate, and delete ideas; deletes confirm before destroying data.
5. Sort by composite (default), or click any column header to sort by that column.
6. Weights drawer lets user adjust the 9 sub-weights; pillar weights must sum to 100% to save; recomputes all scores.
7. Empty state renders when no ideas exist, includes the full framework explanation and a CTA.
8. Help drawer is accessible from the header at all times and contains scoring anchors + framework explanation.
9. All data persists in localStorage across page reloads.
10. Export downloads a valid JSON file; import successfully restores from an exported file.
11. Crosshair plots render correctly with all ideas as labeled dots; empty state shows the crosshairs with quadrant labels only.
12. UI is clean and uncluttered — no extraneous chrome, defaults to a single visible action per context.

---

## 8. Inspiration / sources

- Simon Hoiberg (YouTube) — DVF triangle, problem crosshair, profitability crosshair, dogfooding, saturation/wedge
- [Weighted DVF model — David J C Morris](https://medium.com/@davidjcmorris/weighted-dvf-a-simple-model-for-scoring-and-prioritizing-ideas-3591e194ded2)
- [DVF framework — UXPin](https://www.uxpin.com/studio/blog/design-review-template-balancing-desirability-viability-feasibility/)
- Solo-founder criteria research: buildability (4–8 week MVP), distribution, maintenance burden, personal fit
