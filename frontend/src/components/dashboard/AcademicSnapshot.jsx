export default function AcademicSnapshot({ cgpa = 0, trend = "up" }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Academic Snapshot</p>
      <div className="mt-4 flex items-end gap-3">
        <p className="font-heading text-5xl">{cgpa.toFixed?.(2) ?? cgpa}</p>
        <p className={`pb-2 text-sm font-semibold ${trend === "up" ? "text-success" : "text-danger"}`}>{trend === "up" ? "Improving" : "Needs attention"}</p>
      </div>
    </div>
  );
}
