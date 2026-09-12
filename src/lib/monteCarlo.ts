export interface ExceedancePoint {
  lossCr: number;
  probability: number;
}

export interface LossExceedanceResult {
  points: ExceedancePoint[];
  p10: number;
  p50: number;
  p90: number;
  mean: number;
}

function randomNormal(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Kovrr-style Monte Carlo run: samples a log-normal loss distribution around
 * the point-estimate EAL (sigma calibrated so p90 lands ~1.7-1.9x the point
 * estimate, a realistic spread for cyber loss modeling) and derives a Loss
 * Exceedance Curve — P(loss > X) for a range of X — from the trials.
 */
export function simulateLossExceedance(pointEstimateCr: number, trials = 2000): LossExceedanceResult {
  const sigma = 0.45;
  const safeEstimate = Math.max(pointEstimateCr, 0.01);
  const mu = Math.log(safeEstimate) - (sigma * sigma) / 2;

  const losses: number[] = new Array(trials);
  for (let i = 0; i < trials; i++) {
    losses[i] = Math.exp(mu + sigma * randomNormal());
  }
  losses.sort((a, b) => a - b);

  function percentile(p: number): number {
    const idx = Math.min(losses.length - 1, Math.max(0, Math.floor(p * losses.length)));
    return losses[idx];
  }

  const maxLoss = losses[losses.length - 1];
  const steps = 20;
  const points: ExceedancePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const threshold = (maxLoss * i) / steps;
    const exceedCount = losses.filter(l => l > threshold).length;
    points.push({ lossCr: threshold, probability: exceedCount / losses.length });
  }

  const mean = losses.reduce((sum, l) => sum + l, 0) / losses.length;

  return { points, p10: percentile(0.1), p50: percentile(0.5), p90: percentile(0.9), mean };
}
