/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject } from "../types";
import { BarChart3, TrendingUp, AlertCircle } from "lucide-react";

interface SubjectChartsProps {
  subjects: Subject[];
}

export default function SubjectCharts({ subjects }: SubjectChartsProps) {
  // Compute individual statistics
  const validSubjects = subjects.filter((s) => s.marks !== "");
  const subjectPercentages = validSubjects.map((s) => {
    const marks = typeof s.marks === "number" ? s.marks : 0;
    const percentage = s.maxMarks > 0 ? (marks / s.maxMarks) * 100 : 0;
    return {
      ...s,
      percentage: parseFloat(percentage.toFixed(1)),
    };
  });

  const averagePercentage =
    subjectPercentages.length > 0
      ? parseFloat(
          (
            subjectPercentages.reduce((acc, curr) => acc + curr.percentage, 0) /
            subjectPercentages.length
          ).toFixed(1)
        )
      : 0;

  // Find highest and lowest subjects
  let highestSubject = { name: "N/A", percentage: 0 };
  let lowestSubject = { name: "N/A", percentage: 100 };

  if (subjectPercentages.length > 0) {
    subjectPercentages.forEach((s) => {
      if (s.percentage > highestSubject.percentage) {
        highestSubject = { name: s.name, percentage: s.percentage };
      }
      if (s.percentage < lowestSubject.percentage) {
        lowestSubject = { name: s.name, percentage: s.percentage };
      }
    });
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 font-display">Subject Breakdown</h3>
            <p className="text-xs text-slate-500">Visualizing percentage scores by subject</p>
          </div>
        </div>
        {subjectPercentages.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600">
            <TrendingUp size={14} className="text-emerald-500" />
            Avg: {averagePercentage}%
          </div>
        )}
      </div>

      {subjectPercentages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
          <AlertCircle size={32} className="mb-2 text-slate-300 animate-pulse" />
          <p className="text-sm font-medium">No valid marks entered yet.</p>
          <p className="text-xs text-slate-400">Fill in marks to see visual chart analysis.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Main Visual Bars */}
          <div className="space-y-4">
            {subjectPercentages.map((sub, idx) => {
              // Decide bar color based on percentage
              let barColor = "bg-rose-500";
              let textColor = "text-rose-700";
              let bgProgress = "bg-rose-50";

              if (sub.percentage >= 90) {
                barColor = "bg-emerald-500";
                textColor = "text-emerald-700";
                bgProgress = "bg-emerald-50";
              } else if (sub.percentage >= 80) {
                barColor = "bg-blue-500";
                textColor = "text-blue-700";
                bgProgress = "bg-blue-50";
              } else if (sub.percentage >= 70) {
                barColor = "bg-amber-500";
                textColor = "text-amber-700";
                bgProgress = "bg-amber-50";
              } else if (sub.percentage >= 60) {
                barColor = "bg-orange-500";
                textColor = "text-orange-700";
                bgProgress = "bg-orange-50";
              }

              return (
                <div key={sub.id || idx} className="space-y-1.5">
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="font-semibold text-slate-700 truncate max-w-[70%]">
                      {sub.name || `Subject ${idx + 1}`}
                    </span>
                    <span className="font-mono text-slate-500 text-xs">
                      <span className="font-bold text-slate-800 text-sm">
                        {sub.marks === "" ? 0 : sub.marks}
                      </span>{" "}
                      / {sub.maxMarks} ({sub.percentage}%)
                    </span>
                  </div>

                  {/* Progressive Bar Container */}
                  <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    {/* Benchmark dotted lines inside bar for visual reference */}
                    {/* Excellence Line (90%) */}
                    <div className="absolute left-[90%] top-0 bottom-0 w-0.5 border-r border-dotted border-white/50 z-10" />
                    {/* Passing Line (60%) */}
                    <div className="absolute left-[60%] top-0 bottom-0 w-0.5 border-r border-dotted border-white/50 z-10" />

                    {/* Progress Fill */}
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                      style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Helper Legend / Benchmark Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Excellence (≥90%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Standard Pass (≥60%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Below Pass (&lt;60%)</span>
            </div>
          </div>

          {/* Strengths & Weaknesses Panel */}
          {validSubjects.length >= 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="block text-slate-400 font-semibold uppercase tracking-wider mb-1">
                  Highest Subject
                </span>
                <span className="font-bold text-emerald-700 font-display text-sm block truncate">
                  {highestSubject.name} ({highestSubject.percentage}%)
                </span>
              </div>
              <div>
                <span className="block text-slate-400 font-semibold uppercase tracking-wider mb-1">
                  Lowest Subject
                </span>
                <span className="font-bold text-rose-700 font-display text-sm block truncate">
                  {lowestSubject.name} ({lowestSubject.percentage}%)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
