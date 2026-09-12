import { Target, Compass } from "lucide-react";
import { useReveal } from "../lib/useReveal";

export default function About() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="about" className="lp-section">
      <div className="lp-container grid lg:grid-cols-2 gap-14 items-center">
        <div ref={ref} className={`lp-fade-up ${visible ? "lp-visible" : ""}`}>
          <span className="lp-eyebrow">Who We Are</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            A small team obsessed with making cyber risk legible.
          </h2>
          <p className="mt-5 text-base leading-relaxed" style={{ color: "var(--lp-muted)" }}>
            We're builders and security practitioners who got tired of watching CISOs walk into board
            meetings with a spreadsheet and a color-coded slide, and walk out without a budget. CyberGuard
            AI exists to close that gap — one transparent, explainable number that both a security engineer
            and a CFO can agree on.
          </p>
          <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--lp-muted)" }}>
            We're inspired by the best ideas in the category — FAIR's rigor, SecurityScorecard's clarity,
            RiskLens' confidence ranges, Kovrr's loss curves — combined into a single, live platform instead
            of five disconnected tools.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <MissionCard
            icon={Target}
            color="var(--lp-accent)"
            title="Our Mission"
            desc="Make quantitative, financially-grounded cyber risk accessible to every organization — not just the ones that can afford a dedicated FAIR analyst."
          />
          <MissionCard
            icon={Compass}
            color="var(--lp-ok)"
            title="Our Approach"
            desc="Live data, transparent formulas, and an AI assistant that shows its work — every number on screen traces back to a scanner, a feed, or an assessment you can inspect."
          />
        </div>
      </div>
    </section>
  );
}

function MissionCard({ icon: IconCmp, color, title, desc }: { icon: typeof Target; color: string; title: string; desc: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`lp-card p-6 lp-fade-up ${visible ? "lp-visible" : ""}`}>
      <IconCmp className="w-5 h-5" style={{ color }} strokeWidth={2} />
      <h3 className="mt-3 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--lp-text)" }}>{title}</h3>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{desc}</p>
    </div>
  );
}
