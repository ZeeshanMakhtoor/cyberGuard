import { useState } from "react";
import type { CgPage } from "../../App";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";

interface Props { navigate: (p: CgPage) => void; }

const exploitColors: Record<string, string> = {
  Active: "#F87171", Public: "#FBBF24", PoC: "#60B8CF", None: "#5196A7",
};

export default function CgVulnerabilities({ navigate }: Props) {
  const { data: VULNS, loading } = useVulnerabilities();
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Critical", "High", "Open", "Remediated"];
  const filtered = VULNS.filter(v => filter === "All" || v.severity === filter || v.status === filter);

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
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Vulnerabilities</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>86 critical · 143 high · 219 medium · Last scan: 01 Sep 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>Run Scan</button>
          <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }}
            onClick={() => navigate("ai")}>Get Remediation Plan →</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Critical (CVSS 9–10)", value: "86",  color: "#F87171" },
          { label: "High (CVSS 7–8.9)",    value: "143", color: "#FBBF24" },
          { label: "Actively Exploited",   value: "24",  color: "#F87171" },
          { label: "Avg. Age (days)",       value: "41",  color: "var(--accent2)" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
            style={filter === f ? { background: "var(--accent)", color: "var(--bg)", borderColor: "var(--accent)" } : { background: "transparent", color: "var(--muted)", borderColor: "var(--border)" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "#1a2f3c", borderBottom: "1px solid var(--border)" }}>
                {["CVE ID", "Affected Asset", "Severity", "CVSS", "Status", "Exploit", "Financial Impact", "Age (days)", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={i} className="border-b hover:bg-white/[0.02] transition" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: "var(--accent2)" }}>{v.id}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text)" }}>{v.asset}</td>
                  <td className="px-4 py-3"><span className="font-semibold" style={{ color: v.severity === "Critical" ? "#F87171" : "#FBBF24" }}>{v.severity}</span></td>
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: v.cvss >= 9 ? "#F87171" : "#FBBF24" }}>{v.cvss}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={v.status === "Open" ? { background: "rgba(248,113,113,0.15)", color: "#F87171" } : { background: "rgba(52,211,153,0.15)", color: "#34D399" }}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ color: exploitColors[v.exploit], background: `${exploitColors[v.exploit]}18` }}>
                      {v.exploit}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#FBBF24" }}>{v.impact}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: v.age > 30 ? "#F87171" : "var(--muted)" }}>{v.age}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs font-semibold" style={{ color: "var(--accent)" }} onClick={() => navigate("ai")}>Remediate →</button>
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
