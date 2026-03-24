import Badge from "../common/Badge";

export default function NoticesWidget({ notices = [] }) {
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Latest Notices</p>
      <div className="mt-4 space-y-3">
        {notices.slice(0, 3).map((notice) => (
          <div key={notice.id} className="rounded-2xl border border-black/5 p-4 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{notice.title}</p>
              <Badge tone={notice.priority === "urgent" ? "danger" : notice.priority === "important" ? "warning" : "default"}>{notice.priority}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-500">{notice.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
