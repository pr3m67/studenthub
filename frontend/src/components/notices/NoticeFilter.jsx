export default function NoticeFilter({ search, onSearch, priority, onPriority }) {
  return (
    <div className="glass-card flex flex-col gap-3 p-4 md:flex-row">
      <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search notices..." className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" />
      <select value={priority} onChange={(event) => onPriority(event.target.value)} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
        <option value="">All priorities</option>
        <option value="urgent">Urgent</option>
        <option value="important">Important</option>
        <option value="general">General</option>
      </select>
    </div>
  );
}
