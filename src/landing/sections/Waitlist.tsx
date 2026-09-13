import { CheckCircle2, Info, AlertCircle } from "lucide-react";
import { useReveal } from "../lib/useReveal";
import { useWaitlistForm } from "../lib/useWaitlistForm";

export default function Waitlist() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const { email, setEmail, status, handleSubmit } = useWaitlistForm();

  return (
    <section id="waitlist" className="lp-section">
      <div className="lp-container">
        <div
          ref={ref}
          className={`lp-fade-up ${visible ? "lp-visible" : ""} relative overflow-hidden rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto`}
          style={{
            background:
              "radial-gradient(120% 90% at 15% -10%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%), linear-gradient(165deg, #0A6C86 0%, #0E85A3 30%, #21A8C4 60%, #57CFE0 100%)",
          }}
        >
          <span
            className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
          >
            Early Access
          </span>
          <h2 className="relative mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Join the waitlist</h2>
          <p className="relative mt-4 text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.88)" }}>
            We're onboarding organizations in small batches. Leave your email and we'll reach out with next steps.
          </p>

          {status === "success" ? (
            <div
              className="relative mt-8 mx-auto max-w-sm rounded-xl px-5 py-4 text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              You're on the list! We'll be in touch soon.
            </div>
          ) : status === "duplicate" ? (
            <div
              className="relative mt-8 mx-auto max-w-sm rounded-xl px-5 py-4 text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              That email's already on the waitlist — you're set.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full text-sm outline-none"
                style={{ background: "#fff", color: "var(--lp-text)", border: "1px solid rgba(255,255,255,0.5)" }}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 text-sm font-bold px-6 py-3 rounded-full transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                style={{ background: "#fff", color: "#0A6C86" }}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="relative mt-4 text-xs font-medium flex items-center justify-center gap-1.5" style={{ color: "#fff" }}>
              <AlertCircle className="w-3.5 h-3.5" />
              Something went wrong — please try again in a moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
