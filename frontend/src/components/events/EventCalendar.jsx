export default function EventCalendar({ events = [] }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Calendar View</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-7">
        {events.slice(0, 14).map((event) => (
          <div key={event.id} className="rounded-2xl bg-slate-100/70 p-3 text-sm dark:bg-slate-800/70">
            <p className="font-medium">{new Date(event.date).getDate()}</p>
            <p className="mt-2 line-clamp-2 text-xs text-slate-500">{event.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
