export default function FixtureCard({ title = "Upcoming fixture", subtitle = "Live score module ready for sports clubs" }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-lg">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
