export interface Grade {
  letter: string;
  color: string;
}

/**
 * SecurityScorecard-style A-F letter grade for quick board/exec scanning —
 * the same compliance percentages already computed elsewhere, just
 * translated into a glanceable letter instead of a raw number.
 */
export function gradeFromPercent(pct: number): Grade {
  if (pct >= 90) return { letter: "A", color: "#34D399" };
  if (pct >= 80) return { letter: "B", color: "#60B8CF" };
  if (pct >= 70) return { letter: "C", color: "#FBBF24" };
  if (pct >= 60) return { letter: "D", color: "#FB923C" };
  return { letter: "F", color: "#F87171" };
}

export function overallGrade(frameworks: { compliance: number }[]): Grade & { avgPct: number } {
  const avgPct = frameworks.length
    ? Math.round(frameworks.reduce((sum, f) => sum + f.compliance, 0) / frameworks.length)
    : 0;
  return { avgPct, ...gradeFromPercent(avgPct) };
}
