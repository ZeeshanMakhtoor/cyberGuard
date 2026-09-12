import { useState, type FormEvent } from "react";
import { CheckCircle2, Info, AlertCircle } from "lucide-react";
import { landingSupabase } from "../lib/supabaseClient";
import { useReveal } from "../lib/useReveal";

type Status = "idle" | "submitting" | "success" | "error" | "duplicate";

export default function Waitlist() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    if (!landingSupabase) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const { error } = await landingSupabase.from("waitlist_signups").insert({ email: email.trim().toLowerCase() });

    if (!error) {
      setStatus("success");
    } else if (error.code === "23505") {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  return (
    <section id="waitlist" className="lp-section">
      <div className="lp-container">
        <div
          ref={ref}
          className={`lp-fade-up ${visible ? "lp-visible" : ""} lp-card p-10 sm:p-14 text-center max-w-2xl mx-auto`}
          style={{ background: "var(--lp-panel2)" }}
        >
          <span className="lp-eyebrow">Early Access</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">Join the waitlist</h2>
          <p className="mt-4 text-base max-w-md mx-auto" style={{ color: "var(--lp-muted)" }}>
            We're onboarding organizations in small batches. Leave your email and we'll reach out with next steps.
          </p>

          {status === "success" ? (
            <div
              className="mt-8 mx-auto max-w-sm rounded-xl px-5 py-4 text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: "var(--lp-ok-soft)", border: "1px solid rgba(21,128,61,0.25)", color: "var(--lp-ok)" }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              You're on the list! We'll be in touch soon.
            </div>
          ) : status === "duplicate" ? (
            <div
              className="mt-8 mx-auto max-w-sm rounded-xl px-5 py-4 text-sm font-semibold flex items-center justify-center gap-2"
              style={{ background: "var(--lp-accent-soft)", border: "1px solid rgba(14,122,152,0.25)", color: "var(--lp-accent)" }}
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              That email's already on the waitlist — you're set.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
                style={{ background: "#fff", color: "var(--lp-text)", border: "1px solid var(--lp-border)" }}
              />
              <button type="submit" className="lp-btn-primary" disabled={status === "submitting"}>
                {status === "submitting" ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-4 text-xs font-medium flex items-center justify-center gap-1.5" style={{ color: "var(--lp-danger)" }}>
              <AlertCircle className="w-3.5 h-3.5" />
              Something went wrong — please try again in a moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
