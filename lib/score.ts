import type { SecurityFinding } from "@/types/scan";
import { scoreToGrade } from "@/lib/utils";

export function calculateSecurityScore(findings: SecurityFinding[]) {
  const weightedFindings = findings.filter((finding) => finding.weight > 0);

  const totalWeight = weightedFindings.reduce((sum, finding) => sum + finding.weight, 0);
  const earnedWeight = weightedFindings
    .filter((finding) => finding.passed)
    .reduce((sum, finding) => sum + finding.weight, 0);

  const score = totalWeight === 0 ? 0 : Math.round((earnedWeight / totalWeight) * 100);
  return {
    score,
    grade: scoreToGrade(score)
  };
}
