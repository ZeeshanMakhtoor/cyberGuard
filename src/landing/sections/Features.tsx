import { useState, type ReactNode } from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Gauge, ShieldAlert, RadarIcon, ClipboardCheck, FlaskConical, Sparkles } from "lucide-react";
import { useReveal } from "../lib/useReveal";

const EAL_DATA = [
  { m: "Apr", eal: 3.4 }, { m: "May", eal: 3.0 }, { m: "Jun", eal: 2.7 },
  { m: "Jul", eal: 2.9 }, { m: "Aug", eal: 2.45 }, { m: "Sep", eal: 2.2 },
];

const SEVERITY_DATA = [
  { name: "Critical", value: 7, color: "#DC2626" },
  { name: "High", value: 1, color: "#B45309" },
  { name: "Medium", value: 0, color: "#1E7A93" },
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
  { scenario: "Current", eal: 2.45 }, { scenario: "+ MFA", eal: 1.91 },
  { scenario: "+ EDR", eal: 1.58 }, { scenario: "+ Segmentation", eal: 1.29 },
];

const tooltipStyle = { background: "#fff", border: "1px solid var(--lp-border)", borderRadius: 8, fontSize: 12, boxShadow: "var(--lp-shadow-md)" };
const axisProps = { stroke: "var(--lp-muted)", fontSize: 11, tickLine: false, axisLine: false };

interface Feature {
  key: string;
  title: string;
  desc: string;
  icon: typeof Gauge;
  color: string;
  bg: string;
  preview: ReactNode;
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
    icon: Gauge,
    color: "var(--lp-accent)",
    bg: "var(--lp-accent-soft)",
    preview: (
      <ChartCard title="Expected Annual Loss" sub="Rolling 6-month trend, ₹ Crore">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={EAL_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="fEal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0E7A98" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0E7A98" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-border)" vertical={false} />
            <XAxis dataKey="m" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="eal" stroke="#0E7A98" strokeWidth={2} fill="url(#fEal)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "vuln",
    title: "Vulnerability Management",
    desc: "Every CVE prioritized by attack-path likelihood, not raw CVSS — so remediation effort goes where it actually reduces risk.",
    icon: ShieldAlert,
    color: "var(--lp-danger)",
    bg: "var(--lp-danger-soft)",
    preview: (
      <ChartCard title="Vulnerabilities by Severity" sub="Live from connected scanners">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SEVERITY_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-border)" vertical={false} />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} />
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
    icon: RadarIcon,
    color: "var(--lp-accent2)",
    bg: "var(--lp-accent-soft)",
    preview: (
      <ChartCard title="Control Effectiveness" sub="Across 6 security domains">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={POSTURE_DATA}>
            <PolarGrid stroke="var(--lp-border)" />
            <PolarAngleAxis dataKey="area" stroke="var(--lp-muted)" fontSize={10} />
            <Radar dataKey="value" stroke="#1E7A93" fill="#1E7A93" fillOpacity={0.2} strokeWidth={1.5} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "compliance",
    title: "Compliance & Framework Mapping",
    desc: "Automatically map controls onto ISO 27001, NIST CSF, CIS, and RBI CSF — with letter grades and one-click audit exports.",
    icon: ClipboardCheck,
    color: "var(--lp-ok)",
    bg: "var(--lp-ok-soft)",
    preview: (
      <ChartCard title="Framework Compliance" sub="Mean coverage per framework">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={COMPLIANCE_DATA} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-border)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} {...axisProps} />
            <YAxis type="category" dataKey="name" width={80} {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#15803D" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "whatif",
    title: "What-If Scenario Simulator",
    desc: "Model a security investment before you make it — see the projected drop in expected annual loss and the ROI.",
    icon: FlaskConical,
    color: "var(--lp-warn)",
    bg: "var(--lp-warn-soft)",
    preview: (
      <ChartCard title="Projected EAL by Scenario" sub="₹ Crore — lower is better">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WHATIF_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lp-border)" vertical={false} />
            <XAxis dataKey="scenario" interval={0} fontSize={10} tickLine={false} axisLine={false} stroke="var(--lp-muted)" />
            <YAxis {...axisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="eal" radius={[6, 6, 0, 0]} fill="#B45309" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    ),
  },
  {
    key: "ai",
    title: "AI Risk Assistant",
    desc: "Ask plain-English questions — \"what's our highest financial risk today?\" — and get answers grounded in your live data, not a generic chatbot.",
    icon: Sparkles,
    color: "var(--lp-accent)",
    bg: "var(--lp-accent-soft)",
    preview: (
      <ChartCard title="CyberGuard AI Assistant" sub="Grounded in your live data">
        <div className="flex flex-col gap-2.5 h-full justify-center">
          <div className="text-xs rounded-lg px-3 py-2 self-start max-w-[85%]" style={{ background: "var(--lp-panel2)", color: "var(--lp-text)" }}>
            What's our highest financial cyber risk today?
          </div>
          <div className="text-xs rounded-lg px-3 py-2 self-end max-w-[90%]" style={{ background: "var(--lp-accent-soft)", border: "1px solid rgba(14,122,152,0.25)", color: "var(--lp-text)" }}>
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

function FeatureButton({ children, delay }: { children: ReactNode; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`lp-fade-up ${visible ? "lp-visible" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function FeaturePreview({ children, minHeight }: { children: ReactNode; minHeight: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`lp-fade-up ${visible ? "lp-visible" : ""} lg:col-span-3`} style={{ minHeight, transitionDelay: "120ms" }}>
      {children}
    </div>
  );
}

export default function Features() {
  const [active, setActive] = useState(0);
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="features" className="lp-section" style={{ background: "var(--lp-panel2)" }}>
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
            {FEATURES.map((f, i) => {
              const IconCmp = f.icon;
              const isActive = active === i;
              return (
                <FeatureButton key={f.key} delay={i * 70}>
                  <button
                    onClick={() => setActive(i)}
                    className="lp-card text-left p-4 transition-shadow flex gap-3 items-start w-full"
                    style={{
                      borderColor: isActive ? f.color : "var(--lp-border)",
                      boxShadow: isActive ? "var(--lp-shadow-md)" : "var(--lp-shadow-sm)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: f.bg }}
                    >
                      <IconCmp className="w-4.5 h-4.5" style={{ color: f.color }} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{f.title}</p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--lp-muted)" }}>{f.desc}</p>
                    </div>
                  </button>
                </FeatureButton>
              );
            })}
          </div>

          <FeaturePreview minHeight={340}>
            {FEATURES[active].preview}
          </FeaturePreview>
        </div>
      </div>
    </section>
  );
}
