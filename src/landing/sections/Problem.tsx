import { useReveal } from "../lib/useReveal";

const PROBLEMS = [
  {
    title: "Scores nobody can act on",
    desc: "Red/Yellow/Green dashboards and 0–100 \"security scores\" look precise but explain nothing — boards can't approve a budget against a color.",
  },
  {
    title: "Risk lives in five different tools",
    desc: "Vulnerability scanners, asset inventories, threat feeds, and compliance spreadsheets never talk to each other, so nobody sees the full picture.",
  },
  {
    title: "No financial language",
    desc: "Security teams talk CVSS and CVEs; the board thinks in rupees and quarters. Without a translation layer, budget conversations stall.",
  },
  {
    title: "Compliance ≠ security",
    desc: "Being compliant with a framework doesn't mean you're actually less likely to get breached — but most reporting treats them as the same thing.",
  },
];

export default function Problem() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="problem" className="lp-section" style={{ background: "var(--lp-bg2)" }}>
      <div className="lp-container">
        <div ref={ref} className={`lp-fade-up ${visible ? "lp-visible" : ""} max-w-2xl`}>
          <span className="lp-eyebrow">The Problem</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cyber risk reporting is broken.
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--lp-muted)" }}>
            Most organizations can tell you how many vulnerabilities they have. Almost none can tell
            you what that actually means in money, or what to do about it first.
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

function ProblemCard({ title, desc, delay }: { title: string; desc: string; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`lp-card p-6 lp-fade-up ${visible ? "lp-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
        style={{ background: "rgba(248,113,113,0.12)" }}
      >
        <svg className="w-4.5 h-4.5" style={{ color: "var(--lp-danger)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-base font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--lp-muted)" }}>{desc}</p>
    </div>
  );
}
