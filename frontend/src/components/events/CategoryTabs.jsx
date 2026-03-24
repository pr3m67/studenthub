export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {categories.map((category) => (
        <button key={category} onClick={() => onChange(category)} className={`rounded-full px-4 py-2 text-sm font-semibold ${active === category ? "bg-accent text-white" : "bg-white/80 dark:bg-slate-900/80"}`}>
          {category}
        </button>
      ))}
    </div>
  );
}
