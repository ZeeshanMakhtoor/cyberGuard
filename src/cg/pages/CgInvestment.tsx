import { useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import type { CgPage } from "../../App";
import V1Pill from "@/components/V1Pill";

interface Props { navigate: (p: CgPage) => void; }

const INITIATIVES = [
  { name: "MFA",                        costL: 15, riskReduction: 18 },
  { name: "Vulnerability Remediation",  costL: 25, riskReduction: 24 },
  { name: "Network Segmentation",       costL: 30, riskReduction: 20 },
  { name: "EDR Improvement",            costL: 20, riskReduction: 14 },
  { name: "Monitoring",                 costL: 10, riskReduction: 8 },
];

export default function CgInvestment({ navigate }: Props) {
  const [budgetL, setBudgetL] = useState(100); // ₹ lakh, default ₹1 Cr

  const recommended = useMemo(() => {
    const ranked = [...INITIATIVES].sort((a, b) => b.riskReduction / b.costL - a.riskReduction / a.costL);
    let remaining = budgetL;
    const picks: typeof INITIATIVES = [];
    for (const item of ranked) {
      if (item.costL <= remaining) {
        picks.push(item);
        remaining -= item.costL;
      }
    }
    return { picks, spent: budgetL - remaining, remaining };
  }, [budgetL]);

  const totalRiskReduction = recommended.picks.reduce((a, c) => a + c.riskReduction, 0);
  const totalCost = recommended.picks.reduce((a, c) => a + c.costL, 0);

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div>
        <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Security Investment Optimization</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Maximum risk reduction per rupee spent, under a stated budget constraint</p>
      </div>

      {/* Budget input */}
      <div className="rounded-xl border p-4 flex items-center gap-4 flex-wrap" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "var(--muted)" }}>
          Available Budget (₹ Lakh)
          <V1Pill label="Greedy knapsack: highest reduction-per-rupee funded first" compact />
        </label>
        <input
          type="number"
          value={budgetL}
          min={0}
          step={5}
          onChange={e => setBudgetL(Math.max(0, Number(e.target.value)))}
          className="w-32 px-3 py-2 rounded-lg text-sm font-mono focus:outline-none"
          style={{ background: "var(--panel2)", border: "1px solid var(--border)", color: "var(--text)" }}
        />
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          = ₹{(budgetL / 100).toFixed(2)} Crore
        </span>
        <div className="ml-auto flex gap-2">
          {[50, 100, 200].map(v => (
            <button key={v} onClick={() => setBudgetL(v)} className="text-xs px-3 py-1.5 rounded-lg border" style={{ borderColor: "var(--border)", color: budgetL === v ? "var(--accent)" : "var(--muted)" }}>
              ₹{v}L
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Recommended Spend", value: `₹${totalCost}L`, color: "var(--accent)" },
          { label: "Budget Remaining", value: `₹${recommended.remaining}L`, color: "var(--mid)" },
          { label: "Est. Risk Reduction", value: `${totalRiskReduction}%`, color: "var(--accent2)" },
          { label: "Initiatives Funded", value: String(recommended.picks.length), color: "var(--accent)" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</p>
            <p className="text-xl font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Table */}
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "var(--panel2)", borderBottom: "1px solid var(--border)" }}>
                  {["Security Initiative", "Cost", "Risk Reduction", "In Plan"].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INITIATIVES.map(i => {
                  const chosen = recommended.picks.some(p => p.name === i.name);
                  return (
                    <tr key={i.name} className="border-b" style={{ borderColor: "var(--overlay-1)", background: chosen ? "rgba(156,223,240,0.05)" : "transparent" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>{i.name}</td>
                      <td className="px-4 py-3 font-mono" style={{ color: "var(--muted)" }}>₹{i.costL}L</td>
                      <td className="px-4 py-3 font-mono" style={{ color: "var(--accent2)" }}>{i.riskReduction}%</td>
                      <td className="px-4 py-3">
                        {chosen
                          ? <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: "rgba(52,211,153,0.12)", color: "#34D399" }}>Recommended</span>
                          : <span className="text-xs" style={{ color: "var(--muted)" }}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>INVESTMENT VS RISK REDUCTION</p>
            <V1Pill label="Illustrative cost-vs-reduction scatter" compact />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="var(--overlay-2)" />
              <XAxis type="number" dataKey="costL" name="Cost (₹L)" stroke="var(--muted)" fontSize={11} />
              <YAxis type="number" dataKey="riskReduction" name="Risk Reduction (%)" stroke="var(--muted)" fontSize={11} />
              <ZAxis range={[120, 120]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ background: "var(--panel2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(value: any, name: any) => [name === "costL" ? `₹${value}L` : `${value}%`, name === "costL" ? "Cost" : "Risk Reduction"]}
              />
              <Scatter data={INITIATIVES} fill="var(--accent2)" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Diminishing returns appear once cost outpaces risk reduction — spend concentrates before that point.</p>
        </div>
      </div>
    </div>
  );
}
