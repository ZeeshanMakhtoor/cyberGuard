export interface LossRange {
  min: number;
  likely: number;
  max: number;
}

/**
 * Derives a FAIR-style min/most-likely/max loss range around a single point
 * estimate. Real FAIR analysis never states a bare number — it states a
 * range with a confidence interval, because a single figure implies false
 * precision about an inherently uncertain future loss.
 */
export function computeLossRange(pointValueCr: number, spreadPct: number = 0.3): LossRange {
  return {
    min: Math.round(pointValueCr * (1 - spreadPct) * 100) / 100,
    likely: pointValueCr,
    max: Math.round(pointValueCr * (1 + spreadPct) * 100) / 100,
  };
}

export function formatCr(valueCr: number): string {
  return `₹${valueCr.toFixed(2)} Cr`;
}

export function formatLossRange(range: LossRange): string {
  return `${formatCr(range.min)} – ${formatCr(range.likely)} – ${formatCr(range.max)}`;
}
