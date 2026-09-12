import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend,
} from "recharts";
import { useEffect, useState } from "react";
import type { CgPage } from "../../App";
import { useEalTrend } from "@/hooks/useRiskSnapshots";
import { useAssets } from "@/hooks/useAssets";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";
import { useComplianceFrameworks } from "@/hooks/useComplianceFrameworks";
import { useThreats } from "@/hooks/useThreats";
import { INITIAL_RECS } from "@/lib/recommendationsData";
import { exportDashboardExcel } from "@/lib/exportExcel";
import { benchmarkRiskScore } from "@/lib/benchmark";
import { computeLossRange, formatCr } from "@/lib/lossRange";
import { computeRiskScore, riskLevelLabel } from "@/lib/riskScore";
import V2Pill from "@/components/V2Pill";
import V1Pill from "@/components/V1Pill";

interface Props { navigate: (p: CgPage) => void; }

function LiveIndicator({ live, lastUpdatedAt }: { live: boolean; lastUpdatedAt: Date | null }) {
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!live) return null;

  const secondsAgo = lastUpdatedAt ? Math.max(0, Math.round((Date.now() - lastUpdatedAt.getTime()) / 1000)) : null;
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(52,211,153,0.1)" }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#34D399" }} />
      <span className="text-xs font-medium" style={{ color: "#34D399" }}>
        Live{secondsAgo !== null ? ` · updated ${secondsAgo}s ago` : ""}
      </span>
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────────────────────

const riskContributors = [
  { name: "Unpatched CVEs",      value: 38, impact: "₹94L" },
  { name: "Weak Access Controls",value: 27, impact: "₹67L" },
  { name: "Phishing Exposure",   value: 21, impact: "₹52L" },
  { name: "Misconfigurations",   value: 14, impact: "₹34L" },
];

const topRisks = [
  { risk: "RCE via CVE-2024-21413", asset: "Mail Server", impact: "₹42L", likelihood: "High", score: 91, priority: "Critical" },
  { risk: "Credential Stuffing",    asset: "Customer Portal",impact: "₹38L", likelihood: "Medium",score: 84, priority: "Critical" },
  { risk: "Ransomware Propagation", asset: "Corp. Network", impact: "₹1.2Cr",likelihood: "Medium",score: 81, priority: "High" },
  { risk: "SQL Injection",          asset: "Core Banking API",impact:"₹56L", likelihood: "Low",  score: 73, priority: "High" },
  { risk: "MFA Bypass",             asset: "VPN Gateway",   impact: "₹29L", likelihood: "High", score: 69, priority: "High" },
  { risk: "Exposed S3 Buckets",     asset: "AWS Environment",impact:"₹18L", likelihood: "Low",  score: 54, priority: "Medium" },
];

const investmentChart = [
  { invest: 0,   risk: 2.45 },
  { invest: 10,  risk: 2.1 },
  { invest: 25,  risk: 1.72 },
  { invest: 50,  risk: 1.35 },
  { invest: 80,  risk: 1.1 },
  { invest: 120, risk: 0.95 },
  { invest: 180, risk: 0.88 },
];

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color, onClick }: {
  icon: string; label: string; value: string; sub: string; color: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-3 p-4 rounded-xl border text-left w-full hover:border-opacity-80 transition-all"
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: `${color}22`, color }}>
          {icon}
        </div>
        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${color}18`, color }}>Live</span>
      </div>
      <div>
        <div className="text-xl font-bold leading-tight" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{value}</div>
        <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{label}</div>
      </div>
      <div className="text-xs" style={{ color }}>{sub}</div>
    </button>
  );
}

function SectionHeader({ title, sub, action, onAction, pill }: { title: string; sub?: string; action?: string; onAction?: () => void; pill?: React.ReactNode; }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{title}</h2>
          {pill}
        </div>
        {sub && <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{sub}</p>}
      </div>
      {action && (
        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border" style={{ color: "var(--accent2)", borderColor: "var(--border)" }} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border p-4 ${className}`} style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
      {children}
    </div>
  );
}

function PriorityBadge({ p }: { p: string }) {
  const map: Record<string, [string, string]> = {
    Critical: ["#F87171", "rgba(248,113,113,0.15)"],
    High:     ["#FBBF24", "rgba(251,191,36,0.15)"],
    Medium:   ["var(--accent2)", "rgba(96,184,207,0.15)"],
    Low:      ["var(--mid)", "rgba(81,150,167,0.15)"],
  };
  const [c, bg] = map[p] ?? ["var(--neutral)", "rgba(148,163,184,0.1)"];
  return (
    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ color: c, background: bg }}>{p}</span>
  );
}

function LossRangeBar({ label, range }: { label: string; range: { min: number; likely: number; max: number } }) {
  const scaleMax = range.max * 1.15;
  const pct = (v: number) => `${Math.min(100, (v / scaleMax) * 100)}%`;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color: "var(--text)" }}>
          {formatCr(range.min)} – <span style={{ color: "var(--accent)" }}>{formatCr(range.likely)}</span> – {formatCr(range.max)}
        </span>
      </div>
      <div className="relative h-2 rounded-full" style={{ background: "var(--overlay-3)" }}>
        <div
          className="absolute top-0 h-full rounded-full"
          style={{ left: pct(range.min), width: `calc(${pct(range.max)} - ${pct(range.min)})`, background: "rgba(156,223,240,0.25)" }}
        />
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2" style={{ left: `calc(${pct(range.likely)} - 6px)`, background: "var(--accent)", borderColor: "var(--bg)" }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: "var(--muted)" }}>Min</span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>Most Likely</span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>Max</span>
      </div>
    </div>
  );
}

const EAL_TICK = (v: number) => `₹${v}Cr`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "var(--panel3)", borderColor: "var(--border)", color: "var(--text)" }}>
      <p className="font-semibold mb-1" style={{ color: "var(--accent)" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || "var(--text)" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

// ── PAGE ──────────────────────────────────────────────────────────────────
const CRITICALITY_COLORS: Record<string, string> = {
  Critical: "#F87171", High: "#FBBF24", Medium: "var(--accent2)", Low: "var(--mid)",
};

export default function CgDashboard({ navigate }: Props) {
  const { data: ealTrend, live, lastUpdatedAt } = useEalTrend();
  const { data: assets } = useAssets();
  const { data: vulnerabilities } = useVulnerabilities();
  const { data: frameworks } = useComplianceFrameworks();

  const totalAssets = assets.length;
  const criticalVulns = vulnerabilities.filter(v => v.severity === "Critical").length;
  const pendingRecs = INITIAL_RECS.filter(r => r.status === "Pending").length;

  const criticalityData = (["Critical", "High", "Medium", "Low"] as const).map(level => {
    const count = assets.filter(a => a.criticality === level).length;
    return { name: level, value: totalAssets ? Math.round((count / totalAssets) * 100) : 0, color: CRITICALITY_COLORS[level] };
  });

  const topRecs = INITIAL_RECS.filter(r => r.status === "Pending").slice(0, 4);

  const { data: threats } = useThreats();
  const activeThreats = threats.length;
  const criticalAssetRatio = totalAssets ? assets.filter(a => a.criticality === "Critical").length / totalAssets : 0;
  const riskBreakdown = computeRiskScore({ activeThreats, criticalVulns, criticalAssetRatio });
  const OVERALL_RISK_SCORE = riskBreakdown.score;
  const riskLevel = riskLevelLabel(OVERALL_RISK_SCORE);
  const [showFormula, setShowFormula] = useState(false);
  const benchmark = benchmarkRiskScore(OVERALL_RISK_SCORE, "Banking / BFSI");
  const ealRange = computeLossRange(2.45);
  const exposureRange = computeLossRange(8.3);

  return (
    <div className="p-5 space-y-5 max-w-screen-2xl mx-auto">

      {/* Page title */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Security Risk Dashboard</h1>
            <LiveIndicator live={live} lastUpdatedAt={lastUpdatedAt} />
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Continuous risk quantification · HDFC Bank Ltd.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="text-xs px-3 py-1.5 rounded-lg border font-medium"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            onClick={() => exportDashboardExcel({
              generatedAt: new Date(),
              riskScore: OVERALL_RISK_SCORE,
              expectedAnnualLoss: "₹2.45 Cr",
              financialExposure: "₹8.3 Cr",
              totalAssets: String(totalAssets),
              criticalVulnerabilities: String(criticalVulns),
              topRisks: topRisks.map(r => ({ risk: r.risk, asset: r.asset, impact: r.impact, likelihood: r.likelihood, priority: r.priority })),
            })}
          >
            Export Excel
          </button>
          <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }} onClick={() => navigate("risk")}>
            Full Analysis →
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Live KPI Snapshot</p>
        <V1Pill label="Core dashboard KPIs, wired to live asset/vulnerability/threat data" compact />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard icon="🖥" label="Total Assets" value={String(totalAssets)} sub="Live from Asset Inventory" color="var(--accent)" onClick={() => navigate("assets")} />
        <KpiCard icon="⚠" label="Critical Vulnerabilities" value={String(criticalVulns)} sub="Live from Vulnerabilities" color="#F87171" onClick={() => navigate("vulnerabilities")} />
        <KpiCard icon="₹" label="Expected Annual Loss" value="₹2.45 Cr" sub="↓ 6% vs last quarter" color="#FBBF24" onClick={() => navigate("risk")} />
        <KpiCard icon="🎯" label="Overall Risk Score" value={`${OVERALL_RISK_SCORE} / 100`} sub={riskLevel.label} color={riskLevel.color} onClick={() => navigate("risk")} />
        <KpiCard icon="💰" label="Financial Risk Exposure" value="₹8.3 Cr" sub="Total potential loss" color="var(--accent2)" onClick={() => navigate("risk")} />
        <KpiCard icon="🤖" label="AI Recommendations" value={String(pendingRecs)} sub={`${pendingRecs} pending`} color="var(--accent)" onClick={() => navigate("ai")} />
      </div>

      {/* ── Risk Score Formula ── */}
      <Panel>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>How is {OVERALL_RISK_SCORE} calculated?</p>
              <V2Pill label="Transparent formula, inspired by SAFE Security" />
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Risk Score = Threats × Vulnerabilities × Business Consequence — every input is traceable, not a black-box model.</p>
          </div>
          <button
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border flex-shrink-0"
            style={{ borderColor: "var(--border)", color: "var(--accent2)" }}
            onClick={() => setShowFormula(s => !s)}
          >
            {showFormula ? "Hide Formula" : "Show Formula"}
          </button>
        </div>
        {showFormula && (
          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            {[
              { label: "Threats", detail: `${activeThreats} active threats tracked`, value: riskBreakdown.threatFactor, weight: "35%", color: "#F87171" },
              { label: "Vulnerabilities", detail: `${criticalVulns} critical CVEs open`, value: riskBreakdown.vulnerabilityFactor, weight: "40%", color: "#FBBF24" },
              { label: "Business Consequence", detail: `${Math.round(criticalAssetRatio * 100)}% of assets are Critical-tier`, value: riskBreakdown.consequenceFactor, weight: "25%", color: "var(--accent)" },
            ].map(f => (
              <div key={f.label} className="rounded-lg p-3" style={{ background: "var(--panel2)", border: "1px solid var(--border)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{f.label} <span style={{ color: "var(--muted)" }}>({f.weight} weight)</span></p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{f.detail}</p>
                <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: "var(--overlay-3)" }}>
                  <div className="h-full rounded-full" style={{ width: `${f.value}%`, background: f.color }} />
                </div>
                <p className="text-xs mt-1 font-mono font-bold" style={{ color: f.color }}>{f.value} / 100</p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* ── Industry Benchmark ── */}
      <Panel>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Industry Benchmark</p>
              <V2Pill label="Peer comparison, inspired by Bitsight" />
            </div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              vs. {benchmark.sector} peer median — <span style={{ color: "var(--text)" }}>illustrative reference data</span>
            </p>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="text-xs" style={{ color: "var(--muted)" }}>Your Score</p>
              <p className="text-lg font-bold font-mono" style={{ fontFamily: "'Outfit',sans-serif", color: "#F87171" }}>{benchmark.score}</p>
            </div>
            <div className="text-center">
              <p className="text-xs" style={{ color: "var(--muted)" }}>Peer Median</p>
              <p className="text-lg font-bold font-mono" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--muted)" }}>{benchmark.medianScore}</p>
            </div>
            <div className="text-center">
              <p className="text-xs" style={{ color: "var(--muted)" }}>Percentile Rank</p>
              <p className="text-lg font-bold font-mono" style={{ fontFamily: "'Outfit',sans-serif", color: benchmark.betterThanMedian ? "var(--ok)" : "#FBBF24" }}>
                {benchmark.percentile}th
              </p>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={benchmark.betterThanMedian
                ? { background: "rgba(52,211,153,0.15)", color: "#34D399" }
                : { background: "rgba(251,191,36,0.15)", color: "#FBBF24" }}
            >
              {benchmark.betterThanMedian ? "Better than peers" : "Below peer median"}
            </span>
          </div>
        </div>
        <div className="relative h-2 rounded-full mt-4" style={{ background: "var(--overlay-3)" }}>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
            style={{ left: `${benchmark.medianScore}%`, background: "var(--muted)" }}
            title="Peer median"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
            style={{ left: `calc(${benchmark.score}% - 6px)`, background: "#F87171", borderColor: "var(--bg)" }}
            title="Your score"
          />
        </div>
      </Panel>

      {/* ── FAIR Confidence Range ── */}
      <Panel>
        <SectionHeader
          title="FAIR Loss Confidence Range"
          sub="Min / Most-Likely / Max estimate — real FAIR analysis never states a single number"
          pill={<V2Pill label="Loss ranges, inspired by RiskLens" />}
        />
        <div className="grid sm:grid-cols-2 gap-5">
          <LossRangeBar label="Expected Annual Loss" range={ealRange} />
          <LossRangeBar label="Financial Risk Exposure" range={exposureRange} />
        </div>
      </Panel>

      {/* ── Row 2: EAL Trend + Criticality Donut ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* EAL Trend */}
        <Panel className="lg:col-span-2">
          <SectionHeader
            title="Expected Annual Loss (EAL) Trend"
            sub="Rolling 12-month financial risk exposure in ₹ Crore"
            action="View Details"
            onAction={() => navigate("risk")}
            pill={<V1Pill label="Live EAL trend from risk snapshots" compact />}
          />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ealTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="ealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--overlay-1)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tickFormatter={EAL_TICK} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[1.5, 4]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="eal" name="EAL (₹Cr)" stroke="var(--accent)" strokeWidth={2} fill="url(#ealGrad)" dot={false} activeDot={{ r: 4, fill: "var(--accent)" }} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        {/* Criticality Donut */}
        <Panel>
          <SectionHeader title="Risk by Asset Criticality" pill={<V1Pill label="Live distribution from Asset Inventory" compact />} />
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={criticalityData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                  {criticalityData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-1 w-full">
              {criticalityData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{d.name}</span>
                  <span className="text-xs font-semibold ml-auto" style={{ color: "var(--text)" }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* ── Row 3: Top Risk Contributors + Risk Table ── */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Bar chart */}
        <Panel className="lg:col-span-2">
          <SectionHeader title="Top Risk Contributors" sub="By financial impact %" pill={<V1Pill label="Illustrative risk-contributor breakdown" compact />} />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={riskContributors} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--overlay-1)" horizontal={false} />
              <XAxis type="number" domain={[0, 45]} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Share %" radius={[0, 4, 4, 0]}>
                {riskContributors.map((_, i) => (
                  <Cell key={i} fill={["var(--accent)", "var(--accent2)", "var(--mid)", "var(--border)"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        {/* Risk table */}
        <Panel className="lg:col-span-3">
          <SectionHeader title="Top Risk Register" sub="Ranked by risk score" action="Full Register" onAction={() => navigate("risk")} pill={<V1Pill label="Curated top-risk register" compact />} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Risk", "Asset", "Financial Impact", "Likelihood", "Score", "Priority"].map(h => (
                    <th key={h} className="text-left pb-2 pr-3 font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topRisks.map((r, i) => (
                  <tr key={i} className="border-b cg-hover-soft transition cursor-pointer" style={{ borderColor: "var(--overlay-1)" }}>
                    <td className="py-2.5 pr-3 font-medium max-w-[160px] truncate" style={{ color: "var(--text)" }}>{r.risk}</td>
                    <td className="py-2.5 pr-3" style={{ color: "var(--muted)" }}>{r.asset}</td>
                    <td className="py-2.5 pr-3 font-mono font-semibold" style={{ color: "#FBBF24" }}>{r.impact}</td>
                    <td className="py-2.5 pr-3" style={{ color: "var(--muted)" }}>{r.likelihood}</td>
                    <td className="py-2.5 pr-3">
                      <span className="font-bold font-mono" style={{ color: r.score >= 80 ? "#F87171" : r.score >= 65 ? "#FBBF24" : "var(--accent2)" }}>{r.score}</span>
                    </td>
                    <td className="py-2.5"><PriorityBadge p={r.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* ── Row 4: AI Recommendations (preview) ── */}
      <Panel>
        <SectionHeader
          title="AI Recommendations"
          sub="Priority-ranked, cost-optimised remediation actions"
          action={`View All ${INITIAL_RECS.length}`}
          onAction={() => navigate("ai")}
          pill={<V1Pill label="Live preview from shared recommendations data" compact />}
        />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {topRecs.map(r => (
            <div key={r.id} className="rounded-lg border p-3 hover:border-opacity-70 transition cursor-pointer" style={{ background: "var(--panel2)", borderColor: "var(--border)" }}>
              <div className="flex items-start gap-2.5 mb-2.5">
                <span className="text-base">{r.icon}</span>
                <p className="text-xs font-semibold leading-snug" style={{ color: "var(--text)" }}>{r.title}</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Est. Cost</p>
                  <p className="text-sm font-bold font-mono" style={{ color: "var(--accent2)" }}>{r.cost}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Risk ↓</p>
                  <p className="text-sm font-bold" style={{ color: "var(--ok)" }}>−{r.reduction}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <PriorityBadge p={r.impact} />
                <button className="text-xs font-semibold" style={{ color: "var(--accent)" }} onClick={() => navigate("ai")}>View Details →</button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ── Row 5: Investment vs Risk Reduction + Compliance ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Investment chart */}
        <Panel className="lg:col-span-2">
          <SectionHeader
            title="Investment vs. Risk Reduction"
            sub="Expected Annual Loss (₹Cr) as a function of cybersecurity spend (₹L)"
            action="Simulator"
            onAction={() => navigate("whatif")}
            pill={<V1Pill label="Illustrative investment curve" compact />}
          />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={investmentChart} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--overlay-1)" />
              <XAxis dataKey="invest" tickFormatter={v => `₹${v}L`} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={EAL_TICK} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0.5, 2.8]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="risk" name="EAL (₹Cr)" stroke="var(--accent)" strokeWidth={2} dot={{ fill: "var(--accent)", r: 3 }} activeDot={{ r: 5 }} />
              {/* Optimal zone annotation */}
              <defs>
                <linearGradient id="optZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            <span style={{ color: "var(--accent)" }}>Optimal zone: ₹25L–₹80L investment</span> — steepest EAL reduction per rupee spent.
          </p>
        </Panel>

        {/* Compliance */}
        <Panel>
          <SectionHeader
            title="Compliance Coverage"
            sub="Framework alignment score"
            action="Full Report"
            onAction={() => navigate("reports")}
            pill={<V1Pill label="Live from Compliance frameworks" compact />}
          />
          <div className="space-y-3">
            {frameworks.map(c => (
              <div key={c.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{c.name}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: c.compliance >= 75 ? "var(--ok)" : c.compliance >= 60 ? "#FBBF24" : "#F87171" }}>{c.compliance}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--overlay-3)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${c.compliance}%`,
                      background: c.compliance >= 75 ? "#34D399" : c.compliance >= 60 ? "#FBBF24" : "#F87171",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg p-3 text-xs" style={{ background: "rgba(156,223,240,0.07)", border: "1px solid rgba(156,223,240,0.15)" }}>
            <p className="font-semibold mb-0.5" style={{ color: "var(--accent)" }}>
              {frameworks.filter(f => f.evidence === "Refresh due").length > 0
                ? `${frameworks.filter(f => f.evidence === "Refresh due").length} framework(s) need evidence refresh`
                : "All frameworks current"}
            </p>
            <p style={{ color: "var(--muted)" }}>
              {frameworks.find(f => f.evidence === "Refresh due")?.name ?? frameworks[0]?.name} last assessed {frameworks.find(f => f.evidence === "Refresh due")?.assessed ?? frameworks[0]?.assessed}.
            </p>
          </div>
        </Panel>
      </div>

    </div>
  );
}
