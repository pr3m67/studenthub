export default function WeatherWidget({ temp = "--", condition = "Loading" }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Campus Weather</p>
      <div className="mt-4">
        <p className="font-heading text-4xl">{temp}</p>
        <p className="mt-1 text-sm text-slate-500">{condition}</p>
      </div>
    </div>
  );
}
