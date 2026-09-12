import { lazy, Suspense } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import DashboardMockup from "../lib/DashboardMockup";

const NetworkCanvas = lazy(() => import("../lib/NetworkCanvas"));

const STEPS = [
  {
    title: "Connect your scanners",
    desc: "Point CyberGuard AI at your existing vulnerability scanners, asset inventory, and threat feeds — no rip-and-replace.",
  },
  {
    title: "See your risk in ₹",
    desc: "Get one live, explainable risk score and an Expected Annual Loss range, refreshed as your data changes.",
  },
  {
    title: "Fix what matters first",
    desc: "An AI analyst ranks remediation by financial impact, so your team always works the highest-value item next.",
  },
];

export default function Hero() {
  return (
    <section id="top">
      <div className="lp-container pt-6">
        <div
          className="relative overflow-hidden rounded-3xl px-6 sm:px-10 pt-10 pb-0"
          style={{
            background: "radial-gradient(120% 100% at 15% 0%, #103042 0%, #0B1F2B 45%, #071620 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-60">
            <Suspense fallback={null}>
              <NetworkCanvas />
            </Suspense>
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(7,22,32,0.15) 0%, rgba(7,22,32,0.75) 75%, #071620 100%)" }}
          />

          <div className="relative text-center max-w-2xl mx-auto pb-16">
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)", color: "#9FD8E8", border: "1px solid rgba(159,216,232,0.25)" }}
            >
              Cyber Risk Quantification
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white">
              Manage cyber risk with <em style={{ fontStyle: "italic", color: "#58D6C9" }}>financial precision</em>
            </h1>
            <p className="mt-5 text-base leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.68)" }}>
              Turn vulnerability scanners, asset inventory, and threat intel into one transparent,
              FAIR-aligned risk score — in rupees, not red / yellow / green.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="#waitlist" className="lp-btn-primary" style={{ borderRadius: 999 }}>
                Join the Waitlist
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-colors"
                style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                <PlayCircle className="w-4 h-4" />
                See how it works
              </a>
            </div>
          </div>

          <div className="relative max-w-3xl mx-auto -mb-24 sm:-mb-28">
            <DashboardMockup />
          </div>
        </div>
      </div>

      <div className="lp-container pt-32 sm:pt-36 pb-10">
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div key={s.title} className="text-center sm:text-left">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 mx-auto sm:mx-0 text-sm font-bold"
                style={{ background: "var(--lp-accent-soft)", color: "var(--lp-accent)" }}
              >
                {i + 1}
              </div>
              <h3 className="text-sm font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
