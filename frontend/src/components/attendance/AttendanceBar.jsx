export default function AttendanceBar({ item }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">{item.subject}</p>
        <p className="text-sm text-slate-500">{item.percentage}%</p>
      </div>
      <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className={`h-full rounded-full ${item.percentage >= 75 ? "bg-success" : item.percentage >= 60 ? "bg-warning" : "bg-danger"}`} style={{ width: `${item.percentage}%` }} />
      </div>
    </div>
  );
}
