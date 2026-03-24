import { useEffect, useState } from "react";

export default function NoteEditor({ note, onSave }) {
  const [subject, setSubject] = useState(note?.subject || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (subject && content) onSave({ subject, content });
    }, 500);
    return () => clearTimeout(timer);
  }, [subject, content, onSave]);

  return (
    <div className="glass-card card-pad">
      <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" className="w-full rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" />
      <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write rich-text-ready notes here..." rows={10} className="mt-4 w-full rounded-3xl bg-slate-100 px-4 py-4 outline-none dark:bg-slate-800" />
    </div>
  );
}
