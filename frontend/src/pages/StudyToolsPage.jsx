import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../components/common/PageHeader";
import ExamCountdown from "../components/studytools/ExamCountdown";
import GPACalculator from "../components/studytools/GPACalculator";
import NoteEditor from "../components/studytools/NoteEditor";
import PomodoroTimer from "../components/studytools/PomodoroTimer";
import TaskItem from "../components/studytools/TaskItem";
import { studytoolsService } from "../services/api";

export default function StudyToolsPage() {
  const queryClient = useQueryClient();
  const tasks = useQuery({ queryKey: ["study-tasks"], queryFn: () => studytoolsService.tasks() });
  const notes = useQuery({ queryKey: ["study-notes"], queryFn: () => studytoolsService.notes() });
  const createTask = useMutation({ mutationFn: studytoolsService.createTask, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["study-tasks"] }) });
  const updateTask = useMutation({ mutationFn: ({ id, payload }) => studytoolsService.updateTask(id, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["study-tasks"] }) });
  const deleteTask = useMutation({ mutationFn: studytoolsService.deleteTask, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["study-tasks"] }) });
  const saveNote = useMutation({ mutationFn: studytoolsService.upsertNote, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["study-notes"] }) });
  const items = tasks.data?.data?.data || [];
  return (
    <div className="page-shell">
      <PageHeader eyebrow="Study Tools" title="Focus, plan, and remember" subtitle="Bundle tasks, notes, pomodoro sessions, and exam countdowns into one personal productivity cockpit." actions={<button onClick={() => createTask.mutate({ title: "New study task", due_date: new Date(Date.now() + 86400000).toISOString(), priority: "medium", completed: false })} className="rounded-2xl bg-accent px-4 py-3 text-white">Add task</button>} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {items.map((task) => <TaskItem key={task.id} task={task} onToggle={(item) => updateTask.mutate({ id: item.id, payload: { completed: !item.completed } })} onDelete={(id) => deleteTask.mutate(id)} />)}
          <NoteEditor note={notes.data?.data?.data?.[0]} onSave={(payload) => saveNote.mutate(payload)} />
        </div>
        <div className="space-y-6">
          <PomodoroTimer />
          <ExamCountdown title="Next major exam" date={new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString()} />
          <GPACalculator />
        </div>
      </div>
    </div>
  );
}
