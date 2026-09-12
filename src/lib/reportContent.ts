import type { AssetRow } from "@/hooks/useAssets";
import type { VulnerabilityRow } from "@/hooks/useVulnerabilities";
import type { ThreatRow } from "@/hooks/useThreats";
import type { ComplianceFrameworkRow } from "@/hooks/useComplianceFrameworks";
import type { RiskScoreBreakdown } from "@/lib/riskScore";
import type { LossRange } from "@/lib/lossRange";
import { formatLossRange } from "@/lib/lossRange";

export interface ReportContext {
  assets: AssetRow[];
  vulnerabilities: VulnerabilityRow[];
  threats: ThreatRow[];
  frameworks: ComplianceFrameworkRow[];
  riskScore: number;
  riskLevel: string;
  riskBreakdown: RiskScoreBreakdown;
  ealRange: LossRange;
  exposureRange: LossRange;
}

export interface ReportSection {
  title: string;
  kv?: { label: string; value: string }[];
  table?: { headers: string[]; rows: (string | number)[][] };
}

/**
 * Builds the actual on-screen (and Excel-export) content for a generated
 * report, from the same live data every other page reads — so "View Report"
 * shows real numbers instead of static demo text, and the exported .xlsx
 * matches what was shown.
 */
export function buildReportSections(type: string, ctx: ReportContext): ReportSection[] {
  const criticalVulns = ctx.vulnerabilities.filter(v => v.severity === "Critical").length;
  const openVulns = ctx.vulnerabilities.filter(v => v.status === "Open" || v.status === "In Progress").length;
  const activelyExploited = ctx.vulnerabilities.filter(v => v.exploit === "Active").length;
  const avgAge = ctx.vulnerabilities.length
    ? Math.round(ctx.vulnerabilities.reduce((s, v) => s + v.age, 0) / ctx.vulnerabilities.length)
    : 0;
  const topVulns = [...ctx.vulnerabilities].sort((a, b) => b.cvss - a.cvss).slice(0, 5);
  const avgCompliance = ctx.frameworks.length
    ? Math.round(ctx.frameworks.reduce((s, f) => s + f.compliance, 0) / ctx.frameworks.length)
    : 0;
  const sectorRelevant = ctx.threats.filter(t => t.relevance === "High").length;

  switch (type) {
    case "Executive":
      return [
        {
          title: "Executive Summary",
          kv: [
            { label: "Overall Risk Score", value: `${ctx.riskScore} / 100 (${ctx.riskLevel})` },
            { label: "Expected Annual Loss", value: formatLossRange(ctx.ealRange) },
            { label: "Financial Risk Exposure", value: formatLossRange(ctx.exposureRange) },
            { label: "Total Assets", value: String(ctx.assets.length) },
            { label: "Critical Vulnerabilities", value: String(criticalVulns) },
            { label: "Active Threats", value: String(ctx.threats.length) },
          ],
        },
        {
          title: "Top 5 Vulnerabilities by Severity",
          table: {
            headers: ["CVE ID", "Asset", "Severity", "CVSS", "Exploit", "Financial Impact"],
            rows: topVulns.map(v => [v.id, v.asset, v.severity, v.cvss, v.exploit, v.impact]),
          },
        },
      ];

    case "Technical":
      return [
        {
          title: "Vulnerability Assessment Summary",
          kv: [
            { label: "Total Vulnerabilities", value: String(ctx.vulnerabilities.length) },
            { label: "Critical", value: String(criticalVulns) },
            { label: "Open / In Progress", value: String(openVulns) },
            { label: "Actively Exploited", value: String(activelyExploited) },
            { label: "Average Age (days)", value: String(avgAge) },
          ],
        },
        {
          title: "Full Vulnerability List",
          table: {
            headers: ["CVE ID", "Asset", "Severity", "CVSS", "Status", "Exploit", "Financial Impact", "Age (days)"],
            rows: ctx.vulnerabilities.map(v => [v.id, v.asset, v.severity, v.cvss, v.status, v.exploit, v.impact, v.age]),
          },
        },
      ];

    case "Compliance":
      return [
        {
          title: "Compliance Summary",
          kv: [
            { label: "Frameworks Tracked", value: String(ctx.frameworks.length) },
            { label: "Mean Compliance", value: `${avgCompliance}%` },
          ],
        },
        {
          title: "Framework Mapping",
          table: {
            headers: ["Framework", "Compliance %", "Controls Mapped %", "Missing Controls %", "Evidence", "Last Assessed"],
            rows: ctx.frameworks.map(f => [f.name, f.compliance, f.mapped, f.missing, f.evidence, f.assessed]),
          },
        },
      ];

    case "Risk":
      return [
        {
          title: "FAIR Risk Quantification",
          kv: [
            { label: "Overall Risk Score", value: `${ctx.riskScore} / 100 (${ctx.riskLevel})` },
            { label: "Threat Factor", value: `${ctx.riskBreakdown.threatFactor} / 100 (35% weight)` },
            { label: "Vulnerability Factor", value: `${ctx.riskBreakdown.vulnerabilityFactor} / 100 (40% weight)` },
            { label: "Business Consequence Factor", value: `${ctx.riskBreakdown.consequenceFactor} / 100 (25% weight)` },
            { label: "Expected Annual Loss (Min–Likely–Max)", value: formatLossRange(ctx.ealRange) },
            { label: "Financial Exposure (Min–Likely–Max)", value: formatLossRange(ctx.exposureRange) },
          ],
        },
        {
          title: "Top 5 Vulnerabilities Driving Risk",
          table: {
            headers: ["CVE ID", "Asset", "Severity", "CVSS", "Exploit", "Financial Impact"],
            rows: topVulns.map(v => [v.id, v.asset, v.severity, v.cvss, v.exploit, v.impact]),
          },
        },
      ];

    case "Intel":
      return [
        {
          title: "Threat Intelligence Summary",
          kv: [
            { label: "Active Threats", value: String(ctx.threats.length) },
            { label: "Sector-Relevant (High)", value: String(sectorRelevant) },
          ],
        },
        {
          title: "Active Threat Feed",
          table: {
            headers: ["ID", "Name", "Type", "Severity", "Relevance", "Sector", "IOCs", "Last Seen"],
            rows: ctx.threats.map(t => [t.id, t.name, t.type, t.severity, t.relevance, t.sector, t.ioc, t.last]),
          },
        },
      ];

    default:
      return [];
  }
}
