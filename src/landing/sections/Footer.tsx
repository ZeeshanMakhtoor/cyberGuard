import { ShieldCheck, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: "1px solid var(--lp-border)", background: "var(--lp-panel2)" }}>
      <div className="lp-container py-14">
        <div className="grid sm:grid-cols-2 gap-10 items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--lp-accent)" }}>
                <ShieldCheck className="w-3.5 h-3.5" color="#fff" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm" style={{ fontFamily: "'Outfit',sans-serif" }}>CyberGuard AI</span>
            </div>
            <p className="mt-4 text-sm max-w-sm" style={{ color: "var(--lp-muted)" }}>
              Quantitative cyber risk, explained in financial terms — for security teams and the boards they report to.
            </p>
          </div>

          <div className="sm:justify-self-end sm:text-right">
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--lp-accent)" }}>Write Us</h3>
            <a
              href="mailto:zeeshanmakhtoor@gmail.com"
              className="mt-3 inline-flex items-center gap-1.5 sm:justify-end text-sm font-semibold"
              style={{ color: "var(--lp-text)" }}
            >
              <Mail className="w-4 h-4" style={{ color: "var(--lp-muted)" }} />
              zeeshanmakhtoor@gmail.com
            </a>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid var(--lp-border)", color: "var(--lp-muted)" }}
        >
          <p>© {year} CyberGuard AI. All rights reserved.</p>
          <p>Built for boards, security teams, and everyone in between.</p>
        </div>
      </div>
    </footer>
  );
}
