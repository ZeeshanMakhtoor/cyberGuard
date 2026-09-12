import { useState, type ReactElement, type ReactNode } from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useReveal } from "../lib/useReveal";

const EAL_DATA = [
  { m: "Apr", eal: 3.4 }, { m: "May", eal: 3.0 }, { m: "Jun", eal: 2.7 },
  { m: "Jul", eal: 2.9 }, { m: "Aug", eal: 2.45 }, { m: "Sep", eal: 2.2 },
];

const SEVERITY_DATA = [
  { name: "Critical", value: 7, color: "#F87171" },
  { name: "High", value: 1, color: "#FBBF24" },
  { name: "Medium", value: 0, color: "#7FB8E8" },
];

const POSTURE_DATA = [
  { area: "Access Control", value: 86 }, { area: "Data Protection", value: 79 },
  { area: "Incident Resp.", value: 71 }, { area: "Asset Mgmt", value: 74 },
  { area: "Threat Detect.", value: 68 }, { area: "Patch Mgmt", value: 61 },
];

const COMPLIANCE_DATA = [
  { name: "ISO 27001", value: 84 }, { name: "NIST CSF", value: 78 },
  { name: "CIS Controls", value: 81 }, { name: "RBI CSF", value: 88 },
];

const WHATIF_DATA = [
  { scenario: "Current", eal: 2.45 }, { scenario: "+ MFA everywhere", eal: 1.91 },
  { scenario: "+ EDR rollout", eal: 1.58 }, { scenario: "+ Segmentation", eal: 1.29 },
];

interface Feature {
  key: string;
  title: string;
  desc: string;
  icon: ReactElement;
  preview: ReactElement;
}

function Icon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ChartCard = ({ title, sub, children }: { title: string; sub: string; children: ReactNode }) => (
  <div className="lp-card p-5" style={{ height: 340 }}>
    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--lp-muted)" }}>{title}</p>
    <p className="text-sm font-bold mt-0.5">{sub}</p>
    <div className="mt-4" style={{ height: 250 }}>{children}</div>
  </div>
);

const FEATURES: Feature[] = [
  {
    key: "risk",
    title: "FAIR-Aligned Risk Scoring",
    desc: "A transparent 0–100 risk score built from live threat, vulnerability, and business-consequence data — every factor traceable, never a black box.",
    icon: <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    preview: (
      <ChartCard title="Expected Annual Loss" sub="Rolling 6-month trend, ₹ Crore">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={EAL_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="fEal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#58D6C9" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#58D6C9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-border)" vertical={false} />
            <XAxis dataKey="m" stroke="var(--lp-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--lp-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--lp-panel2)", border: "1px solid var(--lp-border)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="eal" stroke="#58D6C9" strokeWidth={2} fill="url(#fEal)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "vuln",
    title: "Vulnerability Management",
    desc: "Every CVE prioritized by attack-path likelihood, not raw CVSS — so remediation effort goes where it actually reduces risk.",
    icon: <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    preview: (
      <ChartCard title="Vulnerabilities by Severity" sub="Live from connected scanners">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SEVERITY_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--lp-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--lp-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--lp-panel2)", border: "1px solid var(--lp-border)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {SEVERITY_DATA.map(d => <Cell key={d.name} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "posture",
    title: "Security Posture Radar",
    desc: "See coverage and effectiveness across access control, data protection, detection, and response in one glance.",
    icon: <Icon d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    preview: (
      <ChartCard title="Control Effectiveness" sub="Across 6 security domains">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={POSTURE_DATA}>
            <PolarGrid stroke="var(--lp-border)" />
            <PolarAngleAxis dataKey="area" stroke="var(--lp-muted)" fontSize={10} />
            <Radar dataKey="value" stroke="#7FB8E8" fill="#7FB8E8" fillOpacity={0.25} strokeWidth={1.5} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "compliance",
    title: "Compliance & Framework Mapping",
    desc: "Automatically map controls onto ISO 27001, NIST CSF, CIS, and RBI CSF — with letter grades and one-click audit exports.",
    icon: <Icon d="M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    preview: (
      <ChartCard title="Framework Compliance" sub="Mean coverage per framework">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={COMPLIANCE_DATA} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-border)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="var(--lp-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" stroke="var(--lp-muted)" fontSize={11} tickLine={false} axisLine={false} width={80} />
            <Tooltip contentStyle={{ background: "var(--lp-panel2)", border: "1px solid var(--lp-border)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#58D6C9" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "whatif",
    title: "What-If Scenario Simulator",
    desc: "Model a security investment before you make it — see the projected drop in expected annual loss and the ROI.",
    icon: <Icon d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    preview: (
      <ChartCard title="Projected EAL by Scenario" sub="₹ Crore — lower is better">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WHATIF_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-border)" vertical={false} />
            <XAxis dataKey="scenario" stroke="var(--lp-muted)" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-10} textAnchor="end" height={50} />
            <YAxis stroke="var(--lp-muted)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--lp-panel2)", border: "1px solid var(--lp-border)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="eal" radius={[6, 6, 0, 0]} fill="#7FB8E8" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "ai",
    title: "AI Risk Assistant",
    desc: "Ask plain-English questions — \"what's our highest financial risk today?\" — and get answers grounded in your live data, not a generic chatbot.",
    icon: <Icon d="M13 10V3L4 14h7v7l9-11h-7z" />,
    preview: (
      <ChartCard title="CyberGuard AI Assistant" sub="Grounded in your live data">
        <div className="flex flex-col gap-2.5 h-full justify-center">
          <div className="text-xs rounded-lg px-3 py-2 self-start max-w-[85%]" style={{ background: "var(--lp-panel2)", color: "var(--lp-text)" }}>
            What's our highest financial cyber risk today?
          </div>
          <div className="text-xs rounded-lg px-3 py-2 self-end max-w-[90%]" style={{ background: "rgba(88,214,201,0.12)", border: "1px solid rgba(88,214,201,0.3)", color: "var(--lp-text)" }}>
            Log4j on your ERP system (CVE-2021-44228) — actively exploited, 890 days open, ₹88L modeled impact. Patching it cuts EAL by ~14%.
          </div>
          <div className="text-xs rounded-lg px-3 py-2 self-start max-w-[85%]" style={{ background: "var(--lp-panel2)", color: "var(--lp-text)" }}>
            Where should we spend our next ₹50 lakh?
          </div>
        </div>
      </ChartCard>
    ),
  },
];

export default function Features() {
  const [active, setActive] = useState(0);
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="features" className="lp-section" style={{ background: "var(--lp-bg2)" }}>
      <div className="lp-container">
        <div ref={ref} className={`lp-fade-up ${visible ? "lp-visible" : ""} max-w-2xl`}>
          <span className="lp-eyebrow">What We Do</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            One platform. Every angle of cyber risk.
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--lp-muted)" }}>
            Click through the modules below — this is the same live data model that powers the actual
            product, not mockups.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-2">
            {FEATURES.map((f, i) => (
              <button
                key={f.key}
                onClick={() => setActive(i)}
                className="text-left rounded-xl p-4 transition-colors flex gap-3 items-start"
                style={{
                  background: active === i ? "var(--lp-panel)" : "transparent",
                  border: `1px solid ${active === i ? "var(--lp-border)" : "transparent"}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: active === i ? "rgba(88,214,201,0.15)" : "var(--lp-panel)",
                    color: active === i ? "var(--lp-accent)" : "var(--lp-muted)",
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--lp-muted)" }}>{f.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3" style={{ minHeight: 320 }}>
            {FEATURES[active].preview}
          </div>
        </div>
      </div>
    </section>
  );
}
