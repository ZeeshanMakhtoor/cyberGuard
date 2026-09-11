import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend,
} from "recharts";
import type { CgPage } from "../../App";

interface Props { navigate: (p: CgPage) => void; }

// ── DATA ──────────────────────────────────────────────────────────────────
const ealTrend = [
  { month: "Sep '24", eal: 3.1 }, { month: "Oct '24", eal: 2.9 }, { month: "Nov '24", eal: 3.4 },
  { month: "Dec '24", eal: 3.0 }, { month: "Jan '25", eal: 2.7 }, { month: "Feb '25", eal: 2.5 },
  { month: "Mar '25", eal: 2.8 }, { month: "Apr '25", eal: 3.2 }, { month: "May '25", eal: 2.9 },
  { month: "Jun '25", eal: 2.6 }, { month: "Jul '25", eal: 2.45 }, { month: "Aug '25", eal: 2.45 },
];

const criticalityData = [
  { name: "Critical", value: 14, color: "#F87171" },
  { name: "High",     value: 28, color: "#FBBF24" },
  { name: "Medium",   value: 36, color: "#60B8CF" },
  { name: "Low",      value: 22, color: "#5196A7" },
];

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

const compliance = [
  { name: "ISO/IEC 27001",                   pct: 74 },
  { name: "NIST Cybersecurity Framework",    pct: 68 },
  { name: "CIS Controls v8",                 pct: 61 },
  { name: "RBI Cyber Security Framework",    pct: 83 },
  { name: "SEBI Cyber Resilience Framework", pct: 71 },
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

function SectionHeader({ title, sub, action, onAction }: { title: string; sub?: string; action?: string; onAction?: () => void; }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-sm font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>{title}</h2>
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
    Medium:   ["#60B8CF", "rgba(96,184,207,0.15)"],
    Low:      ["#5196A7", "rgba(81,150,167,0.15)"],
  };
  const [c, bg] = map[p] ?? ["#94a3b8", "rgba(148,163,184,0.1)"];
  return (
    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ color: c, background: bg }}>{p}</span>
  );
}

const EAL_TICK = (v: number) => `₹${v}Cr`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border px-3 py-2 text-xs" style={{ background: "#0d1b26", borderColor: "var(--border)", color: "var(--text)" }}>
      <p className="font-semibold mb-1" style={{ color: "var(--accent)" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || "var(--text)" }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

// ── PAGE ──────────────────────────────────────────────────────────────────
export default function CgDashboard({ navigate }: Props) {
  return (
    <div className="p-5 space-y-5 max-w-screen-2xl mx-auto">

      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>Security Risk Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Last updated: 01 Sep 2026, 09:42 IST · HDFC Bank Ltd.</p>
        </div>
        <div className="flex gap-2">
          <button className="text-xs px-3 py-1.5 rounded-lg border font-medium" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>Export PDF</button>
          <button className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ background: "var(--accent)", color: "var(--bg)" }} onClick={() => navigate("risk")}>
            Full Analysis →
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard icon="🖥" label="Total Assets" value="1,248" sub="+12 this week" color="#9CDFF0" onClick={() => navigate("assets")} />
        <KpiCard icon="⚠" label="Critical Vulnerabilities" value="86" sub="↑ 7 new (24h)" color="#F87171" onClick={() => navigate("vulnerabilities")} />
        <KpiCard icon="₹" label="Expected Annual Loss" value="₹2.45 Cr" sub="↓ 6% vs last quarter" color="#FBBF24" onClick={() => navigate("risk")} />
        <KpiCard icon="🎯" label="Overall Risk Score" value="72 / 100" sub="High — action needed" color="#F87171" onClick={() => navigate("risk")} />
        <KpiCard icon="💰" label="Financial Risk Exposure" value="₹8.3 Cr" sub="Total potential loss" color="#60B8CF" onClick={() => navigate("risk")} />
        <KpiCard icon="🤖" label="AI Recommendations" value="23" sub="8 critical pending" color="#9CDFF0" onClick={() => navigate("ai")} />
      </div>

      {/* ── Row 2: EAL Trend + Criticality Donut ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* EAL Trend */}
        <Panel className="lg:col-span-2">
          <SectionHeader
            title="Expected Annual Loss (EAL) Trend"
            sub="Rolling 12-month financial risk exposure in ₹ Crore"
            action="View Details"
            onAction={() => navigate("risk")}
          />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ealTrend} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="ealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9CDFF0" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#9CDFF0" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tickFormatter={EAL_TICK} tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} domain={[1.5, 4]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="eal" name="EAL (₹Cr)" stroke="#9CDFF0" strokeWidth={2} fill="url(#ealGrad)" dot={false} activeDot={{ r: 4, fill: "#9CDFF0" }} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        {/* Criticality Donut */}
        <Panel>
          <SectionHeader title="Risk by Asset Criticality" />
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
          <SectionHeader title="Top Risk Contributors" sub="By financial impact %" />
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={riskContributors} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0, 45]} tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Share %" radius={[0, 4, 4, 0]}>
                {riskContributors.map((_, i) => (
                  <Cell key={i} fill={["#9CDFF0", "#60B8CF", "#5196A7", "#38707D"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        {/* Risk table */}
        <Panel className="lg:col-span-3">
          <SectionHeader title="Top Risk Register" sub="Ranked by risk score" action="Full Register" onAction={() => navigate("risk")} />
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
                  <tr key={i} className="border-b hover:bg-white/[0.02] transition cursor-pointer" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <td className="py-2.5 pr-3 font-medium max-w-[160px] truncate" style={{ color: "var(--text)" }}>{r.risk}</td>
                    <td className="py-2.5 pr-3" style={{ color: "var(--muted)" }}>{r.asset}</td>
                    <td className="py-2.5 pr-3 font-mono font-semibold" style={{ color: "#FBBF24" }}>{r.impact}</td>
                    <td className="py-2.5 pr-3" style={{ color: "var(--muted)" }}>{r.likelihood}</td>
                    <td className="py-2.5 pr-3">
                      <span className="font-bold font-mono" style={{ color: r.score >= 80 ? "#F87171" : r.score >= 65 ? "#FBBF24" : "#60B8CF" }}>{r.score}</span>
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
        <SectionHeader title="AI Recommendations" sub="Priority-ranked, cost-optimised remediation actions" action="View All 23" onAction={() => navigate("ai")} />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { title: "Patch Critical CVEs (Tier-1 Systems)", cost: "₹4.2L", reduction: "18%", impact: "Critical", icon: "🔧" },
            { title: "Enable MFA for Privileged Accounts",   cost: "₹85K",  reduction: "12%", impact: "Critical", icon: "🔐" },
            { title: "Restrict Unnecessary Admin Access",    cost: "₹60K",  reduction: "9%",  impact: "High",     icon: "🛡" },
            { title: "Deploy Anti-Phishing Simulation",      cost: "₹1.1L", reduction: "7%",  impact: "High",     icon: "🎣" },
          ].map(r => (
            <div key={r.title} className="rounded-lg border p-3 hover:border-opacity-70 transition cursor-pointer" style={{ background: "#1a2f3c", borderColor: "var(--border)" }}>
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
          />
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={investmentChart} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="invest" tickFormatter={v => `₹${v}L`} tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={EAL_TICK} tick={{ fill: "#8BB8C4", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0.5, 2.8]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="risk" name="EAL (₹Cr)" stroke="#9CDFF0" strokeWidth={2} dot={{ fill: "#9CDFF0", r: 3 }} activeDot={{ r: 5 }} />
              {/* Optimal zone annotation */}
              <defs>
                <linearGradient id="optZone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9CDFF0" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#9CDFF0" stopOpacity={0.01} />
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
          <SectionHeader title="Compliance Coverage" sub="Framework alignment score" action="Full Report" onAction={() => navigate("reports")} />
          <div className="space-y-3">
            {compliance.map(c => (
              <div key={c.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{c.name}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: c.pct >= 75 ? "var(--ok)" : c.pct >= 60 ? "#FBBF24" : "#F87171" }}>{c.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${c.pct}%`,
                      background: c.pct >= 75 ? "#34D399" : c.pct >= 60 ? "#FBBF24" : "#F87171",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg p-3 text-xs" style={{ background: "rgba(156,223,240,0.07)", border: "1px solid rgba(156,223,240,0.15)" }}>
            <p className="font-semibold mb-0.5" style={{ color: "var(--accent)" }}>Next audit: 15 Oct 2026</p>
            <p style={{ color: "var(--muted)" }}>RBI CSF assessment due. 4 controls require remediation.</p>
          </div>
        </Panel>
      </div>

    </div>
  );
}
