import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../components/common/PageHeader";
import DayStrip from "../components/timetable/DayStrip";
import WeekGrid from "../components/timetable/WeekGrid";
import UploadModal from "../components/timetable/UploadModal";
import { useAuth } from "../context/AuthContext";
import { timetableService } from "../services/api";

const lunchExcludedSlots = Array.from({ length: 9 }, (_, index) => {
  const hour = 9 + index;
  if (hour === 13) return null;
  return { start: `${String(hour).padStart(2, "0")}:00`, end: `${String(hour + 1).padStart(2, "0")}:00` };
}).filter(Boolean);

export default function TimetablePage() {
  const [mode, setMode] = useState("day");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [batch, setBatch] = useState(() => localStorage.getItem("studenthub-batch") || user?.batch || "ALL");
  const [customClasses, setCustomClasses] = useState(() => JSON.parse(localStorage.getItem("studenthub-custom-classes") || "[]"));
  const [showCustomComposer, setShowCustomComposer] = useState(false);
  const [customForm, setCustomForm] = useState({ day: "Monday", start_time: "09:00", end_time: "10:00", subject: "", teacher: "Self-added", venue: "" });
  const queryClient = useQueryClient();
  const today = useQuery({ queryKey: ["timetable-today"], queryFn: () => timetableService.today() });
  const week = useQuery({ queryKey: ["timetable-week"], queryFn: () => timetableService.week() });
  const upload = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return timetableService.upload(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable-today"] });
      queryClient.invalidateQueries({ queryKey: ["timetable-week"] });
      setOpen(false);
    },
  });

  useEffect(() => {
    localStorage.setItem("studenthub-batch", batch);
  }, [batch]);

  useEffect(() => {
    if (user?.batch) {
      setBatch(user.batch);
    }
  }, [user?.batch]);

  useEffect(() => {
    localStorage.setItem("studenthub-custom-classes", JSON.stringify(customClasses));
  }, [customClasses]);

  const rawEntries = week.data?.data?.data || [];
  const allEntries = useMemo(() => [...rawEntries, ...customClasses], [rawEntries, customClasses]);
  const availableBatches = useMemo(() => {
    const values = new Set();
    rawEntries.forEach((entry) => {
      if (entry.batch_group) {
        entry.batch_group.split(",").forEach((item) => values.add(item.trim()));
      }
    });
    return ["ALL", ...Array.from(values)];
  }, [rawEntries]);

  const visibleEntries = useMemo(() => {
    const grouped = allEntries.reduce((acc, entry) => {
      acc[entry.slot_key || `${entry.day}-${entry.start_time}-${entry.end_time}`] ??= [];
      acc[entry.slot_key || `${entry.day}-${entry.start_time}-${entry.end_time}`].push(entry);
      return acc;
    }, {});
    return Object.entries(grouped).map(([slotKey, entries]) => {
      const batchFiltered = entries.filter((entry) => batch === "ALL" || !entry.batch_group || entry.batch_group.includes(batch));
      const subjectFiltered = (batchFiltered.length ? batchFiltered : entries).filter(
        (entry) => !user?.selected_subjects?.length || user.selected_subjects.includes(entry.subject) || entry.source_type === "custom",
      );
      const options = subjectFiltered.length ? subjectFiltered : batchFiltered.length ? batchFiltered : entries;
      return options[0];
    }).filter(Boolean);
  }, [allEntries, batch, user?.selected_subjects]);

  const todayEntries = useMemo(() => {
    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return visibleEntries.filter((entry) => entry.day === todayName);
  }, [visibleEntries]);

  const addCustomClass = () => {
    if (!customForm.subject || !customForm.venue) return;
    setCustomClasses((current) => [
      ...current,
      {
        ...customForm,
        color_tag: "#2D3A3A",
        source_type: "custom",
        batch_group: user?.batch ? user.batch : batch === "ALL" ? "" : batch,
        raw_text: "",
        slot_key: `${customForm.day}-${customForm.start_time}-${customForm.end_time}-custom-${current.length + 1}`,
      },
    ]);
    setCustomForm({ day: "Monday", start_time: "09:00", end_time: "10:00", subject: "", teacher: "Self-added", venue: "" });
    setShowCustomComposer(false);
  };

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") Notification.requestPermission();
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      visibleEntries.forEach((entry) => {
        const notifyKey = `${entry.slot_key}-notified`;
        if (entry.day === currentDay && entry.start_time === currentTime && !sessionStorage.getItem(notifyKey) && Notification.permission === "granted") {
          new Notification(`Class now: ${entry.subject}`, { body: `${entry.teacher} at ${entry.venue}` });
          sessionStorage.setItem(notifyKey, "1");
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [visibleEntries]);

  return (
    <div className="page-shell">
      <PageHeader eyebrow="Schedule" title="Timetable" subtitle="A lighter weekly planner that follows your onboarding batch, confirmed subjects, elective picks, custom classes, and live class reminders." actions={<div className="flex flex-wrap gap-2"><select value={batch} onChange={(event) => setBatch(event.target.value)} className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 dark:bg-slate-900">{availableBatches.map((item) => <option key={item}>{item}</option>)}</select><button onClick={() => setMode("day")} className={`rounded-2xl px-4 py-3 ${mode === "day" ? "bg-[#111827] text-white" : "bg-white/90 dark:bg-slate-900"}`}>Day View</button><button onClick={() => setMode("week")} className={`rounded-2xl px-4 py-3 ${mode === "week" ? "bg-[#111827] text-white" : "bg-white/90 dark:bg-slate-900"}`}>Week View</button><button onClick={() => setShowCustomComposer((current) => !current)} className="rounded-2xl bg-white/90 px-4 py-3 dark:bg-slate-900">{showCustomComposer ? "Hide Add Class" : "Add Class"}</button><button onClick={() => setOpen(true)} className="rounded-2xl bg-[#C7D5E8] px-4 py-3 text-slate-900">Upload</button></div>} />
      <div className="grid gap-4 lg:grid-cols-[1.55fr_0.45fr]">
        <div>{mode === "day" ? <DayStrip entries={todayEntries} /> : <WeekGrid entries={visibleEntries} />}</div>
        <div className="glass-card apple-panel card-pad">
          <p className="font-heading text-xl">Extra Class</p>
          <p className="mt-2 text-sm text-slate-500">Your timetable now follows the batch and subject choices you already confirmed during onboarding. Use this panel only when you need to add an extra lecture or lab.</p>
          <div className="mt-8 border-t border-black/5 pt-6 dark:border-white/10">
            <p className="font-heading text-xl">Add Extra Class</p>
            <p className="mt-2 text-sm text-slate-500">Plan an additional lecture or lab between 09:00 and 18:00. Lunch from 13:00 to 14:00 stays blocked out automatically.</p>
            <div className={`mt-4 grid gap-3 transition ${showCustomComposer ? "opacity-100" : "pointer-events-none max-h-0 overflow-hidden opacity-0"}`}>
              <select value={customForm.day} onChange={(event) => setCustomForm((current) => ({ ...current, day: event.target.value }))} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => <option key={day}>{day}</option>)}
              </select>
              <select value={`${customForm.start_time}-${customForm.end_time}`} onChange={(event) => {
                const [start_time, end_time] = event.target.value.split("-");
                setCustomForm((current) => ({ ...current, start_time, end_time }));
              }} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                {lunchExcludedSlots.map((slot) => <option key={`${slot.start}-${slot.end}`} value={`${slot.start}-${slot.end}`}>{slot.start} - {slot.end}</option>)}
              </select>
              <input value={customForm.subject} onChange={(event) => setCustomForm((current) => ({ ...current, subject: event.target.value }))} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" placeholder="Subject" />
              <input value={customForm.venue} onChange={(event) => setCustomForm((current) => ({ ...current, venue: event.target.value }))} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" placeholder="Venue" />
              <button onClick={addCustomClass} className="rounded-2xl bg-[#111827] px-4 py-3 text-white">Save extra class</button>
            </div>
          </div>
        </div>
      </div>
      <UploadModal open={open} onClose={() => setOpen(false)} onUpload={(file) => upload.mutate(file)} />
    </div>
  );
}
