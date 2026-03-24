import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import NoticeFilter from "../components/notices/NoticeFilter";
import NoticeItem from "../components/notices/NoticeItem";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { useWebSocket } from "../hooks/useWebSocket";
import { noticesService } from "../services/api";

export default function NoticesPage() {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [form, setForm] = useState({ title: "", body: "", priority: "general", category: "General", pinned: false });
  const debounced = useDebounce(search, 300);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const notices = useQuery({ queryKey: ["notices", priority], queryFn: () => noticesService.all(priority ? { priority } : {}) });
  const [liveNotices, setLiveNotices] = useState([]);
  const markRead = useMutation({ mutationFn: noticesService.markRead, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notices"] }) });
  const createNotice = useMutation({ mutationFn: noticesService.create, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["notices"] }); setForm({ title: "", body: "", priority: "general", category: "General", pinned: false }); } });

  useWebSocket({
    enabled: true,
    onMessage: (message) => {
      if (message?.type === "notice.created") {
        setLiveNotices((prev) => [message, ...prev]);
      }
    },
  });

  const items = notices.data?.data?.data || [];
  const filtered = useMemo(() => [...liveNotices, ...items].filter((notice) => `${notice.title} ${notice.body || ""}`.toLowerCase().includes(debounced.toLowerCase())), [liveNotices, items, debounced]);

  return (
    <div className="page-shell">
      <PageHeader eyebrow="Broadcasts" title="Real-time notice board" subtitle="Pinned notices stay at the top, urgent ones stand out, and websocket updates land here instantly." />
      <NoticeFilter search={search} onSearch={setSearch} priority={priority} onPriority={setPriority} />
      {user?.role === "admin" ? (
        <div className="glass-card apple-panel card-pad">
          <p className="font-heading text-xl">Admin Notice Composer</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" placeholder="Notice title" />
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
              {["urgent", "important", "general"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" placeholder="Category" />
            <label className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800"><input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Pin notice</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="rounded-3xl bg-slate-100 px-4 py-4 dark:bg-slate-800 md:col-span-2" rows={4} placeholder="Notice body" />
          </div>
          <button onClick={() => createNotice.mutate(form)} className="mt-4 rounded-2xl bg-accent px-5 py-3 text-white">Create notice</button>
        </div>
      ) : null}
      <div className="space-y-4">
        {filtered.map((notice, index) => <NoticeItem key={notice.id || `${notice.title}-${index}`} notice={notice} onRead={(id) => id && markRead.mutate(id)} />)}
      </div>
    </div>
  );
}
