import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import AttendanceBar from "../components/attendance/AttendanceBar";
import HeatmapCalendar from "../components/attendance/HeatmapCalendar";
import RiskAlert from "../components/attendance/RiskAlert";
import StreakBadge from "../components/attendance/StreakBadge";
import { useAuth } from "../context/AuthContext";
import { attendanceService, timetableService } from "../services/api";

export default function AttendancePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [division, setDivision] = useState(user?.division || "7");
  const [batch, setBatch] = useState(user?.batch || "G13");
  const [subject, setSubject] = useState("");
  const [statuses, setStatuses] = useState({});
  const summary = useQuery({ queryKey: ["attendance-page-summary"], queryFn: () => attendanceService.summary() });
  const calendar = useQuery({ queryKey: ["attendance-calendar"], queryFn: () => attendanceService.calendar() });
  const prediction = useQuery({ queryKey: ["attendance-prediction"], queryFn: () => attendanceService.prediction() });
  const teacherBoard = useQuery({ queryKey: ["teacher-board", division, batch], queryFn: () => attendanceService.teacherBoard({ division, batch }), enabled: user?.role === "teacher" || user?.role === "admin" });
  const timetable = useQuery({ queryKey: ["attendance-timetable"], queryFn: () => timetableService.week() });
  const submitBoard = useMutation({
    mutationFn: (payload) => attendanceService.submitTeacherBoard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-page-summary"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-calendar"] });
    },
  });
  const summaryItems = summary.data?.data?.data || [];
  const risk = summaryItems[0];
  const subjectOptions = useMemo(() => {
    const fromUser = user?.selected_subjects?.length ? user.selected_subjects : [];
    const fromTimetable = Array.from(new Set((timetable.data?.data?.data || []).map((entry) => entry.subject)));
    return Array.from(new Set([...fromUser, ...fromTimetable])).filter(Boolean);
  }, [user, timetable.data]);

  if (user?.role === "teacher" || user?.role === "admin") {
    const students = teacherBoard.data?.data?.data || [];
    return (
      <div className="page-shell">
        <PageHeader eyebrow="Teacher Portal" title="Attendance Board" subtitle="Pick a division and batch, then mark each student with a simple attendance state." />
        <div className="glass-card apple-panel card-pad">
          <div className="grid gap-3 md:grid-cols-4">
            <input value={division} onChange={(e) => setDivision(e.target.value.toUpperCase())} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" placeholder="Division" />
            <input value={batch} onChange={(e) => setBatch(e.target.value.toUpperCase())} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" placeholder="Batch" />
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
              <option value="">Choose subject</option>
              {subjectOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button onClick={() => submitBoard.mutate({ division, batch, subject, date: new Date().toISOString().slice(0, 10), records: students.map((student) => ({ user_id: student.id, status: statuses[student.id] || "present" })) })} className="rounded-2xl bg-accent px-4 py-3 text-white">Save attendance</button>
          </div>
          <div className="mt-6 space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between rounded-[22px] bg-white/80 p-4 dark:bg-slate-900/80">
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.roll_no} • Division {student.division} • {student.batch}</p>
                </div>
                <div className="flex gap-2">
                  {["present", "absent", "cancelled"].map((state) => (
                    <button key={state} onClick={() => setStatuses((current) => ({ ...current, [student.id]: state }))} className={`h-10 w-10 rounded-full border-2 ${statuses[student.id] === state ? state === "present" ? "border-success bg-success/15" : state === "absent" ? "border-danger bg-danger/15" : "border-slate-400 bg-slate-200" : "border-slate-200 bg-white"}`} title={state} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <PageHeader eyebrow="Attendance" title="Stay above the threshold" subtitle="Track attendance risk, browse your calendar heatmap, and monitor subject-wise health at a glance." />
      <RiskAlert level={risk?.risk === "danger" ? "danger" : risk?.risk === "warning" ? "warning" : ""} message={risk ? `${risk.subject} is currently at ${risk.percentage}%. You need ${risk.needed_to_75} more classes to hit 75%.` : ""} />
      <StreakBadge streak={Math.max(0, (calendar.data?.data?.data || []).filter((item) => item.status === "present").length)} />
      <div className="glass-card card-pad space-y-4">
        <p className="font-heading text-xl">Per-subject attendance</p>
        {summaryItems.length ? summaryItems.map((item) => <AttendanceBar key={item.subject} item={item} />) : <div className="rounded-[24px] bg-slate-100/70 p-5 text-sm text-slate-500 dark:bg-slate-800/70">No attendance has been marked yet. Once your teacher records attendance, your subject breakdown and heatmap will appear here.</div>}
      </div>
      <HeatmapCalendar records={calendar.data?.data?.data || []} />
      <div className="glass-card card-pad">
        <p className="font-heading text-xl">Prediction</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {(prediction.data?.data?.data || []).length ? (prediction.data?.data?.data || []).map((item) => <div key={item.subject} className="rounded-2xl bg-slate-100/70 p-4 dark:bg-slate-800/70"><p className="font-medium">{item.subject}</p><p className="mt-2 text-sm text-slate-500">Need {item.classes_needed} straight present classes.</p></div>) : <div className="rounded-[24px] bg-slate-100/70 p-5 text-sm text-slate-500 dark:bg-slate-800/70 md:col-span-3">Prediction will appear after attendance records exist for your subjects.</div>}
        </div>
      </div>
    </div>
  );
}
