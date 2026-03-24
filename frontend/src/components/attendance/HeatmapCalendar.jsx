export default function HeatmapCalendar({ records = [] }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Attendance Heatmap</p>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {records.slice(-35).map((record, index) => (
          <div key={`${record.date}-${index}`} className={`rounded-xl p-3 text-center text-[10px] ${record.status === "present" ? "bg-success/20 text-success" : record.status === "absent" ? "bg-danger/20 text-danger" : "bg-slate-200 text-slate-500 dark:bg-slate-800"}`}>
            {new Date(record.date).getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
