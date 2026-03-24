export default function Badge({ children, tone = "default" }) {
  const tones = {
    default: "bg-sand text-accent",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    danger: "bg-danger/15 text-danger",
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone] || tones.default}`}>{children}</span>;
}
