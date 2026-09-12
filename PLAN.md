# CyberGuard AI — 15-Hour Build Plan

Source material: `Cyber_Risk_Quantification_Platform.pptx` (12-slide concept
deck — the business case) + the existing Figma Make scaffold in this repo
(dark "CyberGuard AI" dashboard, 8 of 13 pages wired, mock data only).

This plan is split into parts sized to fit in one focused working session
each. Each part ends in a state that **builds, type-checks, and demos** —
never leave the repo mid-refactor between parts. Every part has a
**master prompt**: paste it into a fresh Claude Code session to resume
work with full context and minimal token spend re-deriving what's already
known.

Total budget: ~15 hours. Times are wall-clock estimates, not token counts.

---

## Part 0 — Review & Scaffolding (~1 hr) ✅ DONE

What happened in this session:
- Reviewed the pitch deck and the existing frontend.
- Fixed the broken nav: `App.tsx`'s page switch and the sidebar were
  missing 4 of the pages the requirements call for. Added:
  `CgControls.tsx` (Security Control Effectiveness), `CgInvestment.tsx`
  (Security Investment Optimization, with a live budget input), `CgCompliance.tsx`
  (Compliance & Framework Mapping), `CgSettings.tsx` (Organization / Users /
  Integrations / Notifications / Risk / AI / Framework settings tabs).
- Added `investment` and `compliance` to the `CgPage` union and the sidebar.
- Added shadcn/ui scaffolding: `components.json`, `src/lib/utils.ts`
  (`cn()`), Tailwind v4 token mapping in `src/index.css` (`@theme inline`
  block so `bg-primary`, `text-muted-foreground` etc. resolve to the
  existing teal palette), and hand-written `button`, `card`, `badge`,
  `input` primitives (this sandbox's network policy blocks
  `ui.shadcn.com`, so the CLI couldn't fetch them here — on your machine
  `npx shadcn@latest add <name>` will work normally and will match this
  setup).
- Added Supabase scaffolding: `src/lib/supabaseClient.ts`,
  `src/lib/database.types.ts` (hand-written, matches the schema below),
  `supabase/schema.sql`, `supabase/seed.sql`, `.env.example`.
- Wrote this plan and the top-level `README.md`.

Verified: `npx tsc --noEmit` clean, `vite build` clean.

---

## Tools you need to connect

1. **A Supabase project.** Create one free at supabase.com. Nothing in this
   repo can do that for you. Once created:
   - Run `supabase/schema.sql` then `supabase/seed.sql` in the SQL editor
     (or `supabase db push` with the CLI).
   - Copy Project URL + anon key into `.env.local` (from `.env.example`).
   - Optional but recommended: install **Supabase's MCP server** and connect
     it via your Claude Code / claude.ai MCP settings. With it connected, a
     future session can run migrations, inspect data, and manage the
     project directly instead of you pasting SQL into the dashboard by hand.
     Without it, the manual dashboard flow above works fine — it's a
     convenience, not a requirement.
2. **Vercel** (or Netlify) for hosting the frontend. This session already
   has Vercel MCP tools available — Part 7 uses them to deploy directly.
3. **An Anthropic API key**, only when you get to Part 4 (real AI
   responses instead of canned demo answers). It must live in a Supabase
   Edge Function's environment variables, never in frontend code — the
   browser bundle is public, so a key placed in `VITE_*` env vars is
   effectively leaked to every visitor.
4. **shadcn/ui CLI** — no account needed, just needs network access to
   `ui.shadcn.com` from wherever you run `npx shadcn add`. Works fine
   outside this sandboxed session.

Nothing else requires an external account. Everything else below is code
this assistant can write directly.

---

## Part 1 — Real Data Layer (~2 hrs)

Move off hardcoded arrays onto Supabase, page by page, without breaking the
demo if Supabase isn't configured yet.

**Master prompt:**
> Wire CyberGuard AI's pages to Supabase instead of their hardcoded mock
> arrays. Read `PLAN.md` and `README.md` first for context — this is Part 1.
> `supabase/schema.sql` and `src/lib/database.types.ts` already define the
> shape. Steps:
> 1. Seed `assets`, `vulnerabilities`, `threats`, and `risk_snapshots` in
>    `supabase/seed.sql` with the exact data currently hardcoded in
>    `src/cg/pages/CgAssets.tsx`, `CgVulnerabilities.tsx`,
>    `CgThreatIntel.tsx`, and `CgDashboard.tsx`'s `ealTrend` — so the demo
>    looks identical before/after the switch.
> 2. Add a small `src/hooks/` layer (`useAssets`, `useVulnerabilities`,
>    `useThreats`, `useRiskSnapshots`, `useControls`,
>    `useComplianceFrameworks`) — each a `useEffect` + `useState` Supabase
>    query, returning `{ data, loading, error }`. Keep them dumb; no caching
>    library needed for a hackathon.
> 3. If `VITE_SUPABASE_URL` is unset, each hook should fall back to
>    returning the original mock array (so the app still demos with zero
>    setup) — check `import.meta.env.VITE_SUPABASE_URL` once at module load,
>    not per-render.
> 4. Update `CgDashboard`, `CgAssets`, `CgVulnerabilities`, `CgThreatIntel`,
>    `CgControls`, `CgCompliance` to use the hooks instead of the inline
>    consts. Keep the JSX and styling untouched — only the data source
>    changes. Add a simple loading skeleton (a pulsing div matching the
>    content's rough shape) for the `loading` state.
> 5. Verify with `npx tsc --noEmit` and `pnpm build`. Do not start the dev
>    server unless asked — this environment's Supabase project doesn't
>    exist yet, so network calls will fail; the mock-fallback path is what
>    should be tested.

---

## Part 2 — Realtime (~2 hrs)

Make the dashboard actually feel "continuous," per the deck's core pitch
("not a static annual snapshot").

**Master prompt:**
> Part 2 of the CyberGuard AI build (see `PLAN.md`). Part 1 added Supabase
> read hooks with mock fallback. Now add realtime:
> 1. In `useRiskSnapshots` and `useVulnerabilities` (from Part 1), subscribe
>    to `supabase.channel(...).on('postgres_changes', ...)` for INSERT/UPDATE
>    on `risk_snapshots` and `vulnerabilities`, and merge changes into local
>    state. Unsubscribe on unmount.
> 2. `supabase/schema.sql` already runs `alter publication supabase_realtime
>    add table ...` for these — confirm it covers every table you subscribe
>    to.
> 3. Add a small "Live" indicator (pulsing dot + "Updated Xs ago") to
>    `CgDashboard`'s header, driven by the last realtime event timestamp.
> 4. For demoing the realtime effect without waiting for real telemetry,
>    add a `supabase/functions/simulate-telemetry` Edge Function (or a
>    simple SQL snippet in a `supabase/demo-tick.sql`) that inserts one new
>    `risk_snapshots` row with a slightly perturbed score — good enough to
>    show the dashboard update live during a demo.
> 5. Verify `npx tsc --noEmit` and `pnpm build` still pass.

---

## Part 3 — Auth (~1.5 hrs)

**Master prompt:**
> Part 3 of the CyberGuard AI build (see `PLAN.md`). Add Supabase Auth:
> 1. Add a minimal login screen (`src/cg/Login.tsx`) — email + password via
>    `supabase.auth.signInWithPassword`, matching the existing dark theme
>    (reuse `--panel`/`--accent`/`--border` tokens, no new palette).
>    Also support `supabase.auth.signUp` behind a toggle link — a hackathon
>    demo needs to self-serve a test account.
> 2. In `App.tsx`, gate the whole `CyberLayout` behind
>    `supabase.auth.getSession()` / `onAuthStateChange`; show `Login` when
>    there's no session.
> 3. Replace the hardcoded "Rahul Pandey · CISO · HDFC Bank" in
>    `CyberLayout.tsx`'s sidebar footer and topbar with the logged-in
>    user's email (and a sensible placeholder org name — don't over-build a
>    multi-tenant org model for a hackathon).
> 4. Add a "Sign out" action (topbar avatar → shadcn `DropdownMenu` —
>    install it first: `npx shadcn@latest add dropdown-menu`, or hand-write
>    it in the same style as `src/components/ui/button.tsx` if
>    `ui.shadcn.com` isn't reachable from wherever this runs).
> 5. `npx tsc --noEmit` and `pnpm build` must pass without a live Supabase
>    session — a logged-out state (the Login screen) is what should render
>    and build correctly by default.

---

## Part 4 — Real AI (~2 hrs)

The deck's differentiator (mitigation recommendations, scenario simulation,
natural-language query) currently exists as static/deterministic UI
(`CgRecommendations.tsx`, `CgWhatIf.tsx`, and the requirements' "floating AI
Assistant" chat panel, which hasn't been built yet). This part makes at
least one of those genuinely AI-driven — pick the natural-language
assistant, since it's the most demo-visible.

**Master prompt:**
> Part 4 of the CyberGuard AI build (see `PLAN.md`). Add the floating
> "CyberGuard AI Assistant" chat button + panel described in
> `src/imports/pasted_text/project-requirements.md` section 18 — it hasn't
> been built yet (check `src/cg/` — there's no `AIAssistant.tsx`). Steps:
> 1. Create `src/cg/AIAssistant.tsx`: a floating button bottom-right
>    (fixed position, `var(--accent)` background, chat icon), opens a panel
>    with a message list + input, styled consistently with the rest of the
>    app (rounded-xl cards, `var(--panel)` background).
>    Mount it once in `CyberLayout.tsx` so it's available on every page.
> 2. Create a Supabase Edge Function `supabase/functions/ai-assistant` that
>    takes `{ question: string }`, calls the Claude API (Messages API,
>    model `claude-sonnet-5` unless the user specifies otherwise) with a
>    system prompt describing CyberGuard AI's current risk posture (feed it
>    a compact JSON summary — top risks, EAL, VaR, recent recommendations —
>    pulled from the same tables Part 1 wired up), and returns the answer.
>    The Anthropic API key is an Edge Function secret
>    (`supabase secrets set ANTHROPIC_API_KEY=...`), never a `VITE_*` var.
> 3. Frontend calls `supabase.functions.invoke('ai-assistant', { body: {
>    question } })`. If the function isn't deployed / key isn't set yet,
>    fall back to canned responses for the four example questions in the
>    requirements doc (`"What is our highest financial cyber risk today?"`
>    etc.) so the panel still demos with zero backend setup.
> 4. `npx tsc --noEmit` and `pnpm build` must pass; the canned-response path
>    is what gets exercised without a deployed function, so make sure it
>    actually works standalone.

---

## Part 5 — shadcn/ui Expansion & Interaction Polish (~2 hrs)

**Master prompt:**
> Part 5 of the CyberGuard AI build (see `PLAN.md`). `components.json` and
> `button`/`card`/`badge`/`input` primitives already exist in
> `src/components/ui/`. Run `npx shadcn@latest add dialog tabs select switch
> table` (falls back to hand-writing them in the same pattern if
> `ui.shadcn.com` is unreachable). Then:
> 1. `CgVulnerabilities.tsx` and `CgAssets.tsx`: replace their ad hoc filter
>    controls with shadcn `Select` (severity/status filters) — keep the
>    existing table markup, just swap the filter inputs.
> 2. `CgReports.tsx`: "View Report" opens a shadcn `Dialog` with a report
>    preview instead of doing nothing.
> 3. `CgSettings.tsx`: replace the hand-rolled section-switch buttons with
>    shadcn `Tabs`, and the hand-rolled `Toggle` component with shadcn
>    `Switch`.
> 4. Add a shadcn `Sonner`/`Toast` for action feedback (e.g. "Report
>    generated", "Recommendation accepted" in `CgRecommendations.tsx`).
> 5. Don't touch pages not listed above — this part is additive polish, not
>    a rewrite. `npx tsc --noEmit` and `pnpm build` must stay clean.

---

## Part 6 — QA & Responsive Pass (~1.5 hrs)

**Master prompt:**
> Part 6 of the CyberGuard AI build (see `PLAN.md`) — no new features.
> 1. Run the app (`pnpm dev`) and click through all 12 pages plus the AI
>    assistant panel from Part 4. Note anything broken, misaligned, or
>    using red/orange/green as a *primary* UI color (severity indicators are
>    fine per the design brief; a button or nav highlight in red/green is
>    not).
> 2. Check every page at ~400px width (phone) — the sidebar already
>    collapses behind a hamburger in `CyberLayout.tsx`; verify tables in
>    `CgVulnerabilities`/`CgAssets`/`CgReports` scroll horizontally inside
>    their own container rather than breaking page layout.
> 3. Fix what you find. Keep diffs small and targeted per issue.
> 4. Final `npx tsc --noEmit` and `pnpm build`.

---

## Part 7 — Deploy (~1 hr)

**Master prompt:**
> Part 7 of the CyberGuard AI build (see `PLAN.md`). Deploy the frontend:
> 1. Confirm `pnpm build` is clean.
> 2. Use the Vercel MCP tools available in this session to create/deploy the
>    project from this repo. Set `VITE_SUPABASE_URL` and
>    `VITE_SUPABASE_ANON_KEY` as Vercel project env vars (ask the user for
>    their production Supabase project's values if this session doesn't
>    already have them).
> 3. If Part 4's Edge Function is ready, deploy it too
>    (`supabase functions deploy ai-assistant`) and set its
>    `ANTHROPIC_API_KEY` secret.
> 4. Smoke-test the deployed URL: login, dashboard loads real data, at least
>    one realtime update visible, AI assistant responds.
> 5. Update `README.md`'s "Getting started" with the live URL.

---

## Notes for whoever picks this up mid-hackathon

- Every part above is independently demoable — if time runs out after
  Part 3, you still have a working, deployed, authenticated dashboard
  reading live Supabase data. Nothing later is required for the earlier
  parts to work.
- The deck's real differentiators, in order of demo impact per hour spent,
  are: (1) rupee-denominated risk numbers — already in the UI from the
  original scaffold, (2) the What-if simulator — already built
  (`CgWhatIf.tsx`), (3) realtime — Part 2, (4) the AI assistant — Part 4.
  If you're short on time, skip Part 5 (polish) before you'd skip Part 2 or
  4 — judges will notice "does it feel alive and AI-powered" more than
  "is the filter a native `<select>` or a shadcn one."
