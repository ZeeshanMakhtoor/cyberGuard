# CyberGuard AI — Cyber Risk Quantification Platform

CyberGuard AI turns raw security telemetry (vulnerabilities, assets, controls,
threat intel) into a single number the board can act on: **expected annual
financial loss, in ₹**. It's the working prototype for the "Cyber Risk
Quantification Platform" concept — a continuous, AI-assisted alternative to
the annual Low/Medium/High risk register.

Built for a 15-hour hackathon. See [`PLAN.md`](./PLAN.md) for the phased
build plan and the exact prompts used to build each part.

## What it does

- **Quantifies risk in rupees, not ratings** — Expected Annual Loss (EAL) and
  Value at Risk (VaR), rolled up by asset, business unit, and org-wide.
- **Explains what to do about it** — AI-generated mitigation recommendations,
  each with an estimated cost, risk reduction %, and ₹ impact.
- **Answers "what if"** — a scenario simulator (enable MFA, patch criticals,
  segment the network, ...) that shows the before/after risk score, EAL, and
  ROSI (Return on Security Investment).
- **Optimizes a fixed budget** — given "₹1 crore to spend," picks the mix of
  controls that reduces the most risk per rupee.
- **Speaks the language of regulators** — maps risk posture onto ISO 27001,
  NIST CSF, CIS Controls, RBI CSF, and SEBI CSCRF.
- **Executive and technical views of the same data** — one model, two
  dashboards.

## Tech stack

| Layer      | Choice                                                         |
|------------|------------------------------------------------------------------|
| Frontend   | React 19 + TypeScript + Vite 8                                   |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first, no config file)  |
| Components | [shadcn/ui](https://ui.shadcn.com) primitives on top of the existing custom-styled pages |
| Charts     | Recharts                                                          |
| Database   | [Supabase](https://supabase.com) (Postgres + Auth + Realtime)     |
| Hosting    | Vercel / Netlify (frontend) + Supabase (backend), or all-in on Supabase |

## Project structure

```
src/
├── App.tsx                 # page router (simple useState switch, no react-router yet)
├── cg/
│   ├── CyberLayout.tsx      # sidebar + topbar shell
│   └── pages/               # one file per nav item (Dashboard, Assets, Vulnerabilities, ...)
├── components/ui/           # shadcn/ui primitives (button, card, badge, input, ...)
├── lib/
│   ├── utils.ts              # shadcn's `cn()` helper
│   ├── supabaseClient.ts     # Supabase client (reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
│   └── database.types.ts     # hand-written types matching supabase/schema.sql
└── index.css                 # Tailwind import + CyberGuard color tokens + shadcn token mapping

supabase/
├── schema.sql                # tables, RLS policies, realtime publication
└── seed.sql                  # demo data matching what's currently hardcoded in the pages
```

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase URL + anon key once you have a project
pnpm dev                     # http://localhost:8443
```

`pnpm build` / `pnpm preview` for a production build. `npx tsc --noEmit` to
type-check.

## Connecting Supabase (what you need to do)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` then `supabase/seed.sql`.
3. Project Settings → API → copy the **Project URL** and **anon public key**
   into `.env.local` (see `.env.example`).
4. That's it for reads — `src/lib/supabaseClient.ts` picks them up
   automatically. See `PLAN.md` Part 3 for wiring individual pages from
   hardcoded arrays to live queries, and Part 4 for enabling Supabase Auth.

If you'd rather manage the Supabase project through this assistant instead of
the dashboard, connect the **Supabase MCP connector** — see `PLAN.md`
"Tools you need to connect" for exactly how.

## Adding shadcn/ui components

`components.json` is already configured (Tailwind v4, `@/` alias, tokens
mapped in `src/index.css`). On your own machine (this sandbox's network
policy blocks `ui.shadcn.com`, which is why `button`, `card`, `badge`, and
`input` were added by hand instead of via the CLI):

```bash
npx shadcn@latest add dialog table tabs select switch dropdown-menu
```

New shadcn components will automatically pick up the dark CyberGuard palette
because `bg-primary`, `text-muted-foreground`, etc. are mapped to the
project's existing `--accent`, `--muted`, ... CSS variables.

## Design constraints (carried over from the original brief)

- No red/orange/green as primary UI color — severity/status accents may use
  them sparingly (as the existing pages already do for Critical/Ready/Warn),
  but the core palette is the teal/ink scale in `src/index.css`.
- Professional, minimal, enterprise SaaS — no neon, no glow, no hacker/matrix
  aesthetics.
