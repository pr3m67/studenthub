export default function DriveCard({ drive, onToggle }) {
  return (
    <div className="glass-card card-pad">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-xl">{drive.company}</p>
          <p className="mt-2 text-sm text-slate-500">CTC ₹{drive.ctc} LPA • {drive.eligibility}</p>
        </div>
        <button onClick={() => onToggle(drive.id)} className="rounded-2xl bg-accent px-4 py-2 text-sm text-white">Interested ({drive.interest_count || 0})</button>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{drive.description}</p>
    </div>
  );
}
