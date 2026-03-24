export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className={`glass-card card-pad flex items-center justify-between gap-4 ${new Date(task.due_date) < new Date() && !task.completed ? "ring-2 ring-danger/40" : ""}`}>
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task)} className="h-5 w-5 rounded" />
        <div>
          <p className={`font-medium ${task.completed ? "line-through text-slate-400" : ""}`}>{task.title}</p>
          <p className="text-xs text-slate-500">{new Date(task.due_date).toLocaleString()}</p>
        </div>
      </div>
      <button onClick={() => onDelete(task.id)} className="rounded-2xl bg-danger/10 px-3 py-2 text-sm text-danger">Delete</button>
    </div>
  );
}
