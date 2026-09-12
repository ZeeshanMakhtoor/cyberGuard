import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const EAL_TREND = [
  { m: "Mar", eal: 3.1 }, { m: "Apr", eal: 3.4 }, { m: "May", eal: 3.0 },
  { m: "Jun", eal: 2.7 }, { m: "Jul", eal: 2.9 }, { m: "Aug", eal: 2.45 },
];

export default function Hero() {
  return (
    <section id="top" className="lp-section relative overflow-hidden" style={{ paddingTop: 140 }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(88,214,201,0.14) 0%, rgba(10,22,32,0) 70%), radial-gradient(40% 40% at 85% 20%, rgba(127,184,232,0.12) 0%, rgba(10,22,32,0) 70%)",
        }}
      />
      <div className="lp-container grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="lp-eyebrow">Cyber Risk Quantification, for the Boardroom</span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Know your cyber risk <span style={{ color: "var(--lp-accent)" }}>in rupees</span>, not red / yellow / green.
          </h1>
          <p className="mt-5 text-base leading-relaxed max-w-xl" style={{ color: "var(--lp-muted)" }}>
            CyberGuard AI turns your vulnerability scanners, asset inventory, and threat intel into one
            transparent, FAIR-aligned financial risk score — with an AI analyst that can explain exactly why,
            and what to fix first.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#waitlist" className="lp-btn-primary">
              Join the Waitlist
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <a href="#features" className="lp-btn-secondary">See how it works</a>
          </div>
          <div className="mt-10 flex items-center gap-6 flex-wrap">
            <Stat value="49/100" label="Live risk score, explainable" />
            <Stat value="₹2.45 Cr" label="Modeled expected annual loss" />
            <Stat value="12+" label="Modules, one data model" />
          </div>
        </div>

        <div className="lp-card p-5 shadow-2xl" style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--lp-muted)" }}>Overall Risk Score</p>
              <p className="text-3xl font-extrabold mt-1" style={{ fontFamily: "'Outfit',sans-serif" }}>
                49 <span className="text-base font-medium" style={{ color: "var(--lp-muted)" }}>/ 100</span>
              </p>
            </div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(251,191,36,0.15)", color: "var(--lp-warn)" }}
            >
              MODERATE RISK
            </span>
          </div>
          <div className="h-40 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EAL_TREND} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--lp-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="var(--lp-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "var(--lp-panel2)", border: "1px solid var(--lp-border)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "var(--lp-muted)" }}
                  formatter={(v => [`₹${v} Cr`, "Expected Annual Loss"]) as (value: unknown) => [string, string]}
                />
                <Area type="monotone" dataKey="eal" stroke="var(--lp-accent)" strokeWidth={2} fill="url(#heroGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--lp-border)" }}>
            {[
              { label: "Assets", value: "8" },
              { label: "Critical Vulns", value: "7" },
              { label: "AI Recs", value: "4" },
            ].map(k => (
              <div key={k.label}>
                <p className="text-lg font-bold" style={{ fontFamily: "'Outfit',sans-serif" }}>{k.value}</p>
                <p className="text-xs" style={{ color: "var(--lp-muted)" }}>{k.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-lg font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--lp-accent)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--lp-muted)" }}>{label}</p>
    </div>
  );
}
