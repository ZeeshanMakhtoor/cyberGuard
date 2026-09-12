import { useState } from "react";
import type { CgPage } from "../../App";

interface Props { navigate: (p: CgPage) => void; }

const SECTIONS = [
  { id: "org",          label: "Organization" },
  { id: "users",        label: "Users" },
  { id: "integrations", label: "Security Integrations" },
  { id: "notifications",label: "Notification Preferences" },
  { id: "risk",         label: "Risk Calculation Settings" },
  { id: "ai",           label: "AI Settings" },
  { id: "frameworks",   label: "Framework Settings" },
] as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        defaultValue={value}
        className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
        style={{ background: "#1a2f3c", border: "1px solid var(--border)", color: "var(--text)" }}
      />
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs" style={{ color: "var(--text)" }}>{label}</span>
      <button
        onClick={() => setOn(v => !v)}
        className="w-9 h-5 rounded-full relative transition"
        style={{ background: on ? "var(--accent)" : "var(--border)" }}
      >
        <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: on ? 18 : 2 }} />
      </button>
    </div>
  );
}

const INTEGRATIONS = [
  { name: "Qualys VM",      type: "Vulnerability Mgmt", status: "Connected" },
  { name: "Splunk SIEM",    type: "SIEM",                status: "Connected" },
  { name: "Okta",           type: "IAM",                 status: "Connected" },
  { name: "CrowdStrike EDR",type: "EDR",                 status: "Connected" },
  { name: "Wiz CSPM",       type: "CSPM",                status: "Not Connected" },
];

export default function CgSettings({ navigate }: Props) {
  const [active, setActive] = useState<(typeof SECTIONS)[number]["id"]>("org");

  return (
    <div className="p-5 max-w-screen-xl mx-auto">
      <h1 className="text-base font-bold mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>Settings</h1>
      <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>Organization, integrations, and platform configuration</p>

      <div className="flex gap-5">
        <nav className="w-52 flex-shrink-0 space-y-0.5">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium"
              style={active === s.id
                ? { background: "var(--panel)", color: "var(--accent)" }
                : { color: "var(--muted)" }}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 rounded-xl border p-5" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          {active === "org" && (
            <div className="space-y-4 max-w-md">
              <Field label="Organization Name" value="HDFC Bank Ltd." />
              <Field label="Industry" value="Banking & Financial Services" />
              <Field label="Regulatory Jurisdiction" value="India (RBI, SEBI)" />
              <Field label="Fiscal Year" value="Apr – Mar" />
            </div>
          )}

          {active === "users" && (
            <div className="space-y-2">
              {[
                { name: "Rahul Pandey", role: "CISO", email: "rahul.pandey@hdfcbank.com" },
                { name: "Anita Verma",  role: "Security Analyst", email: "anita.verma@hdfcbank.com" },
                { name: "Vikram Shah",  role: "Compliance Officer", email: "vikram.shah@hdfcbank.com" },
              ].map(u => (
                <div key={u.email} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: "#1a2f3c" }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{u.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{u.email}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(156,223,240,0.12)", color: "var(--accent)" }}>{u.role}</span>
                </div>
              ))}
              <button className="text-xs font-semibold mt-2" style={{ color: "var(--accent)" }}>+ Invite User</button>
            </div>
          )}

          {active === "integrations" && (
            <div className="space-y-2">
              {INTEGRATIONS.map(i => (
                <div key={i.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg" style={{ background: "#1a2f3c" }}>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{i.name}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{i.type}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-semibold"
                    style={{
                      background: i.status === "Connected" ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
                      color: i.status === "Connected" ? "#34D399" : "var(--muted)",
                    }}
                  >
                    {i.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {active === "notifications" && (
            <div className="max-w-md divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Toggle label="Critical vulnerability alerts" defaultOn />
              <Toggle label="Weekly executive digest" defaultOn />
              <Toggle label="Threat intelligence updates" defaultOn />
              <Toggle label="Compliance evidence expiry reminders" />
              <Toggle label="AI recommendation notifications" defaultOn />
            </div>
          )}

          {active === "risk" && (
            <div className="space-y-4 max-w-md">
              <Field label="Currency" value="INR (₹)" />
              <Field label="Risk Refresh Interval" value="Continuous (real-time)" />
              <Field label="Value-at-Risk Confidence Level" value="95%" />
              <Field label="Asset Criticality Weighting" value="Business-impact weighted" />
            </div>
          )}

          {active === "ai" && (
            <div className="max-w-md divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Toggle label="AI mitigation recommendations" defaultOn />
              <Toggle label="Predictive risk analytics" defaultOn />
              <Toggle label="Natural language query assistant" defaultOn />
              <Toggle label="Auto-run scenario simulations weekly" />
            </div>
          )}

          {active === "frameworks" && (
            <div className="max-w-md divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Toggle label="ISO/IEC 27001" defaultOn />
              <Toggle label="NIST CSF" defaultOn />
              <Toggle label="CIS Controls" defaultOn />
              <Toggle label="RBI Cyber Security Framework" defaultOn />
              <Toggle label="SEBI CSCRF" defaultOn />
              <button className="text-xs font-semibold mt-3" style={{ color: "var(--accent)" }} onClick={() => navigate("compliance")}>
                View Compliance Mapping →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
