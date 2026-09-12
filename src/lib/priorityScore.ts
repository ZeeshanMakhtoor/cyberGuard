const EXPLOIT_WEIGHT: Record<string, number> = { Active: 1, Public: 0.75, PoC: 0.5, None: 0.25 };
const CRITICALITY_WEIGHT: Record<string, number> = { Critical: 1, High: 0.75, Medium: 0.5, Low: 0.25 };

export interface PriorityInputs {
  cvss: number;
  exploit: string;
  assetCriticality: string;
}

export interface PriorityBreakdown {
  score: number; // 0-100, higher = fix first
  exploitWeight: number;
  criticalityWeight: number;
  cvssNorm: number;
}

/**
 * Ranks "which vulnerability to fix first" the way Balbix does — by
 * exploitability x asset criticality x severity, not raw financial impact
 * or CVSS alone. A CVSS-9.8 bug on a Low-criticality, non-exploited asset
 * is genuinely lower priority than a CVSS-7.5 bug being actively exploited
 * on a Critical asset, and this formula reflects that.
 */
export function computePriorityScore(inputs: PriorityInputs): PriorityBreakdown {
  const exploitWeight = EXPLOIT_WEIGHT[inputs.exploit] ?? 0.25;
  const criticalityWeight = CRITICALITY_WEIGHT[inputs.assetCriticality] ?? 0.5;
  const cvssNorm = Math.max(0, Math.min(1, inputs.cvss / 10));
  const score = Math.round((exploitWeight * 0.4 + criticalityWeight * 0.35 + cvssNorm * 0.25) * 100);
  return { score, exploitWeight, criticalityWeight, cvssNorm };
}
