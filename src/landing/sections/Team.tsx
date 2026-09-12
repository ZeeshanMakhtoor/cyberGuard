import { useReveal } from "../lib/useReveal";

const TEAM = [
  { name: "Himanshu Singh", role: "Team Leader", initials: "HS", color: "var(--lp-accent)", bg: "var(--lp-accent-soft)" },
  { name: "Zeeshan Makhtoor", role: "Builder", initials: "ZM", color: "var(--lp-ok)", bg: "var(--lp-ok-soft)" },
];

export default function Team() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="team" className="lp-section">
      <div className="lp-container">
        <div ref={ref} className={`lp-fade-up ${visible ? "lp-visible" : ""} max-w-2xl mx-auto text-center`}>
          <span className="lp-eyebrow">The Team</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">Who's building this</h2>
          <p className="mt-4 text-base" style={{ color: "var(--lp-muted)" }}>
            A small, hands-on team building CyberGuard AI end to end.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {TEAM.map((m, i) => (
            <TeamCard key={m.name} {...m} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ name, role, initials, color, bg, delay }: { name: string; role: string; initials: string; color: string; bg: string; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`lp-card p-7 w-full sm:w-72 text-center lp-fade-up ${visible ? "lp-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-lg font-extrabold"
        style={{ background: bg, color, fontFamily: "'Outfit',sans-serif" }}
      >
        {initials}
      </div>
      <p className="mt-4 text-base font-bold">{name}</p>
      <p className="text-xs mt-1" style={{ color: "var(--lp-muted)" }}>{role}</p>
    </div>
  );
}
