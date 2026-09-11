import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { CgPage } from "../../App";

interface Props { navigate: (p: CgPage) => void; }

const SCENARIOS = [
  {
    id: "mfa",
    label: "Enable MFA for All Privileged Accounts",
    desc: "Enforce MFA on all accounts with admin/root privileges across cloud, on-prem, and SaaS environments.",
    currentRisk: 72, predictedRisk: 61,
    currentEAL: 2.45, predictedEAL: 1.97,
    investment: 0.85, roiPct: 56,
    controls: ["Identity & Access Management", "Zero Trust Architecture"],
    frameworks: ["CIS Control 5", "NIST PR.AC-7"],
  },
  {
    id: "patch",
    label: "Patch All Critical Vulnerabilities (CVSS ≥ 9)",
    desc: "Deploy patches for 31 critical CVEs across Tier-1 and Tier-2 infrastructure within a 30-day sprint.",
    currentRisk: 72, predictedRisk: 58,
    currentEAL: 2.45, predictedEAL: 1.74,
    investment: 4.2, roiPct: 67,
    controls: ["Vulnerability Management", "Patch Management"],
    frameworks: ["CIS Control 7", "NIST ID.RA-1"],
  },
  {
    id: "monitoring",
    label: "Deploy 24×7 SOC & Enhanced SIEM",
    desc: "Upgrade SIEM rules and enable round-the-clock monitoring with automated incident response playbooks.",
    currentRisk: 72, predictedRisk: 64,
    currentEAL: 2.45, predictedEAL: 2.12,
    investment: 6.0, roiPct: 38,
    controls: ["Security Monitoring", "Incident Response"],
    frameworks: ["NIST DE.CM-1", "ISO 27001 A.16"],
  },
  {
    id: "segmentation",
    label: "Implement Network Micro-Segmentation",
    desc: "Segment the flat corporate network into security zones to prevent lateral movement in case of breach.",
    currentRisk: 72, predictedRisk: 60,
    currentEAL: 2.45, predictedEAL: 1.85,
    investment: 8.5, roiPct: 44,
    controls: ["Network Security", "Perimeter Defence"],
    frameworks: ["CIS Control 12", "NIST PR.AC-5"],
  },
];

function Metric({ label, value, subValue, color }: { label: string; value: string; subValue?: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="text-lg font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: color || "var(--text)" }}>{value}</p>
      {subValue && <p className="text-xs font-medium" style={{ color: "var(--ok)" }}>{subValue}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "#0d1b26", borderColor: "var(--border)", color: "var(--text)" }}>
      <p className="font-semibold mb-1" style={{ color: "var(--accent)" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function CgWhatIf({ navigate }: Props) {
  const [selected, setSelected] = useState(SCENARIOS[0]);
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);

  const runScenario = () => {
    setRunning(true);
    setRan(false);
    setTimeout(() => { setRunning(false); setRan(true); }, 1600);
  };

  const riskDelta = selected.currentRisk - selected.predictedRisk;
  const ealDelta = selected.currentEAL - selected.predictedEAL;

  const compareData = [
    { name: "Current", risk: selected.currentRisk, eal: selected.currentEAL },
    { name: "Predicted", risk: selected.predictedRisk, eal: selected.predictedEAL },
  ];

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>What-if Scenario Simulator</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Model security investments and forecast their impact on risk and EAL</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Scenario selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>SELECT SCENARIO</p>
          {SCENARIOS.map(sc => (
            <button
              key={sc.id}
              onClick={() => { setSelected(sc); setRan(false); }}
              className="w-full text-left rounded-xl border p-4 transition-all"
              style={{
                background: selected.id === sc.id ? "var(--panel)" : "rgba(37,73,83,0.4)",
                borderColor: selected.id === sc.id ? "var(--accent2)" : "var(--border)",
              }}
            >
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: selected.id === sc.id ? "var(--accent)" : "var(--border)" }}>
                  {selected.id === sc.id && <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />}
                </div>
                <div>
                  <p className="text-xs font-semibold leading-snug" style={{ color: "var(--text)" }}>{sc.label}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>{sc.desc}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {sc.frameworks.map(f => (
                      <span key={f} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(96,184,207,0.12)", color: "var(--accent2)" }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Run button */}
          <div className="rounded-xl border p-5" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>Active Scenario</p>
                <h2 className="text-sm font-bold mb-1" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{selected.label}</h2>
                <div className="flex gap-2 flex-wrap">
                  {selected.controls.map(c => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-md border" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>{c}</span>
                  ))}
                </div>
              </div>
              <button
                onClick={runScenario}
                disabled={running}
                className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 flex-shrink-0 disabled:opacity-70 transition-all"
                style={{ background: running ? "var(--border)" : "var(--accent)", color: "var(--bg)" }}
              >
                {running ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Simulating…
                  </>
                ) : "▶ Run Scenario"}
              </button>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Current Risk Score",       value: `${selected.currentRisk}/100`,  color: "#F87171" },
              { label: "Predicted Risk Score",      value: ran ? `${selected.predictedRisk}/100` : "—/100", color: ran ? "var(--ok)" : "var(--muted)", subValue: ran ? `↓ ${riskDelta} pts` : undefined },
              { label: "Risk Reduction",            value: ran ? `−${riskDelta} pts` : "—",              color: ran ? "var(--ok)" : "var(--muted)" },
              { label: "Current EAL",               value: `₹${selected.currentEAL} Cr`,  color: "#FBBF24" },
              { label: "Predicted EAL",             value: ran ? `₹${selected.predictedEAL} Cr` : "—",   color: ran ? "var(--ok)" : "var(--muted)", subValue: ran ? `↓ ₹${ealDelta.toFixed(2)} Cr` : undefined },
              { label: "Est. Investment",           value: `₹${selected.investment}L`,    color: "var(--accent2)" },
            ].map(m => (
              <div key={m.label} className="rounded-xl border p-4" style={{ background: "#1a2f3c", borderColor: "var(--border)" }}>
                <Metric label={m.label} value={m.value} subValue={m.subValue} color={m.color} />
              </div>
            ))}
          </div>

          {/* ROI */}
          {ran && (
            <div className="rounded-xl border p-4" style={{ background: "#1a2f3c", borderColor: "var(--accent)", boxShadow: "0 0 0 1px rgba(156,223,240,0.15)" }}>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>Return on Security Investment (ROSI)</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--accent)" }}>{selected.roiPct}%</span>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>
                      Saves ₹{(ealDelta * 100).toFixed(0)}L in EAL per ₹{(selected.investment).toFixed(1)}L invested
                    </span>
                  </div>
                </div>
                <button
                  className="px-4 py-2 rounded-lg text-xs font-semibold border"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                  onClick={() => navigate("ai")}
                >
                  Add to Roadmap →
                </button>
              </div>
            </div>
          )}

          {/* Comparison bar chart */}
          {ran && (
            <div className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>BEFORE vs. AFTER COMPARISON</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>Risk Score</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={compareData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                        <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "#0d1b26", borderColor: "var(--border)", color: "var(--text)" }}>
                          <p>{label}: {payload[0].value}</p>
                        </div>
                      ) : null} />
                      <Bar dataKey="risk" name="Risk Score" radius={[4, 4, 0, 0]}>
                        <Cell fill="#F87171" />
                        <Cell fill="#34D399" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>EAL (₹ Crore)</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <BarChart data={compareData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 3]} tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}Cr`} />
                      <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                        <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "#0d1b26", borderColor: "var(--border)", color: "var(--text)" }}>
                          <p>{label}: ₹{payload[0].value} Cr</p>
                        </div>
                      ) : null} />
                      <Bar dataKey="eal" name="EAL" radius={[4, 4, 0, 0]}>
                        <Cell fill="#FBBF24" />
                        <Cell fill="#34D399" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
