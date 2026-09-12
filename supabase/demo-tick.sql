-- Run this in the Supabase SQL editor (or via mcp__Supabase__execute_sql)
-- during a live demo to show the dashboard update in real time: it inserts
-- one new risk_snapshot with a slightly perturbed score, which the
-- Realtime subscription in src/hooks/useRiskSnapshots.ts picks up and
-- appends to the EAL trend chart within a second or two.

insert into risk_snapshots (risk_score, expected_annual_loss_inr, value_at_risk_inr, likelihood, financial_impact_inr, captured_at)
select
  greatest(40, least(95, risk_score + (random() * 10 - 5)::int)),
  greatest(15000000, expected_annual_loss_inr + (random() * 4000000 - 2000000)::numeric),
  greatest(50000000, value_at_risk_inr + (random() * 8000000 - 4000000)::numeric),
  likelihood,
  financial_impact_inr,
  now()
from risk_snapshots
order by captured_at desc
limit 1;
