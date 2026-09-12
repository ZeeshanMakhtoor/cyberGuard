import * as XLSX from "xlsx";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/**
 * Downloads a workbook with the correct Excel MIME type. XLSX.writeFile()
 * builds its blob as generic application/octet-stream, which some browsers
 * and antivirus/download-protection tools (common on locked-down Windows
 * laptops) silently block or strip. Building the blob ourselves with the
 * real spreadsheet MIME type avoids that.
 */
function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], { type: XLSX_MIME });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

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
  downloadWorkbook(workbook, `cyberguard-remediation-roadmap-${today}.xlsx`);
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
  downloadWorkbook(workbook, `cyberguard-executive-summary-${today}.xlsx`);
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
  downloadWorkbook(workbook, `cyberguard-audit-report-${slug}-${today}.xlsx`);
}

export interface GeneratedReport {
  name: string;
  type: string;
  date: string;
}

/** A section of a generated report — see src/lib/reportContent.ts. */
export interface GeneratedReportSection {
  title: string;
  kv?: { label: string; value: string }[];
  table?: { headers: string[]; rows: (string | number)[][] };
}

/**
 * Generates a report workbook (.xlsx): one "Report Info" sheet, then one
 * sheet per report section (live data, matching the on-screen preview).
 */
export function exportGeneratedReportExcel(report: GeneratedReport, sections: GeneratedReportSection[] = []) {
  const infoSheet = XLSX.utils.json_to_sheet([
    { Field: "Report Name", Value: report.name },
    { Field: "Type", Value: report.type },
    { Field: "Generated", Value: report.date },
    { Field: "Organization", Value: "HDFC Bank Ltd." },
  ], { skipHeader: true });
  infoSheet["!cols"] = [{ wch: 18 }, { wch: 40 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, infoSheet, "Report Info");

  sections.forEach((section, i) => {
    const sheetName = section.title.slice(0, 31) || `Section ${i + 1}`;
    if (section.kv) {
      const sheet = XLSX.utils.json_to_sheet(
        section.kv.map(({ label, value }) => ({ Field: label, Value: value })),
        { skipHeader: true },
      );
      sheet["!cols"] = [{ wch: 30 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    } else if (section.table) {
      const rows = section.table.rows.map(row =>
        Object.fromEntries(section.table!.headers.map((h, idx) => [h, row[idx]])),
      );
      const sheet = XLSX.utils.json_to_sheet(rows);
      sheet["!cols"] = section.table.headers.map(() => ({ wch: 18 }));
      XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    }
  });

  const slug = report.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const today = new Date().toISOString().slice(0, 10);
  downloadWorkbook(workbook, `cyberguard-${slug}-${today}.xlsx`);
}
