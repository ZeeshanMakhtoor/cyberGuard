import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const { error } = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (mode === "signup") {
      setInfo("Account created. If email confirmation is enabled on this project, check your inbox before signing in.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)", boxShadow: "0 0 12px rgba(156,223,240,0.35)" }}>
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="#10202C" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-sm leading-tight" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--accent)" }}>CyberGuard AI</div>
            <div className="text-xs leading-tight" style={{ color: "var(--muted)" }}>Risk Intelligence Platform</div>
          </div>
        </div>

        <div className="rounded-xl border p-6" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
          <h1 className="text-sm font-bold mb-1" style={{ fontFamily: "'Outfit',sans-serif" }}>
            {mode === "signin" ? "Sign in" : "Create an account"}
          </h1>
          <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>
            {mode === "signin" ? "Access your organization's risk dashboard." : "Set up a demo account for this workspace."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                style={{ background: "#1a2f3c", border: "1px solid var(--border)", color: "var(--text)" }}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1" style={{ color: "var(--muted)" }}>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                style={{ background: "#1a2f3c", border: "1px solid var(--border)", color: "var(--text)" }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171" }}>{error}</p>
            )}
            {info && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399" }}>{info}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full text-xs px-3 py-2.5 rounded-lg font-semibold disabled:opacity-60"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              {submitting ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            className="text-xs mt-4 w-full text-center"
            style={{ color: "var(--muted)" }}
            onClick={() => { setMode(m => m === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
