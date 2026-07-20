/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Subject } from "../types";
import { Trash2, AlertCircle, Sparkles } from "lucide-react";

interface SubjectInputRowProps {
  subject: Subject;
  index: number;
  onUpdate: (id: string, field: "name" | "marks" | "maxMarks", value: any) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export const SubjectInputRow: React.FC<SubjectInputRowProps> = ({
  subject,
  index,
  onUpdate,
  onDelete,
  canDelete,
}) => {
  const isError =
    subject.marks !== "" &&
    subject.marks > subject.maxMarks;

  const handleMarksChange = (val: string) => {
    if (val === "") {
      onUpdate(subject.id, "marks", "");
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onUpdate(subject.id, "marks", num >= 0 ? num : 0);
    }
  };

  const handleMaxMarksChange = (val: string) => {
    if (val === "") {
      onUpdate(subject.id, "maxMarks", 100);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onUpdate(subject.id, "maxMarks", num > 0 ? num : 100);
    }
  };

  return (
    <div
      className={`group relative flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
        isError
          ? "border-rose-300 bg-rose-50/50"
          : "border-slate-200 hover:border-slate-300 bg-white shadow-xs hover:shadow-md"
      }`}
    >
      {/* Index Badge */}
      <div className="absolute -top-2.5 -left-2.5 md:relative md:top-0 md:left-0 flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-semibold font-mono border border-slate-200">
        {index + 1}
      </div>

      {/* Subject Name Input */}
      <div className="w-full md:flex-1">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 md:hidden">
          Subject Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={subject.name}
            onChange={(e) => onUpdate(subject.id, "name", e.target.value)}
            placeholder="e.g. Mathematics"
            className="w-full px-3 py-2 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-hidden font-medium text-slate-800 transition-colors duration-200 text-base"
          />
        </div>
      </div>

      {/* Marks Obtained Input */}
      <div className="w-full md:w-36">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 md:hidden">
          Marks Obtained
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max={subject.maxMarks}
            value={subject.marks}
            onChange={(e) => handleMarksChange(e.target.value)}
            placeholder="0"
            className={`w-full px-3 py-2 rounded-lg border font-medium text-right transition-all duration-200 focus:outline-hidden ${
              isError
                ? "border-rose-400 bg-rose-50 text-rose-700 focus:ring-2 focus:ring-rose-200"
                : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-800"
            }`}
          />
          {isError && (
            <div className="absolute right-3 top-2.5 text-rose-500 flex items-center pointer-events-none animate-bounce">
              <AlertCircle size={18} />
            </div>
          )}
        </div>
      </div>

      {/* Separator / Slash */}
      <span className="hidden md:block text-slate-300 font-light text-xl">/</span>

      {/* Max Marks Input */}
      <div className="w-full md:w-32">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 md:hidden">
          Maximum Marks
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            value={subject.maxMarks}
            onChange={(e) => handleMaxMarksChange(e.target.value)}
            placeholder="100"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium text-right text-slate-600 bg-slate-50/50 hover:bg-slate-50 focus:border-indigo-500 focus:bg-white focus:outline-hidden transition-all duration-200"
          />
        </div>
      </div>

      {/* Delete Button */}
      <div className="w-full md:w-auto flex justify-end md:block pt-2 md:pt-0">
        <button
          type="button"
          onClick={() => onDelete(subject.id)}
          disabled={!canDelete}
          title={canDelete ? "Delete Subject" : "Cannot delete (minimum 1 subject required)"}
          className={`p-2.5 rounded-lg border transition-all duration-200 ${
            canDelete
              ? "border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 cursor-pointer"
              : "border-slate-100 text-slate-200 cursor-not-allowed"
          }`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Error Message for Individual Row */}
      {isError && (
        <div className="w-full text-left text-xs font-medium text-rose-600 md:absolute md:-bottom-2.5 md:left-14 md:bg-white md:px-2 md:py-0.5 md:rounded-md md:border md:border-rose-200 flex items-center gap-1 shadow-xs animate-fade-in">
          <AlertCircle size={12} />
          Obtained marks cannot exceed maximum possible marks ({subject.maxMarks}).
        </div>
      )}
    </div>
  );
};

export default SubjectInputRow;
