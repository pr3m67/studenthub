import Badge from "../common/Badge";

export default function NoticeItem({ notice, onRead }) {
  const tone = notice.priority === "urgent" ? "danger" : notice.priority === "important" ? "warning" : "default";
  return (
    <button onClick={() => onRead(notice.id)} className={`glass-card card-pad block w-full text-left ${notice.priority === "urgent" ? "border-l-4 border-danger" : notice.priority === "important" ? "border-l-4 border-warning" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-xl">{notice.pinned ? "📌 " : ""}{notice.title}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{notice.body}</p>
        </div>
        <Badge tone={tone}>{notice.priority}</Badge>
      </div>
    </button>
  );
}
