import { useState } from "react";

export default function ResumeUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Resume Upload</p>
      <div className="mt-4 rounded-3xl border-2 border-dashed border-sage/40 p-8 text-center">
        <input type="file" accept=".pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        <button onClick={() => file && onUpload(file)} className="mt-4 rounded-2xl bg-accent px-5 py-3 text-white">Upload Resume</button>
      </div>
    </div>
  );
}
