import { lazy, Suspense } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

const NetworkCanvas = lazy(() => import("../lib/NetworkCanvas"));

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" style={{ paddingTop: 150, paddingBottom: 90 }}>
      <div className="absolute inset-0" style={{ height: 560 }}>
        <Suspense fallback={null}>
          <NetworkCanvas />
        </Suspense>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(246,248,250,0.2) 0%, var(--lp-bg) 88%)" }}
        />
      </div>

      <div className="lp-container relative text-center max-w-3xl">
        <span className="lp-eyebrow">
          <ShieldCheck className="w-3.5 h-3.5" />
          Cyber Risk Quantification
        </span>
        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
          Know your cyber risk in <span style={{ color: "var(--lp-accent)" }}>rupees</span>, not{" "}
          <span style={{ color: "var(--lp-danger)" }}>red</span>,{" "}
          <span style={{ color: "var(--lp-warn)" }}>yellow</span>, or{" "}
          <span style={{ color: "var(--lp-ok)" }}>green</span>.
        </h1>
        <p className="mt-5 text-base leading-relaxed max-w-xl mx-auto" style={{ color: "var(--lp-muted)" }}>
          CyberGuard AI turns your vulnerability scanners, asset inventory, and threat intel into one
          transparent, FAIR-aligned financial risk score — with an AI analyst that can explain exactly why,
          and what to fix first.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#waitlist" className="lp-btn-primary">
            Join the Waitlist
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#features" className="lp-btn-secondary">See how it works</a>
        </div>
      </div>

      <div className="lp-container relative mt-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat value="49/100" label="Live risk score" color="var(--lp-accent)" />
          <Stat value="₹2.45 Cr" label="Modeled annual loss" color="var(--lp-warn)" />
          <Stat value="7" label="Critical vulns tracked" color="var(--lp-danger)" />
          <Stat value="84%" label="Mean compliance" color="var(--lp-ok)" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="lp-card px-4 py-5 text-center">
      <p className="text-2xl font-extrabold" style={{ fontFamily: "'Outfit',sans-serif", color }}>{value}</p>
      <p className="mt-1 text-xs" style={{ color: "var(--lp-muted)" }}>{label}</p>
    </div>
  );
}
