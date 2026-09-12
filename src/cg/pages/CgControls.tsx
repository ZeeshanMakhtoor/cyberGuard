import type { CgPage } from "../../App";

interface Props { navigate: (p: CgPage) => void; }

const controls = [
  { name: "Multi-Factor Authentication", short: "MFA",           effectiveness: 86, coverage: 91, riskReduction: 22 },
  { name: "Endpoint Detection & Response", short: "EDR",         effectiveness: 78, coverage: 84, riskReduction: 19 },
  { name: "Firewall & Perimeter Defence", short: "Firewall",     effectiveness: 82, coverage: 96, riskReduction: 15 },
  { name: "Network Segmentation", short: "Segmentation",         effectiveness: 61, coverage: 58, riskReduction: 18 },
  { name: "Backup & Recovery", short: "Backup",                  effectiveness: 90, coverage: 88, riskReduction: 12 },
  { name: "Data Encryption", short: "Encryption",                effectiveness: 84, coverage: 79, riskReduction: 14 },
  { name: "Security Monitoring & SIEM", short: "Monitoring",     effectiveness: 71, coverage: 74, riskReduction: 21 },
];

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export default function CgControls({ navigate }: Props) {
  const avgEffectiveness = Math.round(controls.reduce((a, c) => a + c.effectiveness, 0) / controls.length);
  const avgCoverage = Math.round(controls.reduce((a, c) => a + c.coverage, 0) / controls.length);

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Security Control Effectiveness</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>How well each deployed control is actually performing, weighted into risk scoring</p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg font-semibold border" style={{ borderColor: "var(--border)", color: "var(--muted)" }} onClick={() => navigate("risk")}>
          View Risk Impact →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Controls Tracked", value: String(controls.length), color: "var(--accent)" },
          { label: "Avg. Effectiveness", value: `${avgEffectiveness}%`, color: "var(--accent2)" },
          { label: "Avg. Coverage", value: `${avgCoverage}%`, color: "var(--mid)" },
          { label: "Weakest Control", value: "Segmentation", color: "#FBBF24" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {controls.map(c => (
          <div key={c.short} className="rounded-xl border p-4 space-y-3" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{c.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{c.short}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(156,223,240,0.12)", color: "var(--accent)" }}>
                −{c.riskReduction}% risk
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
                <span>Effectiveness</span><span className="font-mono" style={{ color: "var(--text)" }}>{c.effectiveness}%</span>
              </div>
              <Bar value={c.effectiveness} color="var(--accent)" />

              <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
                <span>Coverage</span><span className="font-mono" style={{ color: "var(--text)" }}>{c.coverage}%</span>
              </div>
              <Bar value={c.coverage} color="var(--accent2)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
