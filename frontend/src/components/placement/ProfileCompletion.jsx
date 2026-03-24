export default function ProfileCompletion({ user }) {
  const checks = [
    { label: "Profile photo", value: Boolean(user?.profile_pic) },
    { label: "Resume", value: Boolean(user?.resume_url) },
    { label: "Skills", value: Boolean(user?.skills?.length) },
    { label: "Projects", value: Boolean(user?.projects?.length) },
  ];
  const percentage = Math.round((checks.filter((item) => item.value).length / checks.length) * 100);
  return (
    <div className="glass-card card-pad">
      <div className="flex items-center justify-between">
        <p className="font-heading text-xl">Placement Readiness</p>
        <p className="font-heading text-2xl">{percentage}%</p>
      </div>
      <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-success" style={{ width: `${percentage}%` }} />
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {checks.map((check) => <p key={check.label}>{check.value ? "✓" : "○"} {check.label}</p>)}
      </div>
    </div>
  );
}
