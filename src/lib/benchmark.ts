export interface SectorBenchmark {
  sector: string;
  medianScore: number;
  stdDev: number;
}

// Illustrative peer-sector reference points (median Overall Risk Score, 0-100 scale,
// where lower is better) with an assumed spread, used to benchmark this org against
// its industry the same way external rating services (e.g. Bitsight) show a peer median.
export const SECTOR_BENCHMARKS: Record<string, SectorBenchmark> = {
  "Banking / BFSI": { sector: "Banking / BFSI", medianScore: 68, stdDev: 12 },
};

/** Standard normal CDF via the Abramowitz-Stegun erf approximation. */
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}

export interface BenchmarkResult {
  score: number;
  medianScore: number;
  sector: string;
  /** 0-100: what percentage of peers this org scores worse than (higher score = worse risk here). */
  percentile: number;
  betterThanMedian: boolean;
}

/**
 * Compares a risk score (0-100, lower = better) against its sector peer median,
 * returning a percentile rank (what % of peers have a *worse* — i.e. higher — score).
 */
export function benchmarkRiskScore(score: number, sector: string = "Banking / BFSI"): BenchmarkResult {
  const bench = SECTOR_BENCHMARKS[sector] ?? SECTOR_BENCHMARKS["Banking / BFSI"];
  const z = (score - bench.medianScore) / bench.stdDev;
  // Since a higher score = worse risk, percentile-better-than-peers is (1 - CDF(z)) * 100.
  const percentile = Math.round((1 - normalCdf(z)) * 100);
  return {
    score,
    medianScore: bench.medianScore,
    sector: bench.sector,
    percentile: Math.max(1, Math.min(99, percentile)),
    betterThanMedian: score < bench.medianScore,
  };
}
