import { useRef, useState, type FormEvent } from "react";
import { askAssistant, type RiskContext } from "@/lib/aiAssistant";
import { useAssets } from "@/hooks/useAssets";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";
import { useThreats } from "@/hooks/useThreats";
import { computeRiskScore, riskLevelLabel } from "@/lib/riskScore";

interface Message {
  role: "user" | "assistant";
  text: string;
  live?: boolean;
}

const EXAMPLES = [
  "What is our highest financial cyber risk today?",
  "Which vulnerabilities contribute most to our expected losses?",
  "What happens if we enable MFA?",
  "Where should we spend our next ₹50 lakh?",
  "Generate a board risk briefing",
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi, I'm the CyberGuard AI Assistant. Ask me about your current risk posture, vulnerabilities, or what a security investment would change." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: assets } = useAssets();
  const { data: vulnerabilities } = useVulnerabilities();
  const { data: threats } = useThreats();

  function buildRiskContext(): RiskContext {
    const criticalVulns = vulnerabilities.filter(v => v.severity === "Critical").length;
    const criticalAssetRatio = assets.length ? assets.filter(a => a.criticality === "Critical").length / assets.length : 0;
    const breakdown = computeRiskScore({ activeThreats: threats.length, criticalVulns, criticalAssetRatio });
    const topVuln = [...vulnerabilities].sort((a, b) => b.cvss - a.cvss)[0];
    return {
      riskScore: breakdown.score,
      riskLevel: riskLevelLabel(breakdown.score).label,
      activeThreats: threats.length,
      criticalVulns,
      totalAssets: assets.length,
      expectedAnnualLossCr: 2.45,
      topRisk: topVuln ? `${topVuln.id} on ${topVuln.asset}` : "no open critical findings",
      topRiskImpact: topVuln?.impact ?? "—",
    };
  }

  async function send(question: string) {
    if (!question.trim() || thinking) return;
    setMessages(m => [...m, { role: "user", text: question }]);
    setInput("");
    setThinking(true);
    const { answer, live } = await askAssistant(question, buildRiskContext());
    setMessages(m => [...m, { role: "assistant", text: answer, live }]);
    setThinking(false);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: "var(--accent)", color: "var(--bg)", boxShadow: "0 4px 20px rgba(156,223,240,0.4)" }}
        title="CyberGuard AI Assistant"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 w-[22rem] max-w-[calc(100vw-2.5rem)] rounded-xl border flex flex-col overflow-hidden"
          style={{ background: "var(--panel)", borderColor: "var(--border)", height: "min(32rem, calc(100vh - 7rem))" }}
        >
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)", background: "#1a2f3c" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
            <p className="text-xs font-bold" style={{ fontFamily: "'Outfit',sans-serif", color: "var(--text)" }}>CyberGuard AI Assistant</p>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed"
                  style={m.role === "user"
                    ? { background: "var(--accent)", color: "var(--bg)" }
                    : { background: "#1a2f3c", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg text-xs" style={{ background: "#1a2f3c", color: "var(--muted)", border: "1px solid var(--border)" }}>
                  Thinking…
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="space-y-1.5 pt-1">
                {EXAMPLES.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="w-full text-left text-xs px-3 py-2 rounded-lg border"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-2.5 border-t flex gap-2" style={{ borderColor: "var(--border)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your risk posture…"
              className="flex-1 px-3 py-2 rounded-lg text-xs focus:outline-none"
              style={{ background: "#1a2f3c", border: "1px solid var(--border)", color: "var(--text)" }}
            />
            <button
              type="submit"
              disabled={thinking}
              className="px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-60"
              style={{ background: "var(--accent)", color: "var(--bg)" }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
