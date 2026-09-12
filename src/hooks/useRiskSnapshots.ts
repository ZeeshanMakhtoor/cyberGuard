import { useSupabaseQuery } from "./useSupabaseQuery";

export interface EalPoint {
  month: string;
  eal: number; // ₹ crore
}

const MOCK_EAL_TREND: EalPoint[] = [
  { month: "Sep '24", eal: 3.1 }, { month: "Oct '24", eal: 2.9 }, { month: "Nov '24", eal: 3.4 },
  { month: "Dec '24", eal: 3.0 }, { month: "Jan '25", eal: 2.7 }, { month: "Feb '25", eal: 2.5 },
  { month: "Mar '25", eal: 2.8 }, { month: "Apr '25", eal: 3.2 }, { month: "May '25", eal: 2.9 },
  { month: "Jun '25", eal: 2.6 }, { month: "Jul '25", eal: 2.45 }, { month: "Aug '25", eal: 2.45 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** EAL trend for the dashboard's area chart, newest snapshot last. */
export function useEalTrend() {
  return useSupabaseQuery<EalPoint[]>(
    async client => {
      const { data, error } = await client
        .from("risk_snapshots")
        .select("captured_at, expected_annual_loss_inr")
        .order("captured_at", { ascending: true });
      if (error) throw error;
      return data.map(row => ({
        month: `${MONTHS[new Date(row.captured_at).getUTCMonth()]} '${String(new Date(row.captured_at).getUTCFullYear()).slice(2)}`,
        eal: Math.round((row.expected_annual_loss_inr / 1_00_00_000) * 100) / 100,
      }));
    },
    MOCK_EAL_TREND,
    [],
  );
}

export interface LatestRisk {
  riskScore: number;
  expectedAnnualLossInr: number;
  valueAtRiskInr: number;
  capturedAt: string;
}

const MOCK_LATEST_RISK: LatestRisk = {
  riskScore: 72,
  expectedAnnualLossInr: 24_500_000,
  valueAtRiskInr: 87_000_000,
  capturedAt: new Date().toISOString(),
};

/** Most recent risk snapshot — the headline numbers on the dashboard. */
export function useLatestRisk() {
  return useSupabaseQuery<LatestRisk>(
    async client => {
      const { data, error } = await client
        .from("risk_snapshots")
        .select("risk_score, expected_annual_loss_inr, value_at_risk_inr, captured_at")
        .order("captured_at", { ascending: false })
        .limit(1)
        .single();
      if (error) throw error;
      return {
        riskScore: data.risk_score,
        expectedAnnualLossInr: data.expected_annual_loss_inr,
        valueAtRiskInr: data.value_at_risk_inr,
        capturedAt: data.captured_at,
      };
    },
    MOCK_LATEST_RISK,
    [],
  );
}
