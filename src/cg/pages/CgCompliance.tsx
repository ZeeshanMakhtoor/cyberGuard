import type { CgPage } from "../../App";

interface Props { navigate: (p: CgPage) => void; }

const frameworks = [
  { name: "ISO/IEC 27001",  desc: "International information security management standard",           compliance: 84, mapped: 92, missing: 8,  evidence: "Current",     assessed: "12 Aug 2026" },
  { name: "NIST CSF",       desc: "Identify, Protect, Detect, Respond, Recover functions",              compliance: 78, mapped: 88, missing: 12, evidence: "Current",     assessed: "05 Aug 2026" },
  { name: "CIS Controls",   desc: "Prioritized technical safeguards benchmark",                          compliance: 81, mapped: 90, missing: 10, evidence: "Current",     assessed: "20 Jul 2026" },
  { name: "RBI Cyber Security Framework", desc: "Reserve Bank of India regulatory baseline for banks",   compliance: 88, mapped: 95, missing: 5,  evidence: "Current",     assessed: "01 Sep 2026" },
  { name: "SEBI CSCRF",     desc: "Cybersecurity & Cyber Resilience Framework for markets",               compliance: 73, mapped: 82, missing: 18, evidence: "Refresh due", assessed: "15 Jun 2026" },
];

export default function CgCompliance({ navigate }: Props) {
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
