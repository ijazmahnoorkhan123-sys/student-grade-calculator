/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GRADE_THRESHOLDS } from "../utils";
import { BookOpen } from "lucide-react";

export default function GradeScaleLegend() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          <BookOpen size={18} />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 font-display">Grading Reference</h4>
          <p className="text-xs text-slate-500">Standard letter grade thresholds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {GRADE_THRESHOLDS.map((t) => {
          let badgeColor = "text-rose-700 bg-rose-50 border-rose-100";
          if (t.grade === "A") badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
          else if (t.grade === "B") badgeColor = "text-blue-700 bg-blue-50 border-blue-100";
          else if (t.grade === "C") badgeColor = "text-amber-700 bg-amber-50 border-amber-100";
          else if (t.grade === "D") badgeColor = "text-orange-700 bg-orange-50 border-orange-100";

          return (
            <div
              key={t.grade}
              className="flex items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-lg font-bold font-display text-sm border ${badgeColor}`}
                >
                  {t.grade}
                </span>
                <div>
                  <span className="font-semibold text-slate-700 text-sm">
                    {t.grade === "F" ? "Below 60%" : `Score ≥ ${t.minPercentage}%`}
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5 font-normal leading-normal hidden sm:block">
                    {t.description}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  t.grade === "F"
                    ? "bg-rose-50 text-rose-600 border border-rose-100"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {t.grade === "F" ? "Failed" : "Passed"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
