import { useState } from "react";
import Modal from "../common/Modal";

export default function UploadModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <Modal open={open} onClose={onClose} title="Upload Your Timetable">
      <div className="rounded-[28px] border-2 border-dashed border-sage/40 p-8 text-center">
        <input
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="mx-auto block"
        />
        <p className="mt-3 text-sm text-slate-500">Upload an Excel `.xlsx` timetable file. Supports the attached timetable format and the StudentHub template.</p>
        <button onClick={() => file && onUpload(file)} className="mt-5 rounded-2xl bg-accent px-5 py-3 font-semibold text-white">Upload</button>
      </div>
    </Modal>
  );
}
