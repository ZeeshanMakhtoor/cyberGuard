import { useState, type FormEvent } from "react";
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
          className={`lp-fade-up ${visible ? "lp-visible" : ""} lp-card p-10 sm:p-14 text-center max-w-2xl mx-auto relative overflow-hidden`}
        >
          <div
            className="absolute inset-0 -z-10"
            style={{ background: "radial-gradient(60% 80% at 50% 0%, rgba(88,214,201,0.12) 0%, rgba(0,0,0,0) 70%)" }}
          />
          <span className="lp-eyebrow">Early Access</span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">Join the waitlist</h2>
          <p className="mt-4 text-base max-w-md mx-auto" style={{ color: "var(--lp-muted)" }}>
            We're onboarding organizations in small batches. Leave your email and we'll reach out with next steps.
          </p>

          {status === "success" ? (
            <div
              className="mt-8 mx-auto max-w-sm rounded-xl px-5 py-4 text-sm font-semibold"
              style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "var(--lp-ok)" }}
            >
              You're on the list! We'll be in touch soon.
            </div>
          ) : status === "duplicate" ? (
            <div
              className="mt-8 mx-auto max-w-sm rounded-xl px-5 py-4 text-sm font-semibold"
              style={{ background: "rgba(127,184,232,0.12)", border: "1px solid rgba(127,184,232,0.3)", color: "var(--lp-accent2)" }}
            >
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
                style={{ background: "var(--lp-panel2)", color: "var(--lp-text)", border: "1px solid var(--lp-border)" }}
              />
              <button type="submit" className="lp-btn-primary" disabled={status === "submitting"}>
                {status === "submitting" ? "Joining..." : "Join Waitlist"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-4 text-xs font-medium" style={{ color: "var(--lp-danger)" }}>
              Something went wrong — please try again in a moment.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
