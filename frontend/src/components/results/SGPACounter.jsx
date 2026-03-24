export default function SGPACounter({ value, label }) {
  return (
    <div className="glass-card card-pad text-center">
      <p className="font-heading text-5xl">{Number(value || 0).toFixed(2)}</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  );
}
