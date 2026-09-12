import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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

function toEalPoint(row: { captured_at: string; expected_annual_loss_inr: number }): EalPoint {
  const d = new Date(row.captured_at);
  return {
    month: `${MONTHS[d.getUTCMonth()]} '${String(d.getUTCFullYear()).slice(2)}`,
    eal: Math.round((row.expected_annual_loss_inr / 1_00_00_000) * 100) / 100,
  };
}

/**
 * EAL trend for the dashboard's area chart, newest snapshot last. Once
 * loaded from Supabase, also subscribes to new `risk_snapshots` inserts via
 * Realtime and appends them live — `lastUpdatedAt` drives the dashboard's
 * "Live" indicator. Falls back to mock data (no realtime) if Supabase isn't
 * configured.
 */
export function useEalTrend() {
  const initial = useSupabaseQuery<EalPoint[]>(
    async client => {
      const { data, error } = await client
        .from("risk_snapshots")
        .select("captured_at, expected_annual_loss_inr")
        .order("captured_at", { ascending: true });
      if (error) throw error;
      return data.map(toEalPoint);
    },
    MOCK_EAL_TREND,
    [],
  );

  const [live, setLive] = useState<EalPoint[] | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const seenRef = useRef(false);

  // Sync in the initial fetch once it lands.
  useEffect(() => {
    if (!initial.loading && !seenRef.current) {
      seenRef.current = true;
      setLive(initial.data);
      if (initial.live) setLastUpdatedAt(new Date());
    }
  }, [initial.loading, initial.data, initial.live]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const channel = client
      .channel("risk_snapshots_dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "risk_snapshots" },
        payload => {
          const row = payload.new as { captured_at: string; expected_annual_loss_inr: number };
          setLive(prev => [...(prev ?? MOCK_EAL_TREND), toEalPoint(row)]);
          setLastUpdatedAt(new Date());
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  return {
    data: live ?? initial.data,
    loading: initial.loading,
    error: initial.error,
    live: initial.live,
    lastUpdatedAt,
  };
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
