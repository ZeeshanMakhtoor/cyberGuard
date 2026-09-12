import { useEffect, useState } from "react";
import { formatInrCompact } from "@/lib/currency";
import { supabase } from "@/lib/supabaseClient";
import { generateSyntheticVulnerability } from "@/lib/vulnScan";
import { useSupabaseQuery } from "./useSupabaseQuery";

export interface VulnerabilityRow {
  id: string;
  asset: string;
  assetCriticality: "Critical" | "High" | "Medium" | "Low";
  severity: "Critical" | "High" | "Medium" | "Low";
  cvss: number;
  status: "Open" | "In Progress" | "Remediated" | "Accepted";
  exploit: string;
  impact: string;
  age: number;
}

const MOCK_VULNS: VulnerabilityRow[] = [
  { id: "CVE-2024-21413", asset: "Mail Server", assetCriticality: "High",     severity: "Critical", cvss: 9.8, status: "Open",    exploit: "Public", impact: "₹42L",  age: 18 },
  { id: "CVE-2024-3400",  asset: "PAN-OS FW",   assetCriticality: "High",     severity: "Critical", cvss: 10.0,status: "Open",    exploit: "Active", impact: "₹68L",  age: 12 },
  { id: "CVE-2023-44487", asset: "Load Balancer",assetCriticality: "Medium",  severity: "High",    cvss: 7.5, status: "Open",    exploit: "Public", impact: "₹28L",  age: 31 },
  { id: "CVE-2024-6387",  asset: "SSH Servers",  assetCriticality: "High",     severity: "Critical", cvss: 8.1, status: "Open",    exploit: "PoC",    impact: "₹54L",  age: 8 },
  { id: "CVE-2021-44228", asset: "ERP (Log4j)",  assetCriticality: "Critical", severity: "Critical", cvss: 10.0,status: "Remediated", exploit: "Active", impact: "₹88L",  age: 890 },
  { id: "CVE-2023-35078", asset: "MDM Server",   assetCriticality: "Medium",  severity: "Critical", cvss: 10.0,status: "Open",    exploit: "Active", impact: "₹34L",  age: 22 },
  { id: "CVE-2024-4577",  asset: "PHP Servers",  assetCriticality: "High",     severity: "Critical", cvss: 9.8, status: "Open",    exploit: "Active", impact: "₹21L",  age: 14 },
  { id: "CVE-2022-26134", asset: "Confluence",   assetCriticality: "Medium",  severity: "Critical", cvss: 9.8, status: "Remediated", exploit: "Active", impact: "₹45L",  age: 420 },
];

function ageInDays(createdAt: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 86_400_000));
}

/**
 * Vulnerabilities list, with a Realtime subscription that re-fetches on any
 * insert/update/delete so newly discovered or remediated CVEs show up live
 * without a page refresh.
 */
export function useVulnerabilities() {
  const [reloadKey, setReloadKey] = useState(0);
  const [localExtras, setLocalExtras] = useState<VulnerabilityRow[]>([]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const channel = client
      .channel("vulnerabilities_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "vulnerabilities" }, () => {
        setReloadKey(k => k + 1);
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const query = useSupabaseQuery<VulnerabilityRow[]>(
    async client => {
      const { data, error } = await client
        .from("vulnerabilities")
        .select("cve, severity, cvss, status, exploitability, business_criticality, estimated_financial_impact_inr, created_at, assets(name)")
        .order("estimated_financial_impact_inr", { ascending: false });
      if (error) throw error;
      return data.map(row => ({
        id: row.cve,
        asset: (row.assets as unknown as { name: string } | null)?.name ?? "Unknown asset",
        assetCriticality: (row.business_criticality as VulnerabilityRow["assetCriticality"]) ?? "Medium",
        severity: row.severity as VulnerabilityRow["severity"],
        cvss: row.cvss ?? 0,
        status: row.status as VulnerabilityRow["status"],
        exploit: row.exploitability,
        impact: formatInrCompact(row.estimated_financial_impact_inr),
        age: ageInDays(row.created_at),
      }));
    },
    MOCK_VULNS,
    [reloadKey],
  );

  async function runScan() {
    const finding = generateSyntheticVulnerability();

    if (supabase) {
      const { data: assets, error: assetsError } = await supabase
        .from("assets")
        .select("id")
        .limit(50);
      if (assetsError) throw assetsError;
      const assetId = assets?.length ? assets[Math.floor(Math.random() * assets.length)].id : null;

      const { error } = await supabase.from("vulnerabilities").insert({
        cve: finding.cve,
        asset_id: assetId,
        severity: finding.severity,
        cvss: finding.cvss,
        exploitability: finding.exploitability,
        business_criticality: finding.businessCriticality,
        estimated_financial_impact_inr: finding.estimatedFinancialImpactInr,
        recommended_action: finding.recommendedAction,
        status: "Open",
      });
      if (error) throw error;
      setReloadKey(k => k + 1);
      return;
    }

    setLocalExtras(prev => [
      {
        id: finding.cve,
        asset: "Newly Scanned Asset",
        assetCriticality: finding.businessCriticality,
        severity: finding.severity,
        cvss: finding.cvss,
        status: "Open",
        exploit: finding.exploitability,
        impact: formatInrCompact(finding.estimatedFinancialImpactInr),
        age: 0,
      },
      ...prev,
    ]);
  }

  return { ...query, data: [...localExtras, ...query.data], runScan };
}
