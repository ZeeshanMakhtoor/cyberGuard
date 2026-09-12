import { supabase } from "@/lib/supabaseClient";

/**
 * Canned answers for the example questions in the requirements doc, used
 * whenever the ai-assistant Edge Function isn't deployed (or has no
 * ANTHROPIC_API_KEY secret set yet) — so the panel always demos something
 * sensible instead of failing silently.
 */
const CANNED: { match: RegExp; answer: string }[] = [
  {
    match: /highest.*(financial|cyber).*risk|biggest risk/i,
    answer:
      "Your highest financial cyber risk today is ransomware propagation through the corporate network, carrying an estimated exposure of ₹1.2 Cr — driven by flat network segmentation that would let a single compromised endpoint reach core banking systems. RCE via CVE-2024-21413 on the mail server (₹42L) is the next largest single item.",
  },
  {
    match: /vulnerabilit(y|ies).*(contribute|expected loss|most)/i,
    answer:
      "Unpatched CVEs account for the largest share of expected loss (38%, ≈₹94L), followed by weak access controls (27%, ≈₹67L) and phishing exposure (21%, ≈₹52L). Patching the ~86 open critical vulnerabilities would address the single biggest contributor.",
  },
  {
    match: /mfa|multi-?factor/i,
    answer:
      "Enabling MFA for all privileged accounts is projected to reduce the enterprise risk score from 72 to 61 and cut Expected Annual Loss from ₹2.45 Cr to ₹1.97 Cr — roughly a 20% EAL reduction — for an estimated investment of ₹85K, giving one of the highest ROSI figures available right now.",
  },
  {
    match: /where should we spend|next ₹?50\s*l|invest/i,
    answer:
      "For the next ₹50L, the highest risk-reduction-per-rupee mix is: Vulnerability Remediation (₹25L, 24% reduction) and MFA (₹15L, 18% reduction), leaving ₹10L toward Monitoring (8% reduction) — together covering the steep part of the risk-reduction curve before it flattens. See the Investment Optimization page for the live calculation at your actual budget.",
  },
];

const DEFAULT_ANSWER =
  "I can currently answer questions about your top financial risks, which vulnerabilities drive the most expected loss, the effect of enabling MFA, and how to prioritize your next security spend. Try one of those, or check the What-if Scenarios and Investment Optimization pages for deeper analysis.";

const BOARD_BRIEFING_MATCH = /board (briefing|report|summary|update)|generate.*board/i;

export interface RiskContext {
  riskScore: number;
  riskLevel: string;
  activeThreats: number;
  criticalVulns: number;
  totalAssets: number;
  expectedAnnualLossCr: number;
  topRisk: string;
  topRiskImpact: string;
}

function boardBriefing(ctx: RiskContext): string {
  return (
    `**Board Risk Briefing** — Overall Risk Score is ${ctx.riskScore}/100 (${ctx.riskLevel}), driven by ${ctx.activeThreats} active threats, ` +
    `${ctx.criticalVulns} unpatched critical vulnerabilities, and a ${ctx.totalAssets}-asset estate with meaningful Critical-tier exposure. ` +
    `Expected Annual Loss stands at ₹${ctx.expectedAnnualLossCr.toFixed(2)} Cr. The single largest contributor is "${ctx.topRisk}" ` +
    `(${ctx.topRiskImpact} potential impact). Recommendation: prioritize the pending AI recommendations targeting critical vulnerabilities and MFA ` +
    `enforcement — see AI Recommendations for the cost-ranked action list and Export Roadmap for a board-ready record.`
  );
}

function cannedAnswer(question: string, context?: RiskContext): string {
  if (context && BOARD_BRIEFING_MATCH.test(question)) return boardBriefing(context);
  const hit = CANNED.find(c => c.match.test(question));
  return hit ? hit.answer : DEFAULT_ANSWER;
}

export async function askAssistant(question: string, context?: RiskContext): Promise<{ answer: string; live: boolean }> {
  if (!supabase) {
    return { answer: cannedAnswer(question, context), live: false };
  }
  try {
    const { data, error } = await supabase.functions.invoke<{ answer: string }>("ai-assistant", {
      body: { question },
    });
    if (error || !data?.answer) throw error ?? new Error("empty response");
    return { answer: data.answer, live: true };
  } catch {
    // Edge Function not deployed yet, or ANTHROPIC_API_KEY isn't set — fall
    // back to canned answers rather than showing an error in the panel.
    return { answer: cannedAnswer(question, context), live: false };
  }
}
