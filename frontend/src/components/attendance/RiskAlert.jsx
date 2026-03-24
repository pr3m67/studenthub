export default function RiskAlert({ level, message }) {
  if (!level) return null;
  return <div className={`rounded-3xl px-5 py-4 text-sm font-medium ${level === "danger" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"}`}>{message}</div>;
}
