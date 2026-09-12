-- CyberGuard AI — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`) on a fresh project.
-- Mirrors the shape src/lib/database.types.ts expects.

create extension if not exists "pgcrypto";

create table if not exists assets (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null,
  owner                    text not null,
  business_unit            text not null,
  type                     text not null,
  ip                       text,
  environment              text,
  criticality              text not null check (criticality in ('Critical','High','Medium','Low')),
  risk_score               int  not null check (risk_score between 0 and 100),
  financial_exposure_inr   numeric not null default 0,
  protection_status        text not null check (protection_status in ('Protected','Partial','Unprotected')),
  internet_facing          boolean not null default false,
  created_at               timestamptz not null default now()
);

create table if not exists vulnerabilities (
  id                              uuid primary key default gen_random_uuid(),
  cve                             text not null,
  asset_id                        uuid references assets(id) on delete cascade,
  severity                        text not null check (severity in ('Critical','High','Medium','Low')),
  cvss                            numeric,
  exploitability                  text not null,
  business_criticality            text not null,
  estimated_financial_impact_inr  numeric not null default 0,
  recommended_action              text not null,
  status                          text not null check (status in ('Open','In Progress','Remediated','Accepted')),
  created_at                      timestamptz not null default now()
);

create table if not exists risk_snapshots (
  id                          uuid primary key default gen_random_uuid(),
  business_unit               text,
  risk_score                  int not null check (risk_score between 0 and 100),
  expected_annual_loss_inr    numeric not null,
  value_at_risk_inr           numeric not null,
  likelihood                  numeric not null,
  financial_impact_inr        numeric not null,
  captured_at                 timestamptz not null default now()
);

create table if not exists controls (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null unique,
  effectiveness_pct   int not null check (effectiveness_pct between 0 and 100),
  coverage_pct        int not null check (coverage_pct between 0 and 100),
  risk_reduction_pct  int not null check (risk_reduction_pct between 0 and 100),
  updated_at          timestamptz not null default now()
);

create table if not exists recommendations (
  id                            uuid primary key default gen_random_uuid(),
  title                         text not null,
  estimated_cost_inr            numeric not null,
  risk_reduction_pct            int not null,
  financial_risk_reduced_inr    numeric not null,
  status                        text not null default 'Suggested' check (status in ('Suggested','Accepted','Dismissed','Implemented')),
  created_at                    timestamptz not null default now()
);

create table if not exists threats (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  type         text not null,
  severity     text not null check (severity in ('Critical','High','Medium','Low')),
  relevance    text not null check (relevance in ('High','Medium','Low')),
  sector       text not null,
  ioc_count    int not null default 0,
  description  text not null,
  last_seen    timestamptz not null default now()
);

create table if not exists compliance_frameworks (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,
  description      text not null,
  compliance_pct   int not null check (compliance_pct between 0 and 100),
  mapped_pct       int not null check (mapped_pct between 0 and 100),
  missing_pct      int not null check (missing_pct between 0 and 100),
  evidence_status  text not null check (evidence_status in ('Current','Refresh due')),
  last_assessed    timestamptz not null default now()
);

-- Row Level Security — enabled everywhere, reads require a signed-in user
-- (Supabase Auth, wired up in Part 3 — src/cg/Login.tsx). No write
-- policies are defined, so inserts/updates/deletes are already blocked
-- from the browser (the anon key can only read, and only once authenticated).
alter table assets enable row level security;
alter table vulnerabilities enable row level security;
alter table risk_snapshots enable row level security;
alter table controls enable row level security;
alter table recommendations enable row level security;
alter table threats enable row level security;
alter table compliance_frameworks enable row level security;

create policy "authenticated read" on assets                for select using (auth.role() = 'authenticated');
create policy "authenticated read" on vulnerabilities        for select using (auth.role() = 'authenticated');
create policy "authenticated read" on risk_snapshots         for select using (auth.role() = 'authenticated');
create policy "authenticated read" on controls               for select using (auth.role() = 'authenticated');
create policy "authenticated read" on recommendations        for select using (auth.role() = 'authenticated');
create policy "authenticated read" on threats                for select using (auth.role() = 'authenticated');
create policy "authenticated read" on compliance_frameworks  for select using (auth.role() = 'authenticated');

-- Realtime: expose tables that should push live updates to the dashboard.
alter publication supabase_realtime add table assets, vulnerabilities, risk_snapshots, recommendations, threats;
