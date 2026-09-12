-- Demo seed data — mirrors the mock data already hardcoded in the frontend
-- pages, so swapping mock arrays for Supabase queries doesn't change what
-- the demo shows.

insert into controls (name, effectiveness_pct, coverage_pct, risk_reduction_pct) values
  ('Multi-Factor Authentication',      86, 91, 22),
  ('Endpoint Detection & Response',    78, 84, 19),
  ('Firewall & Perimeter Defence',     82, 96, 15),
  ('Network Segmentation',             61, 58, 18),
  ('Backup & Recovery',                90, 88, 12),
  ('Data Encryption',                  84, 79, 14),
  ('Security Monitoring & SIEM',       71, 74, 21)
on conflict (name) do nothing;

insert into recommendations (title, estimated_cost_inr, risk_reduction_pct, financial_risk_reduced_inr) values
  ('Enable MFA for privileged accounts',   450000,  28, 3100000),
  ('Patch critical vulnerabilities',       800000,  21, 2400000),
  ('Improve network segmentation',        1500000,  18, 1900000);

insert into compliance_frameworks (name, description, compliance_pct, mapped_pct, missing_pct, evidence_status, last_assessed) values
  ('ISO/IEC 27001', 'International information security management standard', 84, 92, 8,  'Current',     '2026-08-12'),
  ('NIST CSF',       'Identify, Protect, Detect, Respond, Recover functions',   78, 88, 12, 'Current',     '2026-08-05'),
  ('CIS Controls',   'Prioritized technical safeguards benchmark',              81, 90, 10, 'Current',     '2026-07-20'),
  ('RBI Cyber Security Framework', 'Reserve Bank of India regulatory baseline for banks', 88, 95, 5, 'Current', '2026-09-01'),
  ('SEBI CSCRF',     'Cybersecurity & Cyber Resilience Framework for markets',  73, 82, 18, 'Refresh due', '2026-06-15');

-- Assets, vulnerabilities, threats, risk_snapshots: seed with your own
-- pilot data, or port the arrays already in src/cg/pages/*.tsx 1:1 —
-- that keeps the demo dataset identical while switching the read path
-- from a hardcoded array to a Supabase query.
