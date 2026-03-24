import Badge from "../common/Badge";

export default function ResultCard({ subject }) {
  const tone = subject.grade === "F" ? "danger" : ["O", "A+", "A"].includes(subject.grade) ? "success" : "warning";
  return (
    <div className="glass-card card-pad">
      <div className="flex items-center justify-between">
        <p className="font-heading text-xl">{subject.name}</p>
        <Badge tone={tone}>{subject.grade}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div><p className="text-slate-500">Internal</p><p>{subject.internal_marks}</p></div>
        <div><p className="text-slate-500">External</p><p>{subject.external_marks}</p></div>
        <div><p className="text-slate-500">Credits</p><p>{subject.credits}</p></div>
      </div>
    </div>
  );
}
