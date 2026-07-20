/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HistoryRecord } from "../types";
import {
  Trash2,
  FolderUp,
  History,
  Users,
  Percent,
  CheckCircle,
  Trophy,
  Download,
  Upload,
} from "lucide-react";

interface HistoryTableProps {
  records: HistoryRecord[];
  onLoadRecord: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryTable({
  records,
  onLoadRecord,
  onDeleteRecord,
  onClearAll,
}: HistoryTableProps) {
  // Calculate summary metrics across saved records
  const totalRecords = records.length;

  const averagePercentage =
    totalRecords > 0
      ? parseFloat(
          (
            records.reduce((acc, curr) => acc + curr.result.percentage, 0) /
            totalRecords
          ).toFixed(1)
        )
      : 0;

  const passCount = records.filter((r) => r.result.status === "Pass").length;
  const passRate =
    totalRecords > 0 ? Math.round((passCount / totalRecords) * 100) : 0;

  const topStudent =
    totalRecords > 0
      ? [...records].sort((a, b) => b.result.percentage - a.result.percentage)[0]
      : null;

  // Handle export to CSV
  const exportToCSV = () => {
    if (records.length === 0) return;
    const headers = [
      "Student Name",
      "Roll Number",
      "Date",
      "Total Obtained",
      "Total Max",
      "Percentage",
      "Grade",
      "Status",
      "GPA",
    ];
    const rows = records.map((r) => [
      `"${r.studentName}"`,
      `"${r.rollNumber || ""}"`,
      `"${r.date}"`,
      r.result.totalObtained,
      r.result.totalMax,
      r.result.percentage,
      `"${r.result.grade}"`,
      `"${r.result.status}"`,
      r.result.gpa,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_grades_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col gap-6 p-6">
      {/* History Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 font-display">Report Card History</h3>
            <p className="text-xs text-slate-500">
              Review and aggregate previously calculated reports
            </p>
          </div>
        </div>

        {totalRecords > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download size={14} />
              Export CSV
            </button>
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {totalRecords === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
          <History size={40} className="mb-3 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No records saved yet.</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
            Input marks, fill in the student name, and click the "Save to History Report" button to log cards here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Aggregate Analytics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-100/75 text-indigo-600">
                <Users size={18} />
              </div>
              <div>
                <span className="block text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                  Students
                </span>
                <span className="font-bold text-slate-800 text-lg leading-tight font-display">
                  {totalRecords}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-100/75 text-blue-600">
                <Percent size={18} />
              </div>
              <div>
                <span className="block text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                  Class Avg
                </span>
                <span className="font-bold text-slate-800 text-lg leading-tight font-display">
                  {averagePercentage}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100/75 text-emerald-600">
                <CheckCircle size={18} />
              </div>
              <div>
                <span className="block text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                  Pass Rate
                </span>
                <span className="font-bold text-slate-800 text-lg leading-tight font-display">
                  {passRate}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 col-span-2 md:col-span-1">
              <div className="p-2.5 rounded-lg bg-amber-100/75 text-amber-600">
                <Trophy size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
                  Highest Performer
                </span>
                <span
                  className="font-bold text-slate-800 text-sm leading-tight font-display block truncate"
                  title={topStudent ? `${topStudent.studentName} (${topStudent.result.percentage}%)` : ""}
                >
                  {topStudent ? topStudent.studentName : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student &amp; Date</th>
                  <th className="py-3 px-4 text-center">Marks Obtained</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {records.map((rec) => {
                  let gradeColor = "text-rose-600 bg-rose-50 border-rose-100";
                  if (rec.result.grade === "A")
                    gradeColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
                  else if (rec.result.grade === "B")
                    gradeColor = "text-blue-700 bg-blue-50 border-blue-100";
                  else if (rec.result.grade === "C")
                    gradeColor = "text-amber-700 bg-amber-50 border-amber-100";
                  else if (rec.result.grade === "D")
                    gradeColor = "text-orange-700 bg-orange-50 border-orange-100";

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{rec.studentName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400 font-mono">
                          {rec.rollNumber && (
                            <>
                              <span className="uppercase">No: {rec.rollNumber}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{rec.date}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-600">
                        {rec.result.totalObtained} / {rec.result.totalMax}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                        {rec.result.percentage}%
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md font-bold font-display text-xs border ${gradeColor}`}
                        >
                          {rec.result.grade}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {rec.result.status === "Pass" ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                            Fail
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Load button */}
                          <button
                            onClick={() => onLoadRecord(rec)}
                            title="Load student back to calculator"
                            className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                          >
                            <FolderUp size={14} />
                          </button>
                          {/* Delete button */}
                          <button
                            onClick={() => onDeleteRecord(rec.id)}
                            title="Delete record"
                            className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 cursor-pointer transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
