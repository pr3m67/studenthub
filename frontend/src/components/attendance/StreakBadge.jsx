export default function StreakBadge({ streak = 0 }) {
  return <div className="glass-card inline-flex items-center gap-2 px-4 py-3 font-semibold">🔥 {streak} day streak</div>;
}
