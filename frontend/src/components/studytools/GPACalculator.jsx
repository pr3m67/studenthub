import { useMemo, useState } from "react";

const gradeMap = { O: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, F: 0 };

export default function GPACalculator() {
  const [rows, setRows] = useState([{ subject: "Data Structures", credits: 4, grade: "A" }]);
  const sgpa = useMemo(() => {
    const totals = rows.reduce((acc, row) => {
      acc.points += row.credits * (gradeMap[row.grade] || 0);
      acc.credits += row.credits;
      return acc;
    }, { points: 0, credits: 0 });
    return totals.credits ? (totals.points / totals.credits).toFixed(2) : "0.00";
  }, [rows]);

  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Quick GPA Calculator</p>
      <div className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-3">
            <input className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" value={row.subject} onChange={(e) => setRows((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, subject: e.target.value } : item))} />
            <input type="number" className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" value={row.credits} onChange={(e) => setRows((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, credits: Number(e.target.value) } : item))} />
            <select className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" value={row.grade} onChange={(e) => setRows((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, grade: e.target.value } : item))}>
              {Object.keys(gradeMap).map((grade) => <option key={grade}>{grade}</option>)}
            </select>
          </div>
        ))}
        <p className="font-heading text-3xl">{sgpa}</p>
      </div>
    </div>
  );
}
