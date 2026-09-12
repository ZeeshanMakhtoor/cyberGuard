export interface RiskScoreInputs {
  activeThreats: number;
  criticalVulns: number;
  criticalAssetRatio: number; // 0-1, share of assets that are Critical-tier
}

export interface RiskScoreBreakdown {
  threatFactor: number;      // 0-100
  vulnerabilityFactor: number; // 0-100
  consequenceFactor: number; // 0-100
  score: number;             // 0-100, weighted blend of the three factors above
}

/**
 * Computes an explainable overall risk score from live threat, vulnerability,
 * and asset-criticality data — inspired by SAFE Security's transparent
 * "Breach Likelihood = Threats x Vulnerabilities x Business Consequence"
 * formula. Unlike a black-box ML score, every input here is visible
 * elsewhere in the app (Threat Intelligence, Vulnerabilities, Assets), so
 * the number can always be traced back to its components.
 */
export function computeRiskScore(inputs: RiskScoreInputs): RiskScoreBreakdown {
  const threatFactor = Math.round(Math.min(1, inputs.activeThreats / 10) * 100);
  const vulnerabilityFactor = Math.round(Math.min(1, inputs.criticalVulns / 15) * 100);
  const consequenceFactor = Math.round(Math.min(1, inputs.criticalAssetRatio) * 100);

  const score = Math.round(threatFactor * 0.35 + vulnerabilityFactor * 0.4 + consequenceFactor * 0.25);

  return { threatFactor, vulnerabilityFactor, consequenceFactor, score };
}

export function riskLevelLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: "HIGH RISK", color: "#F87171" };
  if (score >= 40) return { label: "MODERATE RISK", color: "#FBBF24" };
  return { label: "LOW RISK", color: "#34D399" };
}
