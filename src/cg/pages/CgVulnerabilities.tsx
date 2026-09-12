import { useState } from "react";
import type { CgPage } from "../../App";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { computePriorityScore } from "@/lib/priorityScore";
import V2Pill from "@/components/V2Pill";
import V1Pill from "@/components/V1Pill";

interface Props { navigate: (p: CgPage) => void; }

const exploitColors: Record<string, string> = {
  Active: "#F87171", Public: "#FBBF24", PoC: "var(--accent2)", None: "var(--mid)",
};

const SEVERITIES = ["All", "Critical", "High", "Medium", "Low"] as const;
const STATUSES = ["All", "Open", "In Progress", "Remediated", "Accepted"] as const;

export default function CgVulnerabilities({ navigate }: Props) {
  const { data: VULNS, loading, runScan } = useVulnerabilities();
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>("All");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [scanning, setScanning] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(true);

  const withPriority = VULNS.map(v => ({ ...v, priority: computePriorityScore({ cvss: v.cvss, exploit: v.exploit, assetCriticality: v.assetCriticality }) }));

  const filtered = withPriority
    .filter(v => severity === "All" || v.severity === severity)
    .filter(v => status === "All" || v.status === status)
    .sort((a, b) => {
      if (!sortByPriority) return 0;
      const aOpen = a.status === "Open" || a.status === "In Progress";
      const bOpen = b.status === "Open" || b.status === "In Progress";
      if (aOpen !== bOpen) return aOpen ? -1 : 1;
      return b.priority.score - a.priority.score;
    });

  const criticalCount = VULNS.filter(v => v.severity === "Critical").length;
  const highCount = VULNS.filter(v => v.severity === "High").length;
  const mediumCount = VULNS.filter(v => v.severity === "Medium").length;
  const activelyExploited = VULNS.filter(v => v.exploit === "Active").length;
  const avgAge = VULNS.length ? Math.round(VULNS.reduce((sum, v) => sum + v.age, 0) / VULNS.length) : 0;
  const lastScanLabel = VULNS.length
    ? "Last scan: just now"
    : "No vulnerabilities found — run a scan to get started";

  async function handleRunScan() {
    setScanning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2200));
      await runScan();
    } finally {
      setScanning(false);
    }
  }

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
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
            {VULNS.length ? `${criticalCount} critical · ${highCount} high · ${mediumCount} medium · ${lastScanLabel}` : lastScanLabel}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <V1Pill label="Synthetic vulnerability scan, appends a realistic finding" compact />
          <button
            className="text-xs px-3 py-1.5 rounded-lg border font-medium disabled:opacity-60 inline-flex items-center gap-2"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            disabled={scanning}
            onClick={handleRunScan}
          >
            {scanning && (
              <span className="w-3 h-3 rounded-full border-2 animate-spin" style={{ borderColor: "var(--muted)", borderTopColor: "transparent" }} />
            )}
            {scanning ? "Scanning…" : "Run Scan"}
          </button>
          <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }}
            onClick={() => navigate("ai")}>Get Remediation Plan →</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Vulnerability KPIs</p>
        <V1Pill label="Live from vulnerability scan data" compact />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Critical (CVSS 9–10)", value: String(criticalCount),      color: "#F87171" },
          { label: "High (CVSS 7–8.9)",    value: String(highCount),          color: "#FBBF24" },
          { label: "Actively Exploited",   value: String(activelyExploited),  color: "#F87171" },
          { label: "Avg. Age (days)",       value: String(avgAge),            color: "var(--accent2)" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Select value={severity} onValueChange={v => setSeverity(v as typeof severity)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SEVERITIES.map(s => <SelectItem key={s} value={s}>{s === "All" ? "All severities" : s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={v => setStatus(v as typeof status)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s === "All" ? "All statuses" : s}</SelectItem>)}
          </SelectContent>
        </Select>
        <button
          className="text-xs px-3 py-1.5 rounded-lg border font-medium"
          style={sortByPriority
            ? { background: "var(--accent)", color: "var(--bg)", borderColor: "var(--accent)" }
            : { color: "var(--muted)", borderColor: "var(--border)" }}
          onClick={() => setSortByPriority(s => !s)}
          title="Priority = Exploitability × Asset Criticality × Severity — not just financial impact"
        >
          {sortByPriority ? "Sorted by Priority ✓" : "Sort by Priority"}
        </button>
        <div className="ml-auto flex items-center">
          <V2Pill label="Attack-path priority ranking, inspired by Balbix" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--panel2)", borderBottom: "1px solid var(--border)" }}>
                {["CVE ID", "Affected Asset", "Priority", "Severity", "CVSS", "Status", "Exploit", "Financial Impact", "Age (days)", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center" style={{ color: "var(--muted)" }}>
                    No vulnerabilities found. Click "Run Scan" to scan your assets.
                  </td>
                </tr>
              )}
              {filtered.map((v, i) => (
                <tr key={i} className="border-b cg-hover-soft transition" style={{ borderColor: "var(--overlay-1)" }}>
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: "var(--accent2)" }}>{v.id}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                    {v.asset}
                    <span className="block text-xs" style={{ color: "var(--muted)" }}>{v.assetCriticality}-tier</span>
                  </td>
                  <td
                    className="px-4 py-3"
                    title={`Priority = ${Math.round(v.priority.exploitWeight * 100)}% exploit × ${Math.round(v.priority.criticalityWeight * 100)}% asset criticality × ${Math.round(v.priority.cvssNorm * 100)}% CVSS`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--overlay-3)" }}>
                        <div className="h-full rounded-full" style={{ width: `${v.priority.score}%`, background: v.priority.score >= 75 ? "#F87171" : v.priority.score >= 50 ? "#FBBF24" : "var(--accent2)" }} />
                      </div>
                      <span className="font-mono font-bold" style={{ color: v.priority.score >= 75 ? "#F87171" : v.priority.score >= 50 ? "#FBBF24" : "var(--accent2)" }}>{v.priority.score}</span>
                    </div>
                  </td>
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
