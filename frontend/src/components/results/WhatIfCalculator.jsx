import { useEffect, useMemo, useState } from "react";

export default function WhatIfCalculator({ onSubmit, initialSubjects = [] }) {
  const seedRows = useMemo(
    () =>
      initialSubjects.length
        ? initialSubjects.map((subject) => ({ name: subject, internal_marks: 25, external_marks: 55, grade: "A", credits: 4 }))
        : [{ name: "Subject", internal_marks: 25, external_marks: 55, grade: "A", credits: 4 }],
    [initialSubjects],
  );
  const [form, setForm] = useState(seedRows);

  useEffect(() => {
    setForm(seedRows);
  }, [seedRows]);

  return (
    <div className="glass-card apple-panel card-pad">
      <p className="font-heading text-xl">What-If Calculator</p>
      <p className="mt-2 text-sm text-slate-500">Your confirmed onboarding subjects are loaded automatically. Adjust grades and credits to estimate the semester SGPA.</p>
      <div className="mt-4 space-y-4">
        {form.map((item, index) => (
          <div key={`${item.name}-${index}`} className="grid gap-3 md:grid-cols-[1.4fr_0.6fr_0.8fr]">
            <input className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 dark:bg-slate-800" value={item.name} onChange={(e) => setForm((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, name: e.target.value } : row))} />
            <input className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 dark:bg-slate-800" value={item.credits} min="1" type="number" onChange={(e) => setForm((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, credits: Number(e.target.value) || 0 } : row))} />
            <select className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 dark:bg-slate-800" value={item.grade} onChange={(e) => setForm((prev) => prev.map((row, rowIndex) => rowIndex === index ? { ...row, grade: e.target.value } : row))}>
              {["O", "A+", "A", "B+", "B", "C", "F"].map((grade) => <option key={grade}>{grade}</option>)}
            </select>
          </div>
        ))}
        <div className="flex gap-3">
          <button onClick={() => setForm((prev) => [...prev, { name: "Elective", internal_marks: 25, external_marks: 55, grade: "A", credits: 4 }])} className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm dark:bg-slate-900">Add Subject</button>
          <button onClick={() => onSubmit(form)} className="rounded-2xl bg-[#111827] px-5 py-3 font-semibold text-white">Predict SGPA</button>
        </div>
      </div>
    </div>
  );
}
