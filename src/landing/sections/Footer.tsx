export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ borderTop: "1px solid var(--lp-border)", background: "var(--lp-bg2)" }}>
      <div className="lp-container py-14">
        <div className="grid sm:grid-cols-2 gap-10 items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--lp-accent)" }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#06201C" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
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
              className="mt-3 inline-block text-sm font-semibold"
              style={{ color: "var(--lp-text)" }}
            >
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
