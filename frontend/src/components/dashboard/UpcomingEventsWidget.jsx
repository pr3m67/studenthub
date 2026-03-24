import CountdownTimer from "../common/CountdownTimer";

export default function UpcomingEventsWidget({ events = [] }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Upcoming Events</p>
      <div className="mt-4 space-y-3">
        {events.slice(0, 3).map((event) => (
          <div key={event.id} className="rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-800/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-heading">{event.title}</p>
                <p className="text-sm text-slate-500">{event.venue}</p>
              </div>
              <CountdownTimer target={event.date} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
