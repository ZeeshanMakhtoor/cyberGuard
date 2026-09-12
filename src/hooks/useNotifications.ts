import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface Notification {
  id: string;
  title: string;
  detail: string;
  severity: "critical" | "warning" | "info";
  createdAt: Date;
  read: boolean;
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: "seed-1", title: "8 critical AI recommendations pending", detail: "Review the AI Recommendations queue to close out this cycle's highest-impact items.", severity: "critical", createdAt: new Date(Date.now() - 1000 * 60 * 40), read: false },
  { id: "seed-2", title: "Weekly vulnerability digest ready", detail: "86 critical, 143 high vulnerabilities across the estate — see Vulnerabilities.", severity: "warning", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), read: false },
  { id: "seed-3", title: "RBI CSF compliance evidence refreshed", detail: "Compliance mapping for RBI Cyber Security Framework is current as of this assessment.", severity: "info", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22), read: true },
];

/**
 * Notification feed for the topbar bell. Seeds a few example items, then
 * appends a live entry whenever Realtime reports a new vulnerability or an
 * updated risk snapshot (the same events useVulnerabilities/useEalTrend
 * already subscribe to) — so the badge count reflects things actually
 * happening, not just static demo copy.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    const channel = client
      .channel("notifications_feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "vulnerabilities" }, payload => {
        const row = payload.new as { cve: string; severity: string; estimated_financial_impact_inr: number };
        setNotifications(prev => [
          {
            id: `vuln-${row.cve}-${Date.now()}`,
            title: `New ${row.severity.toLowerCase()} vulnerability: ${row.cve}`,
            detail: `Estimated financial impact ₹${Math.round(row.estimated_financial_impact_inr / 100000)}L. Review in Vulnerabilities.`,
            severity: row.severity === "Critical" ? "critical" : "warning",
            createdAt: new Date(),
            read: false,
          },
          ...prev,
        ]);
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "risk_snapshots" }, payload => {
        const row = payload.new as { risk_score: number };
        setNotifications(prev => [
          {
            id: `risk-${Date.now()}`,
            title: `Risk score updated: ${row.risk_score}/100`,
            detail: "A new risk snapshot was captured — see the Dashboard for the updated trend.",
            severity: row.risk_score >= 75 ? "critical" : "info",
            createdAt: new Date(),
            read: false,
          },
          ...prev,
        ]);
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function clearAll() {
    setNotifications([]);
  }

  return { notifications, unreadCount, markAllRead, clearAll };
}
