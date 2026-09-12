import { useSupabaseQuery } from "./useSupabaseQuery";

export interface ControlRow {
  name: string;
  short: string;
  effectiveness: number;
  coverage: number;
  riskReduction: number;
}

const SHORT_NAMES: Record<string, string> = {
  "Multi-Factor Authentication": "MFA",
  "Endpoint Detection & Response": "EDR",
  "Firewall & Perimeter Defence": "Firewall",
  "Network Segmentation": "Segmentation",
  "Backup & Recovery": "Backup",
  "Data Encryption": "Encryption",
  "Security Monitoring & SIEM": "Monitoring",
};

const MOCK_CONTROLS: ControlRow[] = [
  { name: "Multi-Factor Authentication", short: "MFA",           effectiveness: 86, coverage: 91, riskReduction: 22 },
  { name: "Endpoint Detection & Response", short: "EDR",         effectiveness: 78, coverage: 84, riskReduction: 19 },
  { name: "Firewall & Perimeter Defence", short: "Firewall",     effectiveness: 82, coverage: 96, riskReduction: 15 },
  { name: "Network Segmentation", short: "Segmentation",         effectiveness: 61, coverage: 58, riskReduction: 18 },
  { name: "Backup & Recovery", short: "Backup",                  effectiveness: 90, coverage: 88, riskReduction: 12 },
  { name: "Data Encryption", short: "Encryption",                effectiveness: 84, coverage: 79, riskReduction: 14 },
  { name: "Security Monitoring & SIEM", short: "Monitoring",     effectiveness: 71, coverage: 74, riskReduction: 21 },
];

export function useControls() {
  return useSupabaseQuery<ControlRow[]>(
    async client => {
      const { data, error } = await client
        .from("controls")
        .select("name, effectiveness_pct, coverage_pct, risk_reduction_pct")
        .order("name", { ascending: true });
      if (error) throw error;
      return data.map(row => ({
        name: row.name,
        short: SHORT_NAMES[row.name] ?? row.name.split(" ")[0],
        effectiveness: row.effectiveness_pct,
        coverage: row.coverage_pct,
        riskReduction: row.risk_reduction_pct,
      }));
    },
    MOCK_CONTROLS,
    [],
  );
}
