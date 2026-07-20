/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  RotateCcw,
  Sparkles,
  Calculator,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { Subject, HistoryRecord } from "./types";
import { calculateGradeResult } from "./utils";

import SubjectInputRow from "./components/SubjectInputRow";
import GradeSummaryDisplay from "./components/GradeSummaryDisplay";
import SubjectCharts from "./components/SubjectCharts";
import HistoryTable from "./components/HistoryTable";
import GradeScaleLegend from "./components/GradeScaleLegend";

const DEFAULT_SUBJECTS: Subject[] = [
  { id: "math", name: "Mathematics", marks: "", maxMarks: 100 },
  { id: "sci", name: "General Science", marks: "", maxMarks: 100 },
  { id: "eng", name: "English Literature", marks: "", maxMarks: 100 },
  { id: "hist", name: "History & Geography", marks: "", maxMarks: 100 },
  { id: "art", name: "Art & Creative Design", marks: "", maxMarks: 100 },
];

export default function App() {
  // Main states
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [studentName, setStudentName] = useState<string>("");
  const [rollNumber, setRollNumber] = useState<string>("");
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);
  const [showNotification, setShowNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("student_grade_history");
      if (saved) {
        setHistoryRecords(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load grade calculator history", err);
    }
  }, []);

  // Save history to localStorage
  const saveToLocalStorage = (records: HistoryRecord[]) => {
    try {
      localStorage.setItem("student_grade_history", JSON.stringify(records));
    } catch (err) {
      console.error("Failed to save grade calculator history", err);
    }
  };

  // Auto-dismiss notifications
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Update a specific field for a subject
  const handleUpdateSubject = (
    id: string,
    field: "name" | "marks" | "maxMarks",
    value: any
  ) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
    setHasUnsavedChanges(true);
  };

  // Add an empty subject row
  const handleAddSubject = () => {
    const newId = `sub_${Date.now()}`;
    setSubjects((prev) => [
      ...prev,
      { id: newId, name: `Subject ${prev.length + 1}`, marks: "", maxMarks: 100 },
    ]);
    setHasUnsavedChanges(true);
  };

  // Delete a subject row
  const handleDeleteSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((sub) => sub.id !== id));
    setHasUnsavedChanges(true);
  };

  // Reset calculator to default
  const handleResetCalculator = () => {
    if (window.confirm("Are you sure you want to reset all inputs to default?")) {
      setSubjects(DEFAULT_SUBJECTS);
      setStudentName("");
      setRollNumber("");
      setHasUnsavedChanges(true);
      setShowNotification({
        type: "success",
        message: "Inputs successfully reset to default.",
      });
    }
  };

  // Calculate overall grade results
  const result = calculateGradeResult(subjects);

  // Check if there are any errors (e.g. marks > maxMarks)
  const hasErrors = subjects.some(
    (sub) => sub.marks !== "" && sub.marks > sub.maxMarks
  );

  // Save the current card to history
  const handleSaveToHistory = () => {
    if (hasErrors) {
      setShowNotification({
        type: "error",
        message: "Cannot save report: Please fix subject mark errors first.",
      });
      return;
    }

    const nameToSave = studentName.trim() || "Anonymous Student";
    const newRecord: HistoryRecord = {
      id: `rec_${Date.now()}`,
      studentName: nameToSave,
      rollNumber: rollNumber.trim() || undefined,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      subjects: [...subjects],
      result: { ...result },
    };

    const updated = [newRecord, ...historyRecords];
    setHistoryRecords(updated);
    saveToLocalStorage(updated);
    setHasUnsavedChanges(false);
    setShowNotification({
      type: "success",
      message: `Report card for "${nameToSave}" saved to history successfully!`,
    });
  };

  // Load a record from history back into current inputs
  const handleLoadRecord = (record: HistoryRecord) => {
    setSubjects(record.subjects);
    setStudentName(record.studentName === "Anonymous Student" ? "" : record.studentName);
    setRollNumber(record.rollNumber || "");
    setHasUnsavedChanges(false);
    setShowNotification({
      type: "success",
      message: `Loaded performance report for "${record.studentName}" into editor.`,
    });
    // Scroll smoothly to top of page to view loaded data
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a specific record from history
  const handleDeleteRecord = (id: string) => {
    const updated = historyRecords.filter((r) => r.id !== id);
    setHistoryRecords(updated);
    saveToLocalStorage(updated);
    setShowNotification({
      type: "success",
      message: "Report card removed from history log.",
    });
  };

  // Clear all history
  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to permanently delete all saved history? This cannot be undone.")) {
      setHistoryRecords([]);
      localStorage.removeItem("student_grade_history");
      setShowNotification({
        type: "success",
        message: "All history records successfully cleared.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-300">
      {/* Toast Notification HUD */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg max-w-sm bg-white border-slate-200">
          {showNotification.type === "success" ? (
            <CheckCircle className="text-emerald-500 shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-rose-500 shrink-0" size={20} />
          )}
          <span className="text-xs font-semibold text-slate-700">
            {showNotification.message}
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Branding Container */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-200">
              <GraduationCap size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                  Student Grade Calculator
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Sparkles size={10} /> Active
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Calculate total marks, percentage, GPA, and letter grades for five or more subjects.
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic Warning Alert Bar if validations fail */}
        {hasErrors && (
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 flex items-start gap-3 shadow-xs animate-pulse">
            <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h5 className="font-bold text-sm">Validation Warning</h5>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                One or more subjects have obtained marks exceeding their specified maximum possible marks.
                Please review highlighted entries to compute an accurate grade percentage.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Grid Workspace */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT / PRIMARY COLUMN: Inputs & Metadata */}
          <section className="lg:col-span-2 space-y-6">
            
            {/* Student Identification Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg">
                  <Calculator size={16} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm font-display uppercase tracking-wide">
                  Student Profile
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="student-name"
                    className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                  >
                    Student Name
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    value={studentName}
                    onChange={(e) => {
                      setStudentName(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="roll-number"
                    className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                  >
                    Roll Number / ID
                  </label>
                  <input
                    id="roll-number"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => {
                      setRollNumber(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="e.g. SCH-2026-089"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Subject Marks Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-6">
              
              {/* Form Section Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm font-display uppercase tracking-wide">
                  Subject Grades &amp; Marks
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {subjects.length} active subjects
                </span>
              </div>

              {/* Input Rows */}
              <div className="flex flex-col gap-4">
                {subjects.map((sub, idx) => (
                  <SubjectInputRow
                    key={sub.id}
                    subject={sub}
                    index={idx}
                    onUpdate={handleUpdateSubject}
                    onDelete={handleDeleteSubject}
                    canDelete={subjects.length > 1}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95"
                >
                  <Plus size={16} />
                  Add Subject Row
                </button>

                <button
                  type="button"
                  onClick={handleResetCalculator}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-all duration-200"
                >
                  <RotateCcw size={16} />
                  Reset Inputs
                </button>
              </div>
            </div>

            {/* Render Subject Breakdown chart below inputs on medium+ screens */}
            <SubjectCharts subjects={subjects} />

          </section>

          {/* RIGHT / SECONDARY COLUMN: Grading Results Panel */}
          <section className="space-y-6">
            
            {/* Real-time calculated grade summary */}
            <GradeSummaryDisplay
              result={result}
              studentName={studentName.trim() || undefined}
              rollNumber={rollNumber.trim() || undefined}
              onSaveRecord={handleSaveToHistory}
              hasUnsavedChanges={hasUnsavedChanges}
            />

            {/* Quick reference guide of standard grades */}
            <GradeScaleLegend />

          </section>
        </main>

        {/* BOTTOM SECTION: Saved reports list */}
        <section className="pt-4">
          <HistoryTable
            records={historyRecords}
            onLoadRecord={handleLoadRecord}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAllHistory}
          />
        </section>
      </div>
    </div>
  );
}
