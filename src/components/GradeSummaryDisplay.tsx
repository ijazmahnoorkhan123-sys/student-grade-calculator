/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GradeResult } from "../types";
import { GRADE_THRESHOLDS } from "../utils";
import { Award, BookOpen, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface GradeSummaryDisplayProps {
  result: GradeResult;
  studentName?: string;
  rollNumber?: string;
  onSaveRecord: () => void;
  hasUnsavedChanges: boolean;
}

export default function GradeSummaryDisplay({
  result,
  studentName,
  rollNumber,
  onSaveRecord,
  hasUnsavedChanges,
}: GradeSummaryDisplayProps) {
  const currentThreshold =
    GRADE_THRESHOLDS.find((t) => t.grade === result.grade) || GRADE_THRESHOLDS[4];

  // SVG parameters for standard circle dial
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  // Safely bound percentage to 100 for visual circle representation
  const strokeDashoffset = circumference - (Math.min(result.percentage, 100) / 100) * circumference;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-300">
      {/* Header Accent Band */}
      <div className={`h-2 w-full ${currentThreshold.color}`} />

      {/* Main Content Area */}
      <div className="p-6 md:p-8 flex flex-col items-center text-center">
        {/* Student Metadata Header if provided */}
        {(studentName || rollNumber) && (
          <div className="mb-6 pb-4 border-b border-slate-100 w-full">
            {studentName && (
              <h3 className="text-lg font-bold text-slate-800 font-display">
                {studentName}
              </h3>
            )}
            {rollNumber && (
              <p className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-wider">
                Roll No: {rollNumber}
              </p>
            )}
          </div>
        )}

        {/* Circular Percentage Dial */}
        <div className="relative flex items-center justify-center w-40 h-40 mb-6 select-none">
          {/* Static Background Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="text-slate-100"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Animated Active Colored Ring */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              className={`transition-all duration-500 ease-out ${currentThreshold.textColor}`}
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Core Text Elements inside Dial */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold font-display text-slate-800 tracking-tight leading-none">
              {result.percentage}%
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 mt-1 uppercase tracking-widest">
              Percentage
            </span>
          </div>
        </div>

        {/* Main Status Pill & Grade Card */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mb-6">
          {/* Letter Grade Card */}
          <div className="flex-1 flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Letter Grade
            </span>
            <span className={`text-3xl font-extrabold font-display ${currentThreshold.textColor}`}>
              {result.grade}
            </span>
          </div>

          {/* GPA Card */}
          <div className="flex-1 flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Calculated GPA
            </span>
            <span className="text-3xl font-extrabold font-display text-slate-800">
              {result.gpa.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Status Pill Indicator */}
        <div className="mb-6">
          {result.status === "Pass" ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
              <CheckCircle size={16} />
              Passed Academic Standard
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-100">
              <XCircle size={16} />
              Needs Course Review (Fail)
            </span>
          )}
        </div>

        {/* Detailed Breakdown list */}
        <div className="w-full bg-slate-50/50 rounded-xl border border-slate-100 p-4 mb-6 text-left space-y-2.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Marks Obtained</span>
            <span className="font-semibold text-slate-800 font-mono">
              {result.totalObtained}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Maximum Marks</span>
            <span className="font-semibold text-slate-800 font-mono">
              {result.totalMax}
            </span>
          </div>
          <div className="h-px bg-slate-100 w-full my-1" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Grading System</span>
            <span className="text-xs font-mono font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-sm">
              Standard 100-Point
            </span>
          </div>
        </div>

        {/* Dynamic Contextual Feedback Card */}
        <div className={`w-full p-4 rounded-xl border text-left text-sm ${currentThreshold.bgLightColor} mb-6`}>
          <div className="flex items-start gap-2.5">
            <div className={`mt-0.5 ${currentThreshold.textColor}`}>
              <Award size={18} />
            </div>
            <div>
              <p className={`font-bold ${currentThreshold.textColor} text-xs uppercase tracking-wider mb-0.5`}>
                Evaluation Comment
              </p>
              <p className="text-slate-700 leading-relaxed font-sans font-medium">
                {result.feedback}
              </p>
            </div>
          </div>
        </div>

        {/* Save Report Card Button */}
        <button
          onClick={onSaveRecord}
          className={`w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-100 transition-all duration-300 ${
            hasUnsavedChanges
              ? "bg-indigo-600 hover:bg-indigo-700 text-white transform hover:-translate-y-0.5"
              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
          }`}
        >
          <BookOpen size={18} />
          {hasUnsavedChanges ? "Save to History Report" : "Saved to History"}
          {hasUnsavedChanges && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}
