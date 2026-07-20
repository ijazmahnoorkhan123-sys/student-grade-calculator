/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, GradeResult, GradeThreshold } from "./types";

export const GRADE_THRESHOLDS: GradeThreshold[] = [
  {
    grade: "A",
    minPercentage: 90,
    description: "Excellent academic achievement. Demonstrates outstanding comprehension.",
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgLightColor: "bg-emerald-50 border-emerald-200"
  },
  {
    grade: "B",
    minPercentage: 80,
    description: "Good performance. Demonstrates very solid comprehension of materials.",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgLightColor: "bg-blue-50 border-blue-200"
  },
  {
    grade: "C",
    minPercentage: 70,
    description: "Satisfactory achievement. Meets standard course expectations.",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgLightColor: "bg-amber-50 border-amber-200"
  },
  {
    grade: "D",
    minPercentage: 60,
    description: "Passing but needs improvement. Meets minimal course requirements.",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgLightColor: "bg-orange-50 border-orange-200"
  },
  {
    grade: "F",
    minPercentage: 0,
    description: "Failing performance. Did not meet minimum requirements.",
    color: "bg-rose-500",
    textColor: "text-rose-700",
    bgLightColor: "bg-rose-50 border-rose-200"
  }
];

export function calculateGPA(percentage: number): number {
  if (percentage >= 90) return 4.0;
  if (percentage >= 85) return 3.7;
  if (percentage >= 80) return 3.3;
  if (percentage >= 75) return 3.0;
  if (percentage >= 70) return 2.7;
  if (percentage >= 65) return 2.3;
  if (percentage >= 60) return 2.0;
  if (percentage >= 50) return 1.0;
  return 0.0;
}

export function getFeedbackForPercentage(percentage: number): string {
  if (percentage >= 95) return "Spectacular accomplishment! Exceptional mastery of the content.";
  if (percentage >= 90) return "Outstanding effort! Your dedication to learning shows excellent results.";
  if (percentage >= 80) return "Wonderful performance! Keep up the great work and target even higher.";
  if (percentage >= 70) return "Satisfactory progress. Review the weaker areas to build firmer confidence.";
  if (percentage >= 60) return "Passed, but focus is required. Dedicated study sessions will yield better marks.";
  return "Hard work and structured revision are recommended. Seek guidance and rebuild core skills.";
}

export function calculateGradeResult(subjects: Subject[]): GradeResult {
  let totalObtained = 0;
  let totalMax = 0;

  subjects.forEach((sub) => {
    const marks = typeof sub.marks === "number" ? sub.marks : 0;
    totalObtained += marks;
    totalMax += sub.maxMarks;
  });

  const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const roundedPercentage = parseFloat(percentage.toFixed(2));

  let grade: "A" | "B" | "C" | "D" | "F" = "F";
  // Find grade
  for (const threshold of GRADE_THRESHOLDS) {
    if (roundedPercentage >= threshold.minPercentage) {
      grade = threshold.grade;
      break;
    }
  }

  const status = roundedPercentage >= 60 ? "Pass" : "Fail";
  const gpa = calculateGPA(roundedPercentage);
  const feedback = getFeedbackForPercentage(roundedPercentage);

  return {
    totalObtained: parseFloat(totalObtained.toFixed(2)),
    totalMax: parseFloat(totalMax.toFixed(2)),
    percentage: roundedPercentage,
    grade,
    status,
    gpa,
    feedback,
  };
}
