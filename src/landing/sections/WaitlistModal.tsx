import { useEffect } from "react";
import { X, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { useWaitlistForm } from "../lib/useWaitlistForm";

export default function WaitlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { email, setEmail, status, handleSubmit } = useWaitlistForm();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(9,23,30,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="lp-modal-in relative w-full max-w-md rounded-3xl p-8 sm:p-10 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 15% -10%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%), linear-gradient(165deg, #0A6C86 0%, #0E85A3 30%, #21A8C4 60%, #57CFE0 100%)",
          boxShadow: "var(--lp-shadow-lg)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.18)", color: "#fff" }}
        >
          <X className="w-4 h-4" />
        </button>

        <span
          className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)" }}
        >
          Early Access
        </span>
        <h2 className="relative mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Join the waitlist</h2>
        <p className="relative mt-3 text-sm max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.88)" }}>
          We're onboarding organizations in small batches. Leave your email and we'll reach out with next steps.
        </p>

        {status === "success" ? (
          <div
            className="relative mt-6 mx-auto rounded-xl px-5 py-4 text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            You're on the list! We'll be in touch soon.
          </div>
        ) : status === "duplicate" ? (
          <div
            className="relative mt-6 mx-auto rounded-xl px-5 py-4 text-sm font-semibold flex items-center justify-center gap-2"
            style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            That email's already on the waitlist — you're set.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative mt-6 flex flex-col gap-3">
            <input
              type="email"
              required
              autoFocus
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-4 py-3 rounded-full text-sm outline-none"
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
  );
}
