import { useEffect, useState } from "react";

const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#team", label: "Team" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors"
      style={{
        background: scrolled ? "rgba(10,22,32,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid var(--lp-border)" : "1px solid transparent",
      }}
    >
      <div className="lp-container flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--lp-accent)" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#06201C" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm" style={{ fontFamily: "'Outfit',sans-serif" }}>CyberGuard AI</span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-medium transition-colors" style={{ color: "var(--lp-muted)" }}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href="#waitlist" className="lp-btn-primary">Join the Waitlist</a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "var(--lp-text)" }}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden lp-container pb-5 flex flex-col gap-4" style={{ background: "rgba(10,22,32,0.97)" }}>
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium" style={{ color: "var(--lp-text)" }}>
              {l.label}
            </a>
          ))}
          <a href="#waitlist" onClick={() => setMobileOpen(false)} className="lp-btn-primary w-full">Join the Waitlist</a>
        </div>
      )}
    </header>
  );
}
