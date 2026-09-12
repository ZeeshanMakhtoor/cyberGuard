import { ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="lp-container pb-6">
      <div
        className="relative overflow-hidden rounded-3xl px-6 sm:px-10 pt-14"
        style={{ background: "#071620" }}
      >
        <div className="relative grid sm:grid-cols-2 gap-8 items-start pb-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--lp-accent)" }}>
                <ShieldCheck className="w-3.5 h-3.5" color="#fff" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm text-white" style={{ fontFamily: "'Outfit',sans-serif" }}>CyberGuard AI</span>
            </div>
            <p className="mt-4 text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              Quantitative cyber risk, explained in financial terms — for security teams and the boards they report to.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              <p>© {year} CyberGuard AI. All rights reserved.</p>
            </div>
          </div>

          <div className="sm:justify-self-end">
            <div
              className="rounded-2xl px-6 py-5 flex items-center gap-4 flex-wrap"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: "#58D6C9" }}>Write Us</h3>
                <p className="mt-1 text-sm font-semibold text-white">zeeshanmakhtoor@gmail.com</p>
              </div>
              <a
                href="mailto:zeeshanmakhtoor@gmail.com"
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full flex-shrink-0"
                style={{ background: "var(--lp-accent)", color: "#fff" }}
              >
                <Mail className="w-3.5 h-3.5" />
                Email us
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div
          className="relative select-none text-center font-extrabold leading-none overflow-hidden"
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: "clamp(3.5rem, 16vw, 11rem)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.03em",
            marginBottom: "-0.12em",
          }}
        >
          CyberGuard
        </div>
      </div>
    </footer>
  );
}
