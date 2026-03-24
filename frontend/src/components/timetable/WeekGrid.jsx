import { useState } from "react";

export default function WeekGrid({ entries = [] }) {
  const [hovered, setHovered] = useState(null);
  const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const grouped = orderedDays.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
  entries.forEach((entry) => {
    grouped[entry.day] ??= [];
    grouped[entry.day].push(entry);
  });

  return (
    <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
      {Object.entries(grouped).map(([day, dayEntries]) => (
        <div key={day} className="glass-card apple-panel card-pad min-h-[280px]">
          <div className="flex items-center justify-between">
            <p className="font-heading text-lg">{day}</p>
            <span className="rounded-full bg-[#EEF2F7] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              {dayEntries.length || 0} slots
            </span>
          </div>
          <div className="mt-4 space-y-2.5">
            {!dayEntries.length ? (
              <div className="rounded-[22px] border border-dashed border-slate-200 bg-white/60 px-4 py-5 text-sm text-slate-400">
                No classes scheduled.
              </div>
            ) : null}
            {dayEntries.map((entry) => (
              <div
                key={entry.id || entry.slot_key}
                onMouseEnter={() => setHovered(entry.id || entry.slot_key)}
                onMouseLeave={() => setHovered(null)}
                className="rounded-[22px] border border-white/70 bg-white/88 p-3 shadow-[0_10px_25px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 dark:bg-slate-900/85"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{entry.subject}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">{entry.start_time} to {entry.end_time}</p>
                  </div>
                  {entry.batch_group ? <span className="rounded-full bg-[#EEF2F7] px-2.5 py-1 text-[10px] font-semibold text-slate-600">{entry.batch_group}</span> : null}
                </div>
                {hovered === (entry.id || entry.slot_key) ? (
                  <div className="mt-3 rounded-2xl bg-[#F7F8FA] px-3 py-3 text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">{entry.teacher}</p>
                    <p className="mt-1">{entry.venue || "Venue pending"}</p>
                    {entry.raw_text ? <p className="mt-2 text-[11px] text-slate-400">{entry.raw_text}</p> : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
