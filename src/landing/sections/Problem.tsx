import { AlertTriangle, Puzzle, Languages, ShieldOff } from "lucide-react";
import { useReveal } from "../lib/useReveal";

const PROBLEMS = [
  {
    icon: AlertTriangle,
    color: "var(--lp-danger)",
    bg: "var(--lp-danger-soft)",
    title: "Scores nobody can act on",
    desc: "Red/Yellow/Green dashboards and 0–100 \"security scores\" look precise but explain nothing — boards can't approve a budget against a color.",
  },
  {
    icon: Puzzle,
    color: "var(--lp-warn)",
    bg: "var(--lp-warn-soft)",
    title: "Risk lives in five different tools",
    desc: "Vulnerability scanners, asset inventories, threat feeds, and compliance spreadsheets never talk to each other, so nobody sees the full picture.",
  },
  {
    icon: Languages,
    color: "var(--lp-accent)",
    bg: "var(--lp-accent-soft)",
    title: "No financial language",
    desc: "Security teams talk CVSS and CVEs; the board thinks in rupees and quarters. Without a translation layer, budget conversations stall.",
  },
  {
    icon: ShieldOff,
    color: "var(--lp-ok)",
    bg: "var(--lp-ok-soft)",
    title: "Compliance ≠ security",
    desc: "Being compliant with a framework doesn't mean you're actually less likely to get breached — but most reporting treats them as the same thing.",
  },
];

export default function Problem() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="problem" className="lp-section">
      <div className="lp-container">
        <div ref={ref} className={`lp-fade-up ${visible ? "lp-visible" : ""} max-w-2xl`}>
          <span className="lp-eyebrow">The Problem</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cyber risk reporting is broken.
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--lp-muted)" }}>
            Most organizations can tell you how many vulnerabilities they have. Almost none can tell you
            what that actually means in money, or what to do about it first.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {PROBLEMS.map((p, i) => (
            <ProblemCard key={p.title} {...p} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ icon: IconCmp, color, bg, title, desc, delay }: {
  icon: typeof AlertTriangle; color: string; bg: string; title: string; desc: string; delay: number;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`lp-card p-6 lp-fade-up ${visible ? "lp-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: bg }}>
        <IconCmp className="w-5 h-5" style={{ color }} strokeWidth={2} />
      </div>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{desc}</p>
    </div>
  );
}
