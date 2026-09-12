import { formatInrCompact } from "@/lib/currency";
import { useSupabaseQuery } from "./useSupabaseQuery";

export interface VulnerabilityRow {
  id: string;
  asset: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvss: number;
  status: "Open" | "In Progress" | "Remediated" | "Accepted";
  exploit: string;
  impact: string;
  age: number;
}

const MOCK_VULNS: VulnerabilityRow[] = [
  { id: "CVE-2024-21413", asset: "Mail Server", severity: "Critical", cvss: 9.8, status: "Open",    exploit: "Public", impact: "₹42L",  age: 18 },
  { id: "CVE-2024-3400",  asset: "PAN-OS FW",   severity: "Critical", cvss: 10.0,status: "Open",    exploit: "Active", impact: "₹68L",  age: 12 },
  { id: "CVE-2023-44487", asset: "Load Balancer",severity: "High",    cvss: 7.5, status: "Open",    exploit: "Public", impact: "₹28L",  age: 31 },
  { id: "CVE-2024-6387",  asset: "SSH Servers",  severity: "Critical", cvss: 8.1, status: "Open",    exploit: "PoC",    impact: "₹54L",  age: 8 },
  { id: "CVE-2021-44228", asset: "ERP (Log4j)",  severity: "Critical", cvss: 10.0,status: "Remediated", exploit: "Active", impact: "₹88L",  age: 890 },
  { id: "CVE-2023-35078", asset: "MDM Server",   severity: "Critical", cvss: 10.0,status: "Open",    exploit: "Active", impact: "₹34L",  age: 22 },
  { id: "CVE-2024-4577",  asset: "PHP Servers",  severity: "Critical", cvss: 9.8, status: "Open",    exploit: "Active", impact: "₹21L",  age: 14 },
  { id: "CVE-2022-26134", asset: "Confluence",   severity: "Critical", cvss: 9.8, status: "Remediated", exploit: "Active", impact: "₹45L",  age: 420 },
];

function ageInDays(createdAt: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 86_400_000));
}

export function useVulnerabilities() {
  return useSupabaseQuery<VulnerabilityRow[]>(
    async client => {
      const { data, error } = await client
        .from("vulnerabilities")
        .select("cve, severity, cvss, status, exploitability, estimated_financial_impact_inr, created_at, assets(name)")
        .order("estimated_financial_impact_inr", { ascending: false });
      if (error) throw error;
      return data.map(row => ({
        id: row.cve,
        asset: (row.assets as unknown as { name: string } | null)?.name ?? "Unknown asset",
        severity: row.severity as VulnerabilityRow["severity"],
        cvss: row.cvss ?? 0,
        status: row.status as VulnerabilityRow["status"],
        exploit: row.exploitability,
        impact: formatInrCompact(row.estimated_financial_impact_inr),
        age: ageInDays(row.created_at),
      }));
    },
    MOCK_VULNS,
    [],
  );
}
