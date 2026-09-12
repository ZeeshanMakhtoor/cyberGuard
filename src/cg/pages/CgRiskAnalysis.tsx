import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
} from "recharts";
import type { CgPage } from "../../App";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";
import { useAssets } from "@/hooks/useAssets";
import { useThreats } from "@/hooks/useThreats";
import { benchmarkRiskScore } from "@/lib/benchmark";
import { computeLossRange, formatCr } from "@/lib/lossRange";
import { computeRiskScore, riskLevelLabel } from "@/lib/riskScore";
import V2Pill from "@/components/V2Pill";
import V1Pill from "@/components/V1Pill";

interface Props { navigate: (p: CgPage) => void; }

const radarData = [
  { subject: "Access Control",    current: 58, target: 85 },
  { subject: "Data Protection",   current: 72, target: 90 },
  { subject: "Incident Response", current: 45, target: 80 },
  { subject: "Asset Mgmt",        current: 69, target: 88 },
  { subject: "Threat Detection",  current: 51, target: 85 },
  { subject: "Patch Mgmt",        current: 43, target: 90 },
];

const scatter = [
  { impact: 92, likelihood: 85, name: "RCE via CVE-2024-21413", size: 42 },
  { impact: 88, likelihood: 65, name: "Credential Stuffing", size: 38 },
  { impact: 95, likelihood: 55, name: "Ransomware", size: 120 },
  { impact: 70, likelihood: 40, name: "SQL Injection", size: 56 },
  { impact: 55, likelihood: 80, name: "MFA Bypass", size: 29 },
  { impact: 42, likelihood: 35, name: "Exposed S3", size: 18 },
  { impact: 30, likelihood: 25, name: "Outdated TLS", size: 12 },
  { impact: 65, likelihood: 72, name: "Insider Threat", size: 35 },
];

const monthlyEAL = [
  { m: "Sep", eal: 3.1, patched: 2.7 },
  { m: "Oct", eal: 2.9, patched: 2.5 },
  { m: "Nov", eal: 3.4, patched: 2.9 },
  { m: "Dec", eal: 3.0, patched: 2.6 },
  { m: "Jan", eal: 2.7, patched: 2.3 },
  { m: "Feb", eal: 2.5, patched: 2.1 },
  { m: "Mar", eal: 2.8, patched: 2.3 },
  { m: "Apr", eal: 3.2, patched: 2.7 },
  { m: "May", eal: 2.9, patched: 2.4 },
  { m: "Jun", eal: 2.6, patched: 2.2 },
  { m: "Jul", eal: 2.45, patched: 2.0 },
  { m: "Aug", eal: 2.45, patched: 2.0 },
];

const domains = [
  { name: "Cloud Infrastructure", score: 61, risks: 24, exposure: "₹2.1Cr" },
  { name: "Corporate Network",    score: 54, risks: 31, exposure: "₹3.4Cr" },
  { name: "Web Applications",     score: 68, risks: 19, exposure: "₹1.6Cr" },
  { name: "Endpoints",            score: 72, risks: 12, exposure: "₹0.9Cr" },
  { name: "Third-party / Supply", score: 48, risks: 8,  exposure: "₹0.3Cr" },
  { name: "Human / Social Eng.",  score: 43, risks: 14, exposure: "₹0.7Cr" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "var(--panel3)", borderColor: "var(--border)", color: "var(--text)" }}>
      <p className="font-semibold mb-1" style={{ color: "var(--accent)" }}>{label || payload[0]?.payload?.name}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.stroke || p.fill || "var(--text)" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#F87171" : score >= 60 ? "#FBBF24" : "#34D399";
  const pct = score / 100;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - pct * 0.75);
  return (
    <div className="relative flex items-center justify-center w-40 h-32 mx-auto">
      <svg viewBox="0 0 140 110" className="absolute inset-0 w-full h-full">
        <path d="M 14 98 A 56 56 0 0 1 126 98" fill="none" stroke="var(--overlay-3)" strokeWidth="10" strokeLinecap="round" />
        <path d="M 14 98 A 56 56 0 0 1 126 98" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${circ * 0.75}`}
          strokeDashoffset={`${circ * 0.75 * (1 - pct)}`}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="text-center mt-4">
        <div className="text-3xl font-extrabold leading-none" style={{ fontFamily: "'Outfit',sans-serif", color }}>{score}</div>
        <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>/ 100</div>
      </div>
    </div>
  );
}

export default function CgRiskAnalysis({ navigate }: Props) {
  const { data: vulnerabilities } = useVulnerabilities();
  const { data: assets } = useAssets();
  const { data: threats } = useThreats();
  const openRisks = vulnerabilities.filter(v => v.status === "Open").length;
  const criticalVulns = vulnerabilities.filter(v => v.severity === "Critical").length;
  const criticalAssetRatio = assets.length ? assets.filter(a => a.criticality === "Critical").length / assets.length : 0;
  const riskBreakdown = computeRiskScore({ activeThreats: threats.length, criticalVulns, criticalAssetRatio });
  const riskLevel = riskLevelLabel(riskBreakdown.score);
  const benchmark = benchmarkRiskScore(riskBreakdown.score, "Banking / BFSI");
  const ealRange = computeLossRange(2.45);
  const exposureRange = computeLossRange(8.3);

  return (
    <div className="p-5 max-w-screen-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Risk Analysis</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Quantitative financial risk assessment — FAIR-aligned methodology</p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }}
          onClick={() => navigate("whatif")}>
          What-if Simulator →
        </button>
      </div>

      {/* Top row */}
      <div className="grid lg:grid-cols-4 gap-4">
        {/* Gauge */}
        <div className="rounded-xl border p-4 flex flex-col items-center" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>OVERALL RISK SCORE</p>
            <V1Pill label="Live risk gauge" compact />
          </div>
          <ScoreGauge score={riskBreakdown.score} />
          <div className="mt-1 text-center">
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: `${riskLevel.color}26`, color: riskLevel.color }}>{riskLevel.label}</span>
          </div>
          <div className="mt-3 space-y-1 w-full">
            {[["MTTR", "14.2 days"], ["Open Risks", String(openRisks)]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs">
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span className="font-semibold font-mono" style={{ color: "var(--text)" }}>{v}</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-xs" title={`Range: ${formatCr(ealRange.min)} – ${formatCr(ealRange.max)} (FAIR-style confidence range, inspired by RiskLens)`}>
              <span className="flex items-center gap-1.5" style={{ color: "var(--muted)" }}>EAL <V2Pill label="Loss range, inspired by RiskLens" compact /></span>
              <span className="font-semibold font-mono" style={{ color: "var(--text)" }}>{formatCr(ealRange.likely)}</span>
            </div>
            <div className="flex justify-between text-xs" title={`Range: ${formatCr(exposureRange.min)} – ${formatCr(exposureRange.max)}`}>
              <span style={{ color: "var(--muted)" }}>Max Exposure</span>
              <span className="font-semibold font-mono" style={{ color: "var(--text)" }}>{formatCr(exposureRange.likely)}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t w-full" style={{ borderColor: "var(--overlay-2)" }}>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs" style={{ color: "var(--muted)" }}>vs. {benchmark.sector} peer median</p>
              <V2Pill label="Peer benchmark, inspired by Bitsight" compact />
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--muted)" }}>Peer median: <span style={{ color: "var(--text)" }}>{benchmark.medianScore}</span></span>
              <span className="font-semibold" style={{ color: benchmark.betterThanMedian ? "var(--ok)" : "#FBBF24" }}>{benchmark.percentile}th percentile</span>
            </div>
          </div>
        </div>

        {/* EAL chart */}
        <div className="lg:col-span-3 rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>EAL TREND — ACTUAL vs. IF PATCHED (₹ Crore)</p>
            <V1Pill label="Illustrative patched-vs-actual EAL comparison" compact />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyEAL} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="ealA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="ealB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--overlay-1)" />
              <XAxis dataKey="m" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `₹${v}Cr`} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[1.5, 4]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="eal" name="Actual EAL" stroke="#F87171" fill="url(#ealA)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="patched" name="If Patched" stroke="#34D399" fill="url(#ealB)" strokeWidth={2} dot={false} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Gap represents <span style={{ color: "#FBBF24" }}>₹45L/year</span> in avoidable loss if critical patches are applied promptly.
          </p>
        </div>
      </div>

      {/* Row 2: Scatter + Radar */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Risk matrix */}
        <div className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>RISK MATRIX — IMPACT vs. LIKELIHOOD</p>
            <V1Pill label="Illustrative impact/likelihood scatter" compact />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--overlay-1)" />
              <XAxis dataKey="likelihood" type="number" name="Likelihood" domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "Likelihood →", position: "insideBottomRight", offset: -4, fill: "var(--mid)", fontSize: 10 }} />
              <YAxis dataKey="impact" type="number" name="Impact" domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "Impact ↑", angle: -90, position: "insideLeft", offset: 8, fill: "var(--mid)", fontSize: 10 }} />
              <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "var(--border)" }} content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "var(--panel3)", borderColor: "var(--border)", color: "var(--text)" }}>
                    <p className="font-semibold mb-1" style={{ color: "var(--accent)" }}>{d.name}</p>
                    <p>Impact: {d.impact}</p>
                    <p>Likelihood: {d.likelihood}</p>
                  </div>
                );
              }} />
              <Scatter
                data={scatter}
                fill="var(--accent)"
              >
                {scatter.map((d, i) => (
                  <circle key={i} style={{ fill: d.impact > 75 && d.likelihood > 60 ? "#F87171" : d.impact > 60 ? "#FBBF24" : "var(--accent2)" }} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>SECURITY POSTURE RADAR</p>
              <V1Pill label="Illustrative current-vs-target posture radar" compact />
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block" style={{ background: "var(--accent)" }} /> Current</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block" style={{ background: "#34D399" }} /> Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 8, right: 20, left: 20, bottom: 8 }}>
              <PolarGrid stroke="var(--overlay-4)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <Radar name="Current" dataKey="current" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.12} strokeWidth={1.5} />
              <Radar name="Target" dataKey="target" stroke="#34D399" fill="#34D399" fillOpacity={0.07} strokeWidth={1.5} strokeDasharray="4 2" />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domain table */}
      <div className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-1.5 mb-4">
          <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>RISK BY SECURITY DOMAIN</p>
          <V1Pill label="Illustrative security-domain risk breakdown" compact />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Domain", "Risk Score", "Open Risks", "Financial Exposure", "Trend", "Action"].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 font-semibold" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {domains.map((d, i) => (
                <tr key={i} className="border-b cg-hover-soft transition" style={{ borderColor: "var(--overlay-1)" }}>
                  <td className="py-3 pr-4 font-medium" style={{ color: "var(--text)" }}>{d.name}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--overlay-3)" }}>
                        <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: d.score >= 70 ? "var(--accent)" : d.score >= 55 ? "#FBBF24" : "#F87171" }} />
                      </div>
                      <span className="font-mono font-semibold" style={{ color: d.score >= 70 ? "var(--accent)" : d.score >= 55 ? "#FBBF24" : "#F87171" }}>{d.score}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono" style={{ color: "var(--muted)" }}>{d.risks}</td>
                  <td className="py-3 pr-4 font-mono font-semibold" style={{ color: "#FBBF24" }}>{d.exposure}</td>
                  <td className="py-3 pr-4" style={{ color: d.score < 60 ? "#F87171" : "#34D399" }}>{d.score < 60 ? "↑ Worsening" : "↓ Improving"}</td>
                  <td className="py-3">
                    <button className="text-xs font-semibold" style={{ color: "var(--accent)" }} onClick={() => navigate("whatif")}>Simulate →</button>
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
