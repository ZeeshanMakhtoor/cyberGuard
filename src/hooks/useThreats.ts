import { useSupabaseQuery } from "./useSupabaseQuery";

export interface ThreatRow {
  id: string;
  name: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  relevance: "High" | "Medium" | "Low";
  sector: string;
  ioc: string;
  last: string;
  desc: string;
}

const MOCK_THREATS: ThreatRow[] = [
  { id: "TI-001", name: "BlackMatter Ransomware", type: "Ransomware", severity: "Critical", relevance: "High", sector: "Banking", ioc: "37 IOCs", last: "28 Aug 2026", desc: "Actively targeting BFSI sector in South Asia. Exploits CVE-2024-21413 as initial access." },
  { id: "TI-002", name: "APT41 (Double Dragon)", type: "APT",         severity: "Critical", relevance: "High", sector: "Finance",  ioc: "124 IOCs",last: "25 Aug 2026", desc: "Chinese state-sponsored group. Recent campaigns against Indian financial institutions via spear-phishing." },
  { id: "TI-003", name: "Phishing Kit: Bank-Impersonation v3", type: "Phishing", severity: "High", relevance: "High", sector: "Banking", ioc: "8 domains",last: "30 Aug 2026", desc: "Active phishing kit mimicking bank login pages. Hosted on .xyz domains." },
  { id: "TI-004", name: "Cobalt Strike Beacon C2",type: "C2 Server", severity: "High", relevance: "Medium", sector: "All", ioc: "3 IPs",last: "27 Aug 2026", desc: "Known C2 infrastructure observed in Indian telco ranges. Linked to financial sector campaigns." },
  { id: "TI-005", name: "Clop Ransomware",        type: "Ransomware", severity: "High", relevance: "Medium", sector: "BFSI",     ioc: "19 IOCs",  last: "20 Aug 2026", desc: "Exploiting Accellion / MOVEit vulnerabilities. Data exfiltration before encryption." },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function useThreats() {
  return useSupabaseQuery<ThreatRow[]>(
    async client => {
      const { data, error } = await client
        .from("threats")
        .select("id, name, type, severity, relevance, sector, ioc_count, description, last_seen")
        .order("last_seen", { ascending: false });
      if (error) throw error;
      return data.map((row, i) => ({
        id: `TI-${String(i + 1).padStart(3, "0")}`,
        name: row.name,
        type: row.type,
        severity: row.severity as ThreatRow["severity"],
        relevance: row.relevance as ThreatRow["relevance"],
        sector: row.sector,
        ioc: `${row.ioc_count} IOCs`,
        last: formatDate(row.last_seen),
        desc: row.description,
      }));
    },
    MOCK_THREATS,
    [],
  );
}
