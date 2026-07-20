 Student Grade Calculator 🎓

A responsive, high-performance, and elegant single-page application built with **React**, **TypeScript**, and **Tailwind CSS**. It enables students, teachers, and academic administrators to enter marks across multiple subjects, compute instant percentages, determine letter grades, calculate GPA, visualize subject breakdowns with elegant statistics, and manage saved report history.

---

## ✨ Features

- **Dynamic Subject Editor**: Add, remove, and update subject names, obtained scores, and maximum possible marks on the fly. Defaults to 5 standard academic subjects.
- **Real-time Academic Calculus**: Automatically recalculates total marks, percentage, GPA, pass/fail status, and letter grades (A, B, C, D, or F) instantly with zero lag.
- **Polished Visual Feedback**:
  - **Dynamic SVG Dial**: An interactive, animated radial gauge illustrating overall percentage, color-coded by the resulting letter grade.
  - **Subject breakdown charts**: Custom responsive bar meters representing relative performance, calling out highest/lowest scoring subjects.
  - **Personalized Comments**: Evaluative feedback dynamically computed depending on performance tier.
- **Robust Validations**: Guards against data errors, alerting the user immediately if obtained marks exceed specified maximum marks.
- **Report Card History Log**:
  - Save finalized report cards locally to review later.
  - Features quick aggregate analytical metrics: Class size, class average percentage, pass rate, and the top-performing student's profile.
  - Hydrate previous scores back into the active editor workspace with a single click.
  - Export logs easily to structured **CSV spreadsheet files** for integration with external school databases.
- **Grade scale reference index**: Accessible breakdown of grading system benchmarks.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) for optimal hot-reloading and modular rendering.
- **Language**: [TypeScript](https://www.typescriptlang.org/) ensuring complete type-safety across custom student metrics.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) delivering a sleek layout, fluid margins, and eye-friendly, modern palette transitions.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, uniform iconography.
- **Animations**: [Motion](https://motion.dev/) powering responsive transitions.

---

## 📂 File Architecture

The codebase has been organized into modular, clean components following solid design principles:

```bash
├── index.html                  # Core application entry page
├── package.json                # Project dependencies and runner scripts
├── tsconfig.json               # TypeScript compilation configurations
├── vite.config.ts              # Vite asset bundler configuration
│
├── src
│   ├── App.tsx                 # Main application dashboard workspace
│   ├── index.css               # Global stylesheets importing Tailwind and Google Fonts
│   ├── main.tsx                # React virtual DOM bootstrap element
│   ├── types.ts                # Unified TypeScript type interfaces
│   ├── utils.ts                # Calculation logic, GPA conversions, and grade threshold lists
│   │
│   └── components
│       ├── SubjectInputRow.tsx # Individual subject score row editor with validation badges
│       ├── SubjectCharts.tsx   # Visual subject performance breakdown metrics and progress meters
│       ├── GradeSummaryDisplay.tsx # Radial percentage dial, GPA calculation, and save controls
│       ├── GradeScaleLegend.tsx    # Compact letter grade benchmark reference card
│       └── HistoryTable.tsx    # Saved student report card grid, aggregates HUD, and CSV export
```

---

## 📊 Grading Standard System

The application operates on a robust 100-point standard grading benchmark:

| Letter Grade | Min Percentage | GPA Equivalent | Status |
| :---: | :---: | :---: | :---: |
| **A** | **90%** | **4.0** | Passed |
| **B** | **80%** | **3.3** | Passed |
| **C** | **70%** | **2.7** | Passed |
| **D** | **60%** | **2.0** | Passed |
| **F** | **0%** | **0.0** | Needs Review (Fail) |

---

## 🚀 Running the App Locally

### Prerequisites

Make sure you have Node.js (v18 or higher) installed.

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```
The dev server will boot on `http://localhost:3000`.

### 3. Build for Production

```bash
npm run build
```
Generates optimized static assets in the `/dist` directory.
