/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: string;
  name: string;
  marks: number | "";
  maxMarks: number;
}

export interface GradeResult {
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: "A" | "B" | "C" | "D" | "F";
  status: "Pass" | "Fail";
  gpa: number;
  feedback: string;
}

export interface HistoryRecord {
  id: string;
  studentName: string;
  rollNumber?: string;
  date: string;
  subjects: Subject[];
  result: GradeResult;
}

export interface GradeThreshold {
  grade: "A" | "B" | "C" | "D" | "F";
  minPercentage: number;
  description: string;
  color: string; // Tailwind class
  textColor: string; // Tailwind text class
  bgLightColor: string; // Tailwind bg class
}
