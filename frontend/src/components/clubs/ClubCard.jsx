export default function ClubCard({ club, onToggle }) {
  return (
    <div className="glass-card card-pad">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-xl">{club.name}</p>
          <p className="mt-2 text-sm text-slate-500">{club.category} • {club.member_count} members</p>
        </div>
        <button onClick={() => onToggle(club.id)} className="rounded-2xl bg-accent px-4 py-2 text-sm text-white">Join / Leave</button>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{club.description}</p>
    </div>
  );
}
