import TimetableCard from "./TimetableCard";

export default function DayStrip({ entries = [], compact = false }) {
  const nowHour = new Date().getHours();
  return (
    <div className="glass-card apple-panel card-pad">
      <p className="font-heading text-xl">Today&apos;s Schedule</p>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {entries.map((entry) => {
          const startHour = Number(entry.start_time?.split(":")?.[0] || 0);
          return (
            <div key={entry.id || `${entry.subject}-${entry.start_time}`} className="min-w-[270px] flex-none">
              <TimetableCard entry={entry} compact={compact} highlight={startHour >= nowHour && startHour - nowHour <= 1} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
