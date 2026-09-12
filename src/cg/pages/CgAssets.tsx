import { useState } from "react";
import type { CgPage } from "../../App";
import { useAssets } from "@/hooks/useAssets";

interface Props { navigate: (p: CgPage) => void; }

export default function CgAssets({ navigate }: Props) {
  const { data: ASSETS, loading } = useAssets();
  const [search, setSearch] = useState("");
  const filtered = ASSETS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()));

  const colorMap: Record<string, string> = {
    Critical: "#F87171", High: "#FBBF24", Medium: "#60B8CF", Low: "#34D399",
  };

  if (loading) {
    return (
      <div className="p-5 max-w-screen-xl mx-auto space-y-5">
        <div className="h-16 rounded-xl animate-pulse" style={{ background: "var(--panel)" }} />
        <div className="h-96 rounded-xl animate-pulse" style={{ background: "var(--panel)" }} />
      </div>
    );
  }

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Asset Inventory</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>1,248 assets discovered · Last scan: 01 Sep 2026</p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }}>
          + Add Asset
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Assets",    value: "1,248", color: "var(--accent)" },
          { label: "Critical Assets", value: "42",    color: "#F87171" },
          { label: "Cloud Assets",    value: "387",   color: "var(--accent2)" },
          { label: "Unscanned (7d+)", value: "91",    color: "#FBBF24" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-xs focus:outline-none"
            style={{ background: "var(--panel)", color: "var(--text)", border: "1px solid var(--border)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#1a2f3c", borderBottom: "1px solid var(--border)" }}>
                {["Asset ID", "Name", "Type", "Criticality", "Vulnerabilities", "Risk Score", "Financial Exposure", "Owner", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} className="border-b hover:bg-white/[0.02] transition cursor-pointer" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--muted)" }}>{a.id}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>{a.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(81,150,167,0.15)", color: "var(--accent2)" }}>{a.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: colorMap[a.criticality] }}>{a.criticality}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold" style={{ color: a.vulns > 4 ? "#F87171" : a.vulns > 2 ? "#FBBF24" : "#34D399" }}>{a.vulns}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold" style={{ color: a.riskScore >= 80 ? "#F87171" : a.riskScore >= 65 ? "#FBBF24" : "#9CDFF0" }}>{a.riskScore}</span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#FBBF24" }}>{a.exposure}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted)" }}>{a.owner}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs font-semibold" style={{ color: "var(--accent)" }}>View</button>
                      <button className="text-xs font-semibold" style={{ color: "var(--muted)" }} onClick={() => navigate("vulnerabilities")}>Vulns</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
