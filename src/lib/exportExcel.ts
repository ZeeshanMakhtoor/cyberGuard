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
