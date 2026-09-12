import type { CgPage } from "../../App";
import { useComplianceFrameworks } from "@/hooks/useComplianceFrameworks";
import { exportComplianceAuditExcel } from "@/lib/exportExcel";
import { gradeFromPercent, overallGrade } from "@/lib/securityGrade";
import V2Pill from "@/components/V2Pill";
import V1Pill from "@/components/V1Pill";

interface Props { navigate: (p: CgPage) => void; }

export default function CgCompliance({ navigate }: Props) {
  const { data: frameworks, loading } = useComplianceFrameworks();
  const overall = overallGrade(frameworks);

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

      {/* Overall Security Grade — SecurityScorecard-style letter grade for quick board scanning */}
      <div className="rounded-xl border p-5 flex items-center gap-5 flex-wrap" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${overall.color}18`, border: `2px solid ${overall.color}` }}
        >
          <span className="text-3xl font-extrabold" style={{ fontFamily: "'Outfit',sans-serif", color: overall.color }}>{overall.letter}</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Overall Security Grade</p>
            <V2Pill label="Letter grade, inspired by SecurityScorecard" />
          </div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Averaged across {frameworks.length} framework{frameworks.length === 1 ? "" : "s"} · {overall.avgPct}% mean compliance
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Framework Mapping</p>
        <V1Pill label="Live framework compliance, mapped controls, Export Audit Report (Excel)" compact />
      </div>
      <div className="grid gap-4">
        {frameworks.map(f => {
          const grade = gradeFromPercent(f.compliance);
          return (
          <div key={f.name} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${grade.color}18`, border: `1.5px solid ${grade.color}` }}
                  title={`Letter grade for ${f.compliance}% compliance`}
                >
                  <span className="text-sm font-extrabold" style={{ fontFamily: "'Outfit',sans-serif", color: grade.color }}>{grade.letter}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{f.name}</h3>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{f.desc}</p>
                </div>
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
              <button
                className="text-xs font-semibold"
                style={{ color: "var(--muted)" }}
                onClick={() => exportComplianceAuditExcel(f)}
              >
                Export Audit Report
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
