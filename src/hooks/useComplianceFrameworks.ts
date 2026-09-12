import { useSupabaseQuery } from "./useSupabaseQuery";

export interface ComplianceFrameworkRow {
  name: string;
  desc: string;
  compliance: number;
  mapped: number;
  missing: number;
  evidence: "Current" | "Refresh due";
  assessed: string;
}

const MOCK_FRAMEWORKS: ComplianceFrameworkRow[] = [
  { name: "ISO/IEC 27001",  desc: "International information security management standard",           compliance: 84, mapped: 92, missing: 8,  evidence: "Current",     assessed: "12 Aug 2026" },
  { name: "NIST CSF",       desc: "Identify, Protect, Detect, Respond, Recover functions",              compliance: 78, mapped: 88, missing: 12, evidence: "Current",     assessed: "05 Aug 2026" },
  { name: "CIS Controls",   desc: "Prioritized technical safeguards benchmark",                          compliance: 81, mapped: 90, missing: 10, evidence: "Current",     assessed: "20 Jul 2026" },
  { name: "RBI Cyber Security Framework", desc: "Reserve Bank of India regulatory baseline for banks",   compliance: 88, mapped: 95, missing: 5,  evidence: "Current",     assessed: "01 Sep 2026" },
  { name: "SEBI CSCRF",     desc: "Cybersecurity & Cyber Resilience Framework for markets",               compliance: 73, mapped: 82, missing: 18, evidence: "Refresh due", assessed: "15 Jun 2026" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function useComplianceFrameworks() {
  return useSupabaseQuery<ComplianceFrameworkRow[]>(
    async client => {
      const { data, error } = await client
        .from("compliance_frameworks")
        .select("name, description, compliance_pct, mapped_pct, missing_pct, evidence_status, last_assessed")
        .order("compliance_pct", { ascending: false });
      if (error) throw error;
      return data.map(row => ({
        name: row.name,
        desc: row.description,
        compliance: row.compliance_pct,
        mapped: row.mapped_pct,
        missing: row.missing_pct,
        evidence: row.evidence_status as "Current" | "Refresh due",
        assessed: formatDate(row.last_assessed),
      }));
    },
    MOCK_FRAMEWORKS,
    [],
  );
}
