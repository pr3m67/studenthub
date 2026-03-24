import { Bell } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { noticesService } from "../../services/api";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({ queryKey: ["notice-bell"], queryFn: () => noticesService.all({ page: 1 }) });
  const notices = data?.data?.data || [];
  const unread = notices.filter((notice) => !notice.read_by?.length).length;
  return (
    <div className="relative">
      <button onClick={() => setOpen((prev) => !prev)} className="relative rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
        <Bell size={18} />
        {unread ? <span className="absolute -right-1 -top-1 rounded-full bg-danger px-1.5 py-0.5 text-[10px] text-white">{unread}</span> : null}
      </button>
      {open ? (
        <div className="absolute right-0 top-14 z-40 w-80 rounded-3xl bg-white p-4 shadow-card dark:bg-slate-900">
          <p className="font-heading text-lg">Recent notices</p>
          <div className="mt-3 space-y-3">
            {notices.slice(0, 4).map((notice) => <div key={notice.id} className="rounded-2xl bg-slate-100/70 p-3 text-sm dark:bg-slate-800/70">{notice.title}</div>)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
