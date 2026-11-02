/**
 * classroom-grading-algorithms
 * Open-source reference math engine powering GradingPad (https://gradingpad.com)
 * License: MIT · Zero Dependencies · 100% Deterministic
 */

export function roundHalfUp(val, decimals = 1) {
  const factor = Math.pow(10, decimals);
  const num = Number(val) || 0;
  return Math.round((num + (num >= 0 ? 1e-12 : -1e-12)) * factor) / factor;
}

/**
 * Dinkelbach 0-1 Fractional Programming Solver for "Drop Lowest K Assessments"
 * Maximizes (sum_{i in S} earned_i) / (sum_{i in S} max_i) where |S| = n - k.
 * Avoids the classic greedy percentage trap (e.g. dropping 7/10 = 70% instead of 76/100 = 76%).
 */
export function solveOptimalDropLowest(items, dropCount = 1) {
  const n = items.length;
  const keep = Math.max(1, n - Math.max(0, Math.min(n - 1, dropCount)));
  let lambda = 0.8;
  let keptIndices = [];

  for (let iter = 0; iter < 25; iter++) {
    const ranked = items
      .map((it, idx) => ({ idx, surplus: it.earned - lambda * it.max }))
      .sort((a, b) => b.surplus - a.surplus);
    keptIndices = ranked.slice(0, keep).map((r) => r.idx);
    const eSum = keptIndices.reduce((s, i) => s + items[i].earned, 0);
    const mSum = keptIndices.reduce((s, i) => s + items[i].max, 0);
    const nextLambda = mSum > 0 ? eSum / mSum : 0;
    if (Math.abs(nextLambda - lambda) < 1e-11) {
      lambda = nextLambda;
      break;
    }
    lambda = nextLambda;
  }

  const keptSet = new Set(keptIndices);
  const droppedIndices = items.map((_, i) => i).filter((i) => !keptSet.has(i));
  return {
    optimalPercentage: roundHalfUp(lambda * 100, 2),
    keptIndices,
    droppedIndices,
  };
}

/**
 * Exact Monotonic Inverse Curve Cutoff Solver g^-1(T)
 * Returns raw points needed on an exam of maxPoints to achieve targetCurvedPct.
 */
export function solveInverseCurvePoints(targetCurvedPct, maxPoints, curveMode = "sqrt", extraPts = 0) {
  let rawPct = targetCurvedPct;
  if (curveMode === "sqrt") {
    rawPct = (targetCurvedPct * targetCurvedPct) / 100;
  } else if (curveMode === "flat5") {
    rawPct = Math.max(0, targetCurvedPct - 5);
  }
  return roundHalfUp(Math.max(0, (rawPct / 100) * maxPoints - extraPts), 1);
}

/**
 * Tukey 1.5*IQR + Zero-Score Absent Placeholder Outlier Trimmer for Class Curves
 */
export function trimExamOutliers(scores) {
  const nonZero = scores.filter((x) => x > 0).sort((a, b) => a - b);
  if (nonZero.length < 3) return nonZero;
  const q1 = nonZero[Math.floor((nonZero.length - 1) * 0.25)];
  const q3 = nonZero[Math.floor((nonZero.length - 1) * 0.75)];
  const fence = q1 - 1.5 * (q3 - q1);
  return nonZero.filter((x) => x >= fence);
}

/**
 * Standards-Fair 4-Level Analytic Rubric Converter
 * Solves K-12 "3 out of 4 = 75% C" grade compression.
 */
export const RUBRIC_4_LEVEL_SCALES = {
  proportional: { 4: 1.0, 3: 0.75, 2: 0.5, 1: 0.25 },
  standardsFair: { 4: 1.0, 3: 0.85, 2: 0.72, 1: 0.6 },
  minimumFloor50: { 4: 1.0, 3: 5 / 6, 2: 4 / 6, 1: 0.5 },
};
