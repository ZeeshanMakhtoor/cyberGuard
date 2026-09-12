import * as XLSX from "xlsx";

export interface RoadmapItem {
  id: number;
  title: string;
  impact: string;
  status: string;
  effort: string;
  timeframe: string;
  cost: string;
  reduction: string;
  ealSavings: string;
  desc: string;
  controls: string[];
}

/** Generates a remediation roadmap workbook (.xlsx) and triggers a download. */
export function exportRoadmapExcel(items: RoadmapItem[]) {
  const rows = items.map(r => ({
    "#": r.id,
    Recommendation: r.title,
    Impact: r.impact,
    Status: r.status,
    Effort: r.effort,
    Timeframe: r.timeframe,
    "Est. Cost": r.cost,
    "Risk Reduction": r.reduction,
    "EAL Savings": r.ealSavings,
    "Affected Systems / Controls": r.controls.join(", "),
    Description: r.desc,
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = [
    { wch: 4 }, { wch: 42 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
    { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 40 }, { wch: 60 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Remediation Roadmap");

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `cyberguard-remediation-roadmap-${today}.xlsx`);
}

export interface DashboardExcelData {
  generatedAt: Date;
  riskScore: number;
  expectedAnnualLoss: string;
  financialExposure: string;
  totalAssets: string;
  criticalVulnerabilities: string;
  topRisks: { risk: string; asset: string; impact: string; likelihood: string; priority: string }[];
}

/** Generates an executive risk summary workbook (.xlsx) and triggers a download. */
export function exportDashboardExcel(data: DashboardExcelData) {
  const summarySheet = XLSX.utils.json_to_sheet([
    { Metric: "Overall Risk Score", Value: `${data.riskScore} / 100` },
    { Metric: "Expected Annual Loss", Value: data.expectedAnnualLoss },
    { Metric: "Financial Risk Exposure", Value: data.financialExposure },
    { Metric: "Total Assets", Value: data.totalAssets },
    { Metric: "Critical Vulnerabilities", Value: data.criticalVulnerabilities },
    { Metric: "Generated", Value: data.generatedAt.toLocaleString("en-IN") },
  ], { skipHeader: true });
  summarySheet["!cols"] = [{ wch: 26 }, { wch: 24 }];

  const risksSheet = XLSX.utils.json_to_sheet(data.topRisks.map(r => ({
    Risk: r.risk,
    Asset: r.asset,
    "Financial Impact": r.impact,
    Likelihood: r.likelihood,
    Priority: r.priority,
  })));
  risksSheet["!cols"] = [{ wch: 30 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 10 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(workbook, risksSheet, "Top Risk Register");

  const today = data.generatedAt.toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `cyberguard-executive-summary-${today}.xlsx`);
}

export interface ComplianceFrameworkExcel {
  name: string;
  desc: string;
  compliance: number;
  mapped: number;
  missing: number;
  evidence: string;
  assessed: string;
}

/** Generates a per-framework compliance audit report workbook (.xlsx) and triggers a download. */
export function exportComplianceAuditExcel(framework: ComplianceFrameworkExcel) {
  const sheet = XLSX.utils.json_to_sheet([
    { Field: "Framework", Value: framework.name },
    { Field: "Description", Value: framework.desc },
    { Field: "Compliance %", Value: framework.compliance },
    { Field: "Controls Mapped %", Value: framework.mapped },
    { Field: "Missing Controls %", Value: framework.missing },
    { Field: "Evidence Status", Value: framework.evidence },
    { Field: "Last Assessed", Value: framework.assessed },
  ], { skipHeader: true });
  sheet["!cols"] = [{ wch: 22 }, { wch: 55 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Audit Report");

  const slug = framework.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `cyberguard-audit-report-${slug}-${today}.xlsx`);
}
