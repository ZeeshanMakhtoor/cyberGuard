import type { CgPage } from "../../App";
import { useComplianceFrameworks } from "@/hooks/useComplianceFrameworks";

interface Props { navigate: (p: CgPage) => void; }

export default function CgCompliance({ navigate }: Props) {
  const { data: frameworks, loading } = useComplianceFrameworks();

  if (loading) {
    return (
      <div className="p-5 max-w-screen-xl mx-auto space-y-4">
        {[0, 1, 2].map(i => <div key={i} className="h-40 rounded-xl animate-pulse" style={{ background: "var(--panel)" }} />)}
      </div>
    );
  }

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div>
        <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Compliance & Framework Mapping</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Risk metrics mapped onto the frameworks the organization already reports against</p>
      </div>

      <div className="grid gap-4">
        {frameworks.map(f => (
          <div key={f.name} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
              <div>
                <h3 className="text-sm font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{f.name}</h3>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{f.desc}</p>
              </div>
              <span
                className="px-2 py-0.5 rounded text-xs font-semibold"
                style={{
                  background: f.evidence === "Current" ? "rgba(52,211,153,0.12)" : "rgba(251,191,36,0.12)",
                  color: f.evidence === "Current" ? "#34D399" : "#FBBF24",
                }}
              >
                {f.evidence === "Current" ? "Evidence Current" : "Evidence Refresh Due"}
              </span>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Compliance</p>
                <p className="text-lg font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--accent)" }}>{f.compliance}%</p>
                <div className="w-full h-1.5 rounded-full overflow-hidden mt-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${f.compliance}%`, background: "var(--accent)" }} />
                </div>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Controls Mapped</p>
                <p className="text-lg font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{f.mapped}%</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Missing Controls</p>
                <p className="text-lg font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "#FBBF24" }}>{f.missing}%</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Last Assessment</p>
                <p className="text-sm font-mono" style={{ color: "var(--muted)" }}>{f.assessed}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <button className="text-xs font-semibold" style={{ color: "var(--accent)" }} onClick={() => navigate("reports")}>View Evidence Pack</button>
              <button className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Export Audit Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
