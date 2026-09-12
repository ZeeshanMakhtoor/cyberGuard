import { useState } from "react";
import type { CgPage } from "../../App";
import { useThreats } from "@/hooks/useThreats";
import V1Pill from "@/components/V1Pill";

interface Props { navigate: (p: CgPage) => void; }

export default function CgThreatIntel({ navigate }: Props) {
  const { data: threats, loading, blockIocs } = useThreats();
  const [blockingId, setBlockingId] = useState<string | null>(null);

  async function handleBlockIocs(dbId: string) {
    setBlockingId(dbId);
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      await blockIocs(dbId);
    } finally {
      setBlockingId(null);
    }
  }

  const activeThreats = threats.length;
  const sectorRelevant = threats.filter(t => t.relevance === "High").length;
  const monitoredIocs = threats.reduce((sum, t) => sum + (parseInt(t.ioc, 10) || 0), 0);
  const threatLevel = threats.some(t => t.severity === "Critical") ? "HIGH" : threats.some(t => t.severity === "High") ? "ELEVATED" : "MODERATE";

  if (loading) {
    return (
      <div className="p-5 max-w-screen-xl mx-auto space-y-5">
        <div className="h-16 rounded-xl animate-pulse" style={{ background: "var(--panel)" }} />
        <div className="h-64 rounded-xl animate-pulse" style={{ background: "var(--panel)" }} />
      </div>
    );
  }

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Threat Intelligence</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>OSINT + commercial feeds · Updated hourly · Sector-filtered: Banking / BFSI</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#F87171" }} />
          <span className="text-xs font-semibold" style={{ color: "#F87171" }}>THREAT LEVEL: {threatLevel}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Threat KPIs</p>
        <V1Pill label="Live from tracked threats, threat level derived from max severity" compact />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Threats",     value: String(activeThreats), color: "#F87171" },
          { label: "Sector-Relevant",    value: String(sectorRelevant), color: "#FBBF24" },
          { label: "Monitored IOCs",     value: String(monitoredIocs), color: "var(--accent)" },
          { label: "Feeds Active",       value: "12", color: "var(--accent2)" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Threat cards */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Active Threat Feed</p>
        <V1Pill label="Block IOCs + Check Exposure actions" compact />
      </div>
      <div className="space-y-3">
        {threats.map(t => (
          <div key={t.id} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>{t.id}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: "rgba(96,184,207,0.15)", color: "var(--accent2)" }}>{t.type}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ color: t.severity === "Critical" ? "#F87171" : "#FBBF24", background: t.severity === "Critical" ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)" }}>{t.severity}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399" }}>Relevance: {t.relevance}</span>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{t.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{t.desc}</p>
                <div className="flex gap-4 mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  <span>🎯 {t.sector}</span>
                  <span>📍 {t.ioc}</span>
                  <span>📅 Last seen: {t.last}</span>
                  {t.blocked && <span style={{ color: "#34D399" }}>🛡️ IOCs blocked</span>}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2"
                  style={t.blocked
                    ? { background: "rgba(52,211,153,0.15)", color: "#34D399" }
                    : { background: "var(--accent)", color: "var(--bg)" }}
                  disabled={t.blocked || blockingId === t.dbId}
                  onClick={() => handleBlockIocs(t.dbId)}
                >
                  {blockingId === t.dbId && (
                    <span className="w-3 h-3 rounded-full border-2 animate-spin" style={{ borderColor: "var(--bg)", borderTopColor: "transparent" }} />
                  )}
                  {t.blocked ? "IOCs Blocked ✓" : blockingId === t.dbId ? "Blocking…" : "Block IOCs"}
                </button>
                <button className="px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ borderColor: "var(--border)", color: "var(--muted)" }} onClick={() => navigate("vulnerabilities")}>Check Exposure</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
