import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseQuery } from "./useSupabaseQuery";

export interface ThreatRow {
  id: string;
  dbId: string;
  name: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  relevance: "High" | "Medium" | "Low";
  sector: string;
  ioc: string;
  last: string;
  desc: string;
  blocked: boolean;
}

const MOCK_THREATS: ThreatRow[] = [
  { id: "TI-001", dbId: "TI-001", name: "BlackMatter Ransomware", type: "Ransomware", severity: "Critical", relevance: "High", sector: "Banking", ioc: "37 IOCs", last: "28 Aug 2026", desc: "Actively targeting BFSI sector in South Asia. Exploits CVE-2024-21413 as initial access.", blocked: false },
  { id: "TI-002", dbId: "TI-002", name: "APT41 (Double Dragon)", type: "APT",         severity: "Critical", relevance: "High", sector: "Finance",  ioc: "124 IOCs",last: "25 Aug 2026", desc: "Chinese state-sponsored group. Recent campaigns against Indian financial institutions via spear-phishing.", blocked: false },
  { id: "TI-003", dbId: "TI-003", name: "Phishing Kit: Bank-Impersonation v3", type: "Phishing", severity: "High", relevance: "High", sector: "Banking", ioc: "8 domains",last: "30 Aug 2026", desc: "Active phishing kit mimicking bank login pages. Hosted on .xyz domains.", blocked: false },
  { id: "TI-004", dbId: "TI-004", name: "Cobalt Strike Beacon C2",type: "C2 Server", severity: "High", relevance: "Medium", sector: "All", ioc: "3 IPs",last: "27 Aug 2026", desc: "Known C2 infrastructure observed in Indian telco ranges. Linked to financial sector campaigns.", blocked: false },
  { id: "TI-005", dbId: "TI-005", name: "Clop Ransomware",        type: "Ransomware", severity: "High", relevance: "Medium", sector: "BFSI",     ioc: "19 IOCs",  last: "20 Aug 2026", desc: "Exploiting Accellion / MOVEit vulnerabilities. Data exfiltration before encryption.", blocked: false },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Threat intel feed, plus blockIocs() for the "Block IOCs" action. In
 * Supabase mode it stamps blocked_at on the threat row and refetches; in
 * mock mode (no Supabase configured) it just flips local state so the
 * demo still works with zero setup.
 */
export function useThreats() {
  const [reloadKey, setReloadKey] = useState(0);
  const [localBlocked, setLocalBlocked] = useState<Set<string>>(new Set());

  const query = useSupabaseQuery<ThreatRow[]>(
    async client => {
      const { data, error } = await client
        .from("threats")
        .select("id, name, type, severity, relevance, sector, ioc_count, description, last_seen, blocked_at")
        .order("last_seen", { ascending: false });
      if (error) throw error;
      return data.map((row, i) => ({
        id: `TI-${String(i + 1).padStart(3, "0")}`,
        dbId: row.id,
        name: row.name,
        type: row.type,
        severity: row.severity as ThreatRow["severity"],
        relevance: row.relevance as ThreatRow["relevance"],
        sector: row.sector,
        ioc: `${row.ioc_count} IOCs`,
        last: formatDate(row.last_seen),
        desc: row.description,
        blocked: row.blocked_at != null,
      }));
    },
    MOCK_THREATS,
    [reloadKey],
  );

  async function blockIocs(dbId: string) {
    if (supabase) {
      const { error } = await supabase.from("threats").update({ blocked_at: new Date().toISOString() }).eq("id", dbId);
      if (error) throw error;
      setReloadKey(k => k + 1);
      return;
    }

    setLocalBlocked(prev => new Set(prev).add(dbId));
  }

  const data = query.data.map(t => (localBlocked.has(t.dbId) ? { ...t, blocked: true } : t));

  return { ...query, data, blockIocs };
}
