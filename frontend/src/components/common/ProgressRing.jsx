export default function ProgressRing({ value = 0, size = 96, stroke = 10, color = "#4CAF82", label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(148,163,184,0.18)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <div className="font-heading text-xl">{Math.round(value)}%</div>
        {label ? <div className="text-xs text-slate-500">{label}</div> : null}
      </div>
    </div>
  );
}
