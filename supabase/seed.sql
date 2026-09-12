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

-- Assets — ported 1:1 from src/cg/pages/CgAssets.tsx so the switch to a
-- live query doesn't change what the demo shows.
insert into assets (name, owner, business_unit, type, ip, environment, criticality, risk_score, financial_exposure_inr, protection_status, internet_facing) values
  ('Core Banking Server (CBS-01)', 'IT Ops',      'Banking Ops',  'Server',  '10.0.1.10',    'On-prem', 'Critical', 89, 120000000, 'Partial',     false),
  ('Customer Web Portal',          'Engineering', 'Digital',      'Web App', '203.0.113.5',  'AWS',     'Critical', 84, 9200000,   'Partial',     true),
  ('Mail Gateway (MX-01)',         'IT Ops',      'IT',           'Server',  '10.0.2.15',    'On-prem', 'High',     77, 5600000,   'Protected',   true),
  ('HR Self-Service Portal',       'HR Dept',     'HR',           'Web App', '10.0.3.22',    'Azure',   'High',     71, 4300000,   'Partial',     true),
  ('AWS S3 Data Lake',             'Data Team',   'Analytics',    'Cloud',   'AWS Global',   'AWS',     'High',     65, 3800000,   'Partial',     false),
  ('Corporate VPN Gateway',        'Network',     'IT',           'Network', '10.0.0.1',     'On-prem', 'High',     63, 2900000,   'Protected',   true),
  ('AD Domain Controller',         'IT Ops',      'IT',           'Server',  '10.0.1.5',     'On-prem', 'Critical', 61, 7500000,   'Protected',   false),
  ('ERP System (SAP)',             'Finance',     'Finance',      'Server',  '10.0.1.20',    'On-prem', 'Critical', 79, 8800000,   'Partial',     false);

-- Vulnerabilities — ported from CgVulnerabilities.tsx, linked to the asset
-- whose name matches the original "asset" label (fuzzy on purpose: the demo
-- data predates real asset FKs).
insert into vulnerabilities (cve, asset_id, severity, cvss, exploitability, business_criticality, estimated_financial_impact_inr, recommended_action, status)
select v.cve, a.id, v.severity, v.cvss, v.exploitability, v.business_criticality, v.impact, v.action, v.status
from (values
  ('CVE-2024-21413', 'Mail Gateway (MX-01)', 'Critical', 9.8,  'Public', 'High',     4200000, 'Patch mail server RCE',                'Open'),
  ('CVE-2023-44487', 'Corporate VPN Gateway','High',     7.5,  'Public', 'Medium',   2800000, 'Update load balancer firmware',        'Open'),
  ('CVE-2024-6387',  'AD Domain Controller', 'Critical', 8.1,  'PoC',    'High',     5400000, 'Patch OpenSSH RCE',                    'Open'),
  ('CVE-2021-44228', 'ERP System (SAP)',     'Critical', 10.0, 'Active', 'Critical', 8800000, 'Confirm Log4j remediation coverage',   'Remediated'),
  ('CVE-2023-35078', 'HR Self-Service Portal','Critical',10.0, 'Active', 'High',     3400000, 'Patch MDM auth bypass',                'Open'),
  ('CVE-2024-4577',  'Customer Web Portal',  'Critical', 9.8,  'Active', 'High',     2100000, 'Patch PHP CGI RCE',                    'Open'),
  ('CVE-2022-26134', 'AWS S3 Data Lake',     'Critical', 9.8,  'Active', 'Medium',   4500000, 'Confirm Confluence patch coverage',    'Remediated')
) as v(cve, asset_name, severity, cvss, exploitability, business_criticality, impact, action, status)
join assets a on a.name = v.asset_name;

-- Threats — ported from CgThreatIntel.tsx.
insert into threats (name, type, severity, relevance, sector, ioc_count, description, last_seen) values
  ('BlackMatter Ransomware',                    'Ransomware', 'Critical', 'High',   'Banking', 37,  'Actively targeting BFSI sector in South Asia. Exploits CVE-2024-21413 as initial access.', '2026-08-28'),
  ('APT41 (Double Dragon)',                     'APT',        'Critical', 'High',   'Finance', 124, 'Chinese state-sponsored group. Recent campaigns against Indian financial institutions via spear-phishing.', '2026-08-25'),
  ('Phishing Kit: Bank-Impersonation v3',       'Phishing',   'High',     'High',   'Banking', 8,   'Active phishing kit mimicking major bank login pages. Hosted on .xyz domains.', '2026-08-30'),
  ('Cobalt Strike Beacon C2',                   'C2 Server',  'High',     'Medium', 'All',     3,   'Known C2 infrastructure observed in Indian telco ranges. Linked to financial sector campaigns.', '2026-08-27'),
  ('Clop Ransomware',                           'Ransomware', 'High',     'Medium', 'BFSI',    19,  'Exploiting Accellion / MOVEit vulnerabilities. Data exfiltration before encryption.', '2026-08-20');

-- Risk snapshots — the EAL trend from CgDashboard.tsx, in raw ₹ (crore * 1e7).
insert into risk_snapshots (business_unit, risk_score, expected_annual_loss_inr, value_at_risk_inr, likelihood, financial_impact_inr, captured_at) values
  (null, 74, 31000000, 87000000, 0.62, 87000000, '2025-09-01'),
  (null, 71, 29000000, 84000000, 0.60, 84000000, '2025-10-01'),
  (null, 76, 34000000, 91000000, 0.64, 91000000, '2025-11-01'),
  (null, 73, 30000000, 85000000, 0.61, 85000000, '2025-12-01'),
  (null, 69, 27000000, 80000000, 0.57, 80000000, '2026-01-01'),
  (null, 66, 25000000, 76000000, 0.55, 76000000, '2026-02-01'),
  (null, 70, 28000000, 82000000, 0.58, 82000000, '2026-03-01'),
  (null, 75, 32000000, 89000000, 0.63, 89000000, '2026-04-01'),
  (null, 72, 29000000, 84000000, 0.60, 84000000, '2026-05-01'),
  (null, 68, 26000000, 78000000, 0.56, 78000000, '2026-06-01'),
  (null, 72, 24500000, 87000000, 0.59, 87000000, '2026-07-01'),
  (null, 72, 24500000, 87000000, 0.59, 87000000, '2026-08-01');
