import { useState } from "react";
import { formatInrCompact } from "@/lib/currency";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseQuery } from "./useSupabaseQuery";

export interface AssetRow {
  id: string;
  name: string;
  type: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  ip: string;
  vulns: number;
  riskScore: number;
  exposure: string;
  owner: string;
  env: string;
}

export interface NewAsset {
  name: string;
  type: string;
  criticality: "Critical" | "High" | "Medium" | "Low";
  owner: string;
  businessUnit: string;
  environment: string;
  riskScore: number;
  financialExposureInr: number;
  protectionStatus: "Protected" | "Partial" | "Unprotected";
  internetFacing: boolean;
}

const MOCK_ASSETS: AssetRow[] = [
  { id: "A-001", name: "Core Banking Server (CBS-01)", type: "Server", criticality: "Critical", ip: "10.0.1.10", vulns: 4, riskScore: 89, exposure: "₹1.2Cr", owner: "IT Ops", env: "On-prem" },
  { id: "A-002", name: "Customer Web Portal",          type: "Web App", criticality: "Critical", ip: "203.0.113.5", vulns: 7, riskScore: 84, exposure: "₹92L",  owner: "Engineering", env: "AWS" },
  { id: "A-003", name: "Mail Gateway (MX-01)",          type: "Server", criticality: "High",     ip: "10.0.2.15", vulns: 3, riskScore: 77, exposure: "₹56L",  owner: "IT Ops", env: "On-prem" },
  { id: "A-004", name: "HR Self-Service Portal",        type: "Web App", criticality: "High",     ip: "10.0.3.22", vulns: 5, riskScore: 71, exposure: "₹43L",  owner: "HR Dept", env: "Azure" },
  { id: "A-005", name: "AWS S3 Data Lake",              type: "Cloud",  criticality: "High",     ip: "AWS Global", vulns: 2, riskScore: 65, exposure: "₹38L",  owner: "Data Team", env: "AWS" },
  { id: "A-006", name: "Corporate VPN Gateway",         type: "Network",criticality: "High",     ip: "10.0.0.1",  vulns: 2, riskScore: 63, exposure: "₹29L",  owner: "Network", env: "On-prem" },
  { id: "A-007", name: "AD Domain Controller",          type: "Server", criticality: "Critical", ip: "10.0.1.5",  vulns: 1, riskScore: 61, exposure: "₹75L",  owner: "IT Ops", env: "On-prem" },
  { id: "A-008", name: "ERP System (SAP)",              type: "Server", criticality: "Critical", ip: "10.0.1.20", vulns: 6, riskScore: 79, exposure: "₹88L",  owner: "Finance", env: "On-prem" },
];

/**
 * Assets list, plus addAsset() for the "+ Add Asset" dialog. In Supabase
 * mode, addAsset inserts a real row and triggers a refetch. In mock mode
 * (no Supabase configured), it just appends to the in-memory list so the
 * demo still works with zero setup.
 */
export function useAssets() {
  const [reloadKey, setReloadKey] = useState(0);
  const [localExtras, setLocalExtras] = useState<AssetRow[]>([]);

  const query = useSupabaseQuery<AssetRow[]>(
    async client => {
      const { data, error } = await client
        .from("assets")
        .select("id, name, type, criticality, ip, risk_score, financial_exposure_inr, owner, environment, vulnerabilities(count)")
        .order("risk_score", { ascending: false });
      if (error) throw error;
      return data.map((row, i) => ({
        id: `A-${String(i + 1).padStart(3, "0")}`,
        name: row.name,
        type: row.type,
        criticality: row.criticality as AssetRow["criticality"],
        ip: row.ip ?? "—",
        vulns: (row.vulnerabilities as unknown as { count: number }[])?.[0]?.count ?? 0,
        riskScore: row.risk_score,
        exposure: formatInrCompact(row.financial_exposure_inr),
        owner: row.owner,
        env: row.environment ?? "—",
      }));
    },
    MOCK_ASSETS,
    [reloadKey],
  );

  async function addAsset(asset: NewAsset) {
    if (supabase) {
      const { error } = await supabase.from("assets").insert({
        name: asset.name,
        type: asset.type,
        criticality: asset.criticality,
        owner: asset.owner,
        business_unit: asset.businessUnit,
        environment: asset.environment,
        risk_score: asset.riskScore,
        financial_exposure_inr: asset.financialExposureInr,
        protection_status: asset.protectionStatus,
        internet_facing: asset.internetFacing,
      });
      if (error) throw error;
      setReloadKey(k => k + 1);
      return;
    }

    setLocalExtras(prev => [
      ...prev,
      {
        id: `A-${String(query.data.length + prev.length + 1).padStart(3, "0")}`,
        name: asset.name,
        type: asset.type,
        criticality: asset.criticality,
        ip: "—",
        vulns: 0,
        riskScore: asset.riskScore,
        exposure: formatInrCompact(asset.financialExposureInr),
        owner: asset.owner,
        env: asset.environment,
      },
    ]);
  }

  return { ...query, data: [...query.data, ...(supabase ? [] : localExtras)], addAsset };
}
