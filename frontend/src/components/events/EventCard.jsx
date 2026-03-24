import CountdownTimer from "../common/CountdownTimer";

export default function EventCard({ event, onOpen, onInterested, onGoing }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-sand to-sage/30" style={event.image_url ? { backgroundImage: `url(${event.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
      <div className="card-pad">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading text-xl">{event.title}</p>
            <p className="mt-1 text-sm text-slate-500">{event.venue}</p>
          </div>
          <CountdownTimer target={event.date} />
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{event.description}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => onInterested(event.id)} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm dark:bg-slate-800">Interested ({event.interested_users?.length || 0})</button>
          <button onClick={() => onGoing(event.id)} className="rounded-2xl bg-accent px-4 py-2 text-sm text-white">Going ({event.going_users?.length || 0})</button>
          <button onClick={() => onOpen(event)} className="rounded-2xl border border-black/10 px-4 py-2 text-sm dark:border-white/10">Details</button>
        </div>
      </div>
    </div>
  );
}
