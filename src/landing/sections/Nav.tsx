import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

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
      className="fixed top-0 left-0 right-0 z-50 transition-shadow"
      style={{
        background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid var(--lp-border)" : "1px solid transparent",
      }}
    >
      <div className="lp-container flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--lp-accent)" }}>
            <ShieldCheck className="w-4 h-4" color="#fff" strokeWidth={2.5} />
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
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden lp-container pb-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.98)" }}>
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
