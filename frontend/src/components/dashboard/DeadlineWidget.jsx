import { formatDate } from "../../utils/format";

export default function DeadlineWidget({ tasks = [] }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Next Deadlines</p>
      <div className="mt-4 space-y-3">
        {tasks.slice(0, 4).map((task) => (
          <div key={task.id} className="rounded-2xl bg-slate-100/70 p-3 dark:bg-slate-800/70">
            <p className="font-medium">{task.title}</p>
            <p className="text-xs text-slate-500">{formatDate(task.due_date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
