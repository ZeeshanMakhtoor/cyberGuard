import { ArrowRight, PlayCircle } from "lucide-react";
import Nav from "./Nav";
import { useReveal } from "../lib/useReveal";
import dashboardScreenshot from "../assets/dashboard-screenshot.jpg";

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
  const { ref: stepsRef, visible: stepsVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="top">
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 15% -10%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%), linear-gradient(165deg, #0A6C86 0%, #0E85A3 30%, #21A8C4 60%, #57CFE0 100%)",
        }}
      >
        <div className="lp-hero-in" style={{ animationDelay: "0ms" }}>
          <Nav variant="light" />
        </div>

        <div className="relative text-center max-w-2xl mx-auto px-4 pt-14 sm:pt-16 pb-16">
          <span
            className="lp-hero-in inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", animationDelay: "80ms" }}
          >
            Cyber Risk Quantification
          </span>
          <h1
            className="lp-hero-in mt-6 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white"
            style={{ animationDelay: "160ms" }}
          >
            Manage cyber risk with <em style={{ fontStyle: "italic" }}>financial precision</em>
          </h1>
          <p
            className="lp-hero-in mt-5 text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.88)", animationDelay: "240ms" }}
          >
            Turn vulnerability scanners, asset inventory, and threat intel into one transparent,
            FAIR-aligned risk score — in rupees, not red / yellow / green.
          </p>
          <div className="lp-hero-in mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "320ms" }}>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5"
              style={{ background: "#fff", color: "#0A6C86" }}
            >
              Join the Waitlist
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-colors"
              style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.5)" }}
            >
              <PlayCircle className="w-4 h-4" />
              See how it works
            </a>
          </div>
        </div>

        <div className="lp-container relative">
          <div className="lp-hero-in relative max-w-3xl mx-auto -mb-24 sm:-mb-28" style={{ animationDelay: "420ms" }}>
            <img
              src={dashboardScreenshot}
              alt="CyberGuard AI dashboard showing live risk score, expected annual loss, and risk breakdown"
              className="w-full rounded-2xl shadow-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.4)", display: "block" }}
            />
          </div>
        </div>
      </div>

      <div className="lp-container pt-32 sm:pt-36 pb-10">
        <div ref={stepsRef} className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className={`lp-fade-up ${stepsVisible ? "lp-visible" : ""} text-center sm:text-left`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
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
