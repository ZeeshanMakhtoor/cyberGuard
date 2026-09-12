const CVE_CATEGORIES: { exploitability: string; recommended: string; severityWeights: Array<["Critical" | "High" | "Medium", number]> }[] = [
  { exploitability: "Active",  recommended: "Patch immediately — actively exploited in the wild", severityWeights: [["Critical", 3], ["High", 1]] },
  { exploitability: "Public",  recommended: "Patch within 7 days — public exploit code available", severityWeights: [["Critical", 1], ["High", 2], ["Medium", 1]] },
  { exploitability: "PoC",     recommended: "Patch within 30 days — proof-of-concept exists", severityWeights: [["High", 2], ["Medium", 1]] },
  { exploitability: "None",    recommended: "Patch on next maintenance window", severityWeights: [["Medium", 2]] },
];

function weightedPick<T>(weighted: [T, number][]): T {
  const total = weighted.reduce((a, [, w]) => a + w, 0);
  let r = Math.random() * total;
  for (const [item, w] of weighted) {
    if (r < w) return item;
    r -= w;
  }
  return weighted[0][0];
}

export interface SyntheticVulnerability {
  cve: string;
  severity: "Critical" | "High" | "Medium";
  cvss: number;
  exploitability: string;
  businessCriticality: "Critical" | "High" | "Medium" | "Low";
  estimatedFinancialImpactInr: number;
  recommendedAction: string;
}

/** Generates one plausible "newly discovered" vulnerability for a Run Scan. */
export function generateSyntheticVulnerability(): SyntheticVulnerability {
  const category = CVE_CATEGORIES[Math.floor(Math.random() * CVE_CATEGORIES.length)];
  const severity = weightedPick(category.severityWeights);
  const cvss = severity === "Critical"
    ? Math.round((9 + Math.random()) * 10) / 10
    : severity === "High"
      ? Math.round((7 + Math.random() * 1.9) * 10) / 10
      : Math.round((4 + Math.random() * 2.9) * 10) / 10;

  const year = 2024 + Math.floor(Math.random() * 3);
  const num = 10000 + Math.floor(Math.random() * 89999);

  const businessCriticalityWeights: ["Critical" | "High" | "Medium" | "Low", number][] =
    severity === "Critical" ? [["Critical", 2], ["High", 2], ["Medium", 1]]
    : severity === "High" ? [["High", 2], ["Medium", 2], ["Low", 1]]
    : [["Medium", 2], ["Low", 2]];
  const businessCriticality = weightedPick(businessCriticalityWeights);

  const baseImpact = severity === "Critical" ? 3_000_000 : severity === "High" ? 1_200_000 : 400_000;
  const estimatedFinancialImpactInr = Math.round((baseImpact + Math.random() * baseImpact) / 10_000) * 10_000;

  return {
    cve: `CVE-${year}-${num}`,
    severity,
    cvss,
    exploitability: category.exploitability,
    businessCriticality,
    estimatedFinancialImpactInr,
    recommendedAction: category.recommended,
  };
}
