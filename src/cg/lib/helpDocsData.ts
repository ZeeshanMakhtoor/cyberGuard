import type { CgPage } from "@/App";

export interface DocSection {
  title: string;
  items: string[];
}

export interface PageDoc {
  id: CgPage;
  label: string;
  tagline: string;
  overview: string;
  sections: DocSection[];
}

export const PAGE_DOCS: PageDoc[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    tagline: "Your live cyber risk command center",
    overview:
      "The Dashboard is the first screen you see and gives a continuously-updated snapshot of the organization's overall cyber risk, in both a 0–100 score and a rupee figure the board can act on.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Live KPI Snapshot — six cards: Total Assets, Critical Vulnerabilities, Expected Annual Loss (EAL), Overall Risk Score, Financial Risk Exposure, and AI Recommendations.",
          "\"How is X calculated?\" panel — breaks the Risk Score down into its three weighted factors (Threats 35% · Vulnerabilities 40% · Business Consequence 25%).",
          "Industry Benchmark — shows your percentile against the Banking / BFSI peer median.",
          "FAIR Loss Confidence Range — Min / Most-Likely / Max loss bars, following the FAIR quantification model.",
          "EAL Trend chart, Risk by Asset Criticality donut, Top Risk Contributors bar chart, and a Top Risk Register table.",
          "AI Recommendations preview and an Investment vs. Risk Reduction chart.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click any KPI card to jump straight to the related page (Assets, Vulnerabilities, Risk Analysis, or AI Recommendations).",
          "Use \"Show Formula\" to see exactly how the Risk Score is computed — nothing on this dashboard is a black box.",
          "Use \"Export Excel\" to download the current snapshot for a report or meeting.",
          "The pulsing dot and \"updated Xs ago\" label confirm the numbers are live, not cached.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "EAL (Expected Annual Loss) and Financial Risk Exposure are shown in ₹ Crore (Cr).",
          "Risk Score is 0–100; higher means more risk.",
        ],
      },
    ],
  },
  {
    id: "assets",
    label: "Assets",
    tagline: "Your asset inventory and its risk exposure",
    overview:
      "Assets is the catalog of every IT and security asset the platform tracks. Every risk calculation elsewhere in the app is ultimately rooted in the criticality and exposure you set here.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Summary cards — Total Assets, Critical Assets, Cloud Assets, and High Risk (score ≥ 80).",
          "Asset table — Asset ID, Name, Type, Criticality, Vulnerabilities, Risk Score, Financial Exposure, Owner, and Actions.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click \"+ Add Asset\" to register a new asset — name, type, criticality, owner, business unit, environment, risk score, financial exposure (₹ Lakh), protection status, and whether it's internet-facing.",
          "Use the search box to filter by name or type, and the criticality dropdown to narrow to Critical / High / Medium / Low.",
          "Click \"View\" on any row to open its full detail dialog, including IP, environment, and a \"View Vulnerabilities →\" shortcut.",
          "Click \"Vulns\" to jump directly to that asset's findings on the Vulnerabilities page.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "Risk Score is color-coded: red at ≥ 80, yellow at ≥ 65.",
          "Protection status is one of Protected, Partial, or Unprotected.",
          "Financial exposure is entered in ₹ Lakh.",
        ],
      },
    ],
  },
  {
    id: "vulnerabilities",
    label: "Vulnerabilities",
    tagline: "Prioritized CVEs and security findings",
    overview:
      "Vulnerabilities lists every known CVE or security finding across your assets, ranked so your team always works on what actually reduces risk the most first — not just the highest CVSS score.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "KPI cards — Critical (CVSS 9–10), High (CVSS 7–8.9), Actively Exploited, and Average Age (days).",
          "Vulnerability table — CVE ID, Affected Asset, Priority, Severity, CVSS, Status, Exploit status, Financial Impact, Age, and Action.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click \"Run Scan\" to trigger a simulated scan of your environment.",
          "Filter by Severity (All/Critical/High/Medium/Low) and Status (All/Open/In Progress/Remediated/Accepted).",
          "Toggle \"Sort by Priority\" to bring the highest-priority findings to the top.",
          "Click \"Remediate →\" on any row, or \"Get Remediation Plan →\" at the top, to jump to AI Recommendations.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "Priority = Exploitability × Asset Criticality × CVSS — hover the priority bar for the exact weighting.",
          "Exploit status is one of Active, Public, PoC, or None.",
          "Age over 30 days is flagged red.",
        ],
      },
    ],
  },
  {
    id: "risk",
    label: "Risk Analysis",
    tagline: "FAIR-aligned quantitative risk assessment",
    overview:
      "Risk Analysis is the deep-dive financial view of risk, built on the FAIR (Factor Analysis of Information Risk) methodology, so every number here is defensible in a boardroom or an audit.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Overall Risk Score gauge, alongside MTTR, Open Risks, EAL, Max Exposure, and a peer-benchmark comparison.",
          "\"EAL Trend — Actual vs. If Patched\" area chart.",
          "\"Risk Matrix — Impact vs. Likelihood\" scatter chart.",
          "Security Posture Radar — Current vs. Target across six domains (Access Control, Data Protection, Incident Response, Asset Mgmt, Threat Detection, Patch Mgmt).",
          "\"Risk by Security Domain\" table (Cloud Infrastructure, Corporate Network, Web Applications, Endpoints, Third-party/Supply, Human/Social Engineering).",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click \"What-if Simulator →\" or any domain's \"Simulate →\" link to model a fix before committing budget to it.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "EAL and Max Exposure are shown as FAIR-style Min / Most-Likely / Max ranges in ₹ Crore.",
          "MTTR is Mean Time To Remediate, in days.",
          "Domain risk scores are 0–100, each with its own ₹ Crore exposure.",
        ],
      },
    ],
  },
  {
    id: "threats",
    label: "Threat Intelligence",
    tagline: "Live, sector-relevant threat feed",
    overview:
      "Threat Intelligence surfaces active threats relevant to your sector, pulled from OSINT and commercial feeds, so you know what's actually being used against organizations like yours right now.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Threat-level banner — HIGH / ELEVATED / MODERATE, derived from the most severe tracked threat.",
          "KPI cards — Active Threats, Sector-Relevant, Monitored IOCs, and Feeds Active.",
          "Active Threat Feed — a list of threat cards with type, severity, relevance, description, sector, IOC count, and last-seen time.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click \"Block IOCs\" on a threat card to simulate blocking its indicators of compromise.",
          "Click \"Check Exposure\" to jump to Vulnerabilities and see if you're affected.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "IOC = Indicator of Compromise.",
          "Feed is sector-filtered to Banking / BFSI and updates hourly.",
        ],
      },
    ],
  },
  {
    id: "controls",
    label: "Security Controls",
    tagline: "How effective your deployed controls really are",
    overview:
      "Security Controls shows how well each control you've deployed (IAM, EDR, and others) is actually performing, and how much risk reduction it's contributing to your overall score.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "KPI cards — Controls Tracked, Avg. Effectiveness %, Avg. Coverage %, and Weakest Control.",
          "Control Effectiveness Breakdown — a card per control with Effectiveness and Coverage progress bars and a \"−X% risk\" reduction badge.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click \"View Risk Impact →\" on a control to see how it factors into Risk Analysis.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "Effectiveness % and Coverage % are independent measures — a control can be deployed everywhere (high coverage) but still perform poorly (low effectiveness).",
          "\"Weakest control\" is whichever has the lowest effectiveness score.",
        ],
      },
    ],
  },
  {
    id: "ai",
    label: "AI Recommendations",
    tagline: "AI-ranked, cost-aware remediation actions",
    overview:
      "AI Recommendations is a priority-ranked action list generated by CyberGuard AI, so your team always works on the highest financial-impact item next instead of guessing.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Summary cards — Total Recommendations, Total Est. Investment (₹L), Total EAL Savings (₹L), and Critical Pending.",
          "Filter chips — All / Critical / High / Medium / Pending / In Progress / Planned.",
          "Expandable action cards showing status, Impact, Effort, timeframe, cost, risk reduction %, and EAL savings.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click a card to expand it and see the full description, affected systems/controls, and a cost/risk/EAL summary.",
          "Click \"Add to Roadmap\" to move an item from Pending to In Progress — it will show \"In Roadmap ✓\" once actioned.",
          "Click \"Export Roadmap\" to download the current filtered list to Excel.",
          "Click \"Simulate →\" on a card to model its effect on the What-if Simulator before committing.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "Cost and EAL savings are in ₹ Lakh (L). Effort is Low/Medium/High; Impact is Critical/High/Medium.",
        ],
      },
    ],
  },
  {
    id: "whatif",
    label: "What-if Scenarios",
    tagline: "Model an investment before you make it",
    overview:
      "The What-if Simulator lets you pick a hypothetical security investment and see its projected effect on your Risk Score and Expected Annual Loss before you spend a rupee.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Four pre-built scenarios: Enable MFA for All Privileged Accounts, Patch All Critical Vulnerabilities (CVSS ≥ 9), Deploy 24×7 SOC & Enhanced SIEM, and Implement Network Micro-Segmentation — each tagged with the frameworks/controls it maps to (e.g. CIS Control 5, NIST PR.AC-7).",
          "Active Scenario panel — Current vs. Predicted Risk Score, Risk Reduction, Current vs. Predicted EAL, and Estimated Investment.",
          "Return on Security Investment (ROSI) panel.",
          "Loss Exceedance Curve — a 2,000-trial Monte Carlo simulation with p50/p90 reference lines.",
          "Before vs. After comparison charts for Risk Score and EAL.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Select a scenario card, then click \"▶ Run Scenario\" to run the simulation.",
          "Once results appear, click \"Add to Roadmap →\" to send the scenario to AI Recommendations for execution.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "Risk score deltas are in points; EAL is in ₹ Crore; investment is in ₹ Lakh; ROI is a percentage.",
          "p50/p90 are the median and 90th-percentile loss outcomes from the Monte Carlo run.",
        ],
      },
    ],
  },
  {
    id: "investment",
    label: "Investment Optimization",
    tagline: "Maximum risk reduction per rupee spent",
    overview:
      "Investment Optimization recommends which security initiatives to fund under a stated budget, automatically prioritizing whichever gives you the most risk reduction per rupee.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Available Budget (₹ Lakh) input, with quick-set buttons for ₹50L / ₹100L / ₹200L.",
          "Summary cards — Recommended Spend, Budget Remaining, Est. Risk Reduction, and Initiatives Funded.",
          "Security Initiative table (e.g. MFA, Vulnerability Remediation, Network Segmentation, EDR Improvement, Monitoring) with cost, risk reduction %, and In Plan / Recommended status.",
          "Investment vs. Risk Reduction scatter chart.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Type a budget or use a quick-set button — the recommendation updates live, funding the highest risk-reduction-per-rupee initiatives first until the budget runs out.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "Cost is in ₹ Lakh; the summary displays totals in ₹ Crore where applicable.",
        ],
      },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    tagline: "Framework mapping and audit readiness",
    overview:
      "Compliance maps your live risk and control data onto the regulatory and industry frameworks you report against, so you always know exactly where you stand for an audit.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Overall Security Grade — a letter grade (A–F style) derived from your mean compliance percentage.",
          "Framework Mapping list — one card per framework (e.g. ISO/IEC 27001, NIST CSF, CIS Controls, RBI CSF, SEBI CSCRF) with its own grade, Compliance %, Controls Mapped %, Missing Controls %, Last Assessment date, and an Evidence Current / Evidence Refresh Due badge.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click \"View Full Report\" on a framework to open a detailed report dialog, with a \"Download as Excel\" option.",
          "Click \"Export Audit Report\" to export that framework directly to Excel without opening the dialog.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "Letter grades are derived automatically from the compliance percentage.",
          "\"Missing Controls\" is the share of required controls not yet mapped or evidenced.",
        ],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    tagline: "Board-ready reports, generated automatically",
    overview:
      "Reports generates and manages polished, board-ready security and compliance reports — executive summaries, technical detail, compliance evidence, or full FAIR risk quantification — built from your live data.",
    sections: [
      {
        title: "Key widgets",
        items: [
          "Generated Reports table — Report Name, Date, Type, Status, Size, and Actions.",
          "Scheduled Reports panel — recurring reports (e.g. Weekly Vuln Digest, Monthly Exec Summary, RBI Quarterly Compliance) with their next run date.",
        ],
      },
      {
        title: "How to use it",
        items: [
          "Click \"+ Generate Report\", name it, and choose a type (Executive, Technical, Compliance, Risk, or Intel) — it will show \"Generating…\" then \"Ready\".",
          "Click \"View Report\" to preview the full report, built live from your current data, with a \"Download as Excel\" option.",
          "Click \"Download\" to export directly, or \"Share\" to copy a shareable link to your clipboard.",
        ],
      },
      {
        title: "Terms & units",
        items: [
          "Report size is shown in MB; each type is color-coded for quick scanning.",
        ],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    tagline: "Configure your organization, users, and risk model",
    overview:
      "Settings is where you configure everything that shapes the rest of the platform: your organization profile, users, integrations, notifications, the risk-calculation model itself, AI features, and which compliance frameworks you track.",
    sections: [
      {
        title: "Tabs",
        items: [
          "Organization — Name, Industry, Regulatory Jurisdiction, Fiscal Year. Saved with \"Save Changes\".",
          "Users — invite teammates with \"+ Invite User\" (Name, Email, Role: CISO / Security Analyst / Compliance Officer / IT Admin / Auditor), or remove them.",
          "Security Integrations — Connect / Disconnect data sources (Qualys VM, Splunk SIEM, Okta, CrowdStrike EDR, Wiz CSPM).",
          "Notification Preferences — toggle alerts (critical vulnerabilities, weekly executive digest, threat intel updates, compliance evidence expiry, AI recommendation notifications).",
          "Risk Calculation Settings — Currency, Risk Refresh Interval, VaR Confidence Level, and Asset Criticality Weighting.",
          "AI Settings — toggle AI mitigation recommendations, predictive analytics, the natural-language query assistant, and weekly auto-run scenario simulations.",
          "Framework Settings — toggle which frameworks you track (ISO/IEC 27001, NIST CSF, CIS Controls, RBI CSF, SEBI CSCRF), with a shortcut to Compliance's mapping view.",
        ],
      },
      {
        title: "Defaults",
        items: [
          "Organization defaults to HDFC Bank Ltd., Banking & Financial Services, jurisdiction India (RBI, SEBI).",
          "Risk settings default to currency INR (₹), refresh Continuous (real-time), and VaR confidence 95%.",
        ],
      },
    ],
  },
];
