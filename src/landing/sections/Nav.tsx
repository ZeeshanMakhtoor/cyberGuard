import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

const DASHBOARD_URL = "https://cyberguard-ai-triphile.vercel.app";

const LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#team", label: "Team" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 pt-4 px-4 sm:px-6">
      <header
        className="lp-container flex items-center justify-between h-14 px-3 sm:px-5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", boxShadow: "var(--lp-shadow-md)" }}
      >
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
          <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-primary" style={{ borderRadius: 999 }}>
            Start for Free
          </a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "var(--lp-text)" }}
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {mobileOpen && (
        <div
          className="md:hidden lp-container mt-2 rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: "#fff", boxShadow: "var(--lp-shadow-md)" }}
        >
          {LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-sm font-medium" style={{ color: "var(--lp-text)" }}>
              {l.label}
            </a>
          ))}
          <a
            href={DASHBOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="lp-btn-primary w-full"
            style={{ borderRadius: 999 }}
          >
            Start for Free
          </a>
        </div>
      )}
    </div>
  );
}
