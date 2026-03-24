import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { timetableService, userService } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({ division: "7", batch: "G13" });
  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const [parsedSubjects, setParsedSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [timetableCaptured, setTimetableCaptured] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();
  const canFinish = useMemo(() => !parsedSubjects.length || selectedSubjects.length > 0, [parsedSubjects, selectedSubjects]);

  const normalizeError = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return normalizeError(value[0]);
    if (typeof value === "object") return normalizeError(Object.values(value)[0]);
    return String(value);
  };

  const sanitizeSubjects = (values) =>
    Array.from(
      new Set(
        (Array.isArray(values) ? values : [])
          .map((item) => {
            if (typeof item === "string") return item.trim();
            if (item && typeof item === "object") return String(item.subject || item.name || Object.values(item)[0] || "").trim();
            return String(item || "").trim();
          })
          .map((item) => item.replace(/\s+/g, " ").trim())
          .filter(Boolean)
          .filter((item) => !/^\d{2}[A-Z]{2,}\d+[A-Z]?$/i.test(item))
          .filter((item) => !/^(cd cell|cdc|cd cell trainer|subject abbr\.?|subject name|faculty abbr\.?|faculty name|hod|director \(school of technology\)|timetable coordinator|school of technology)$/i.test(item))
          .filter((item) => !/^(dr\.?|prof\.?)\s/i.test(item))
          .filter((item) => !/trainer/i.test(item)),
      ),
    );

  const finish = async () => {
    setError("");
    setSubmitting(true);
    try {
      if (file && !timetableCaptured) {
        const upload = new FormData();
        upload.append("file", file);
        const response = await timetableService.upload(upload);
        const subjects = sanitizeSubjects(response.data?.subjects || []);
        setTimetableCaptured(true);
        if (subjects.length) {
          setParsedSubjects(subjects);
          setSelectedSubjects((current) => (current.length ? current : subjects));
          setSubmitting(false);
          return;
        }
      }
      if (profile.name || profile.roll_no || profile.department || profile.semester || profile.division || profile.batch || photo) {
        const formData = new FormData();
        Object.entries(profile).forEach(([key, value]) => formData.append(key, value));
        formData.append("selected_subjects", JSON.stringify(sanitizeSubjects(selectedSubjects)));
        if (photo) formData.append("profile_photo", photo);
        await userService.updateProfile(formData);
      }
      await refreshProfile();
      navigate("/");
    } catch (err) {
      const apiMessage = err?.response?.data?.error?.message;
      const fieldErrors = err?.response?.data?.error?.field_errors;
      const firstFieldError = fieldErrors ? normalizeError(Object.values(fieldErrors)[0]) : "";
      setError(firstFieldError || normalizeError(apiMessage) || err.message || "We couldn't finish onboarding just yet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
      <div className="w-full rounded-[36px] bg-white/85 p-8 shadow-card backdrop-blur-xl dark:bg-slate-900/80">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">Onboarding</p>
        <h1 className="mt-2 font-heading text-4xl">Let&apos;s set up your portal</h1>
        <div className="mt-6 flex gap-2">
          {[1, 2, 3].map((item) => <div key={item} className={`h-2 flex-1 rounded-full ${item <= step ? "bg-accent" : "bg-slate-200 dark:bg-slate-800"}`} />)}
        </div>
        {step === 1 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["name", "Full name"],
              ["roll_no", "Roll number"],
              ["department", "Department"],
              ["semester", "Semester"],
              ["division", "Division"],
              ["batch", "Batch (e.g. G13)"],
            ].map(([field, label]) => (
              <input
                key={field}
                placeholder={label}
                value={profile[field] || ""}
                className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 dark:bg-slate-800"
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    [field]: ["division", "batch"].includes(field) ? e.target.value.toUpperCase() : e.target.value,
                  })
                }
              />
            ))}
          </div>
        ) : null}
        {step === 2 ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-slate-500">Upload a profile photo so your StudentHub account feels personal from day one.</p>
            <input type="file" accept="image/*" className="block" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
          </div>
        ) : null}
        {step === 3 ? (
          <div className="mt-6 rounded-[28px] border-2 border-dashed border-sage/40 p-6">
            <p className="font-heading text-2xl">Upload your timetable</p>
            <p className="mt-2 text-sm text-slate-500">
              Upload an Excel timetable file in `.xlsx` format. We will use it to detect your subjects, and then you can confirm only the ones you actually study.
            </p>
            <input
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="mt-4 block"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null);
                setParsedSubjects([]);
                setSelectedSubjects([]);
                setTimetableCaptured(false);
              }}
            />
            <p className="mt-3 text-xs text-slate-400">Accepted format: Excel `.xlsx` timetable sheet.</p>
            {parsedSubjects.length ? (
              <div className="mt-6">
                <p className="font-heading text-lg">Select your actual subjects</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {parsedSubjects.map((subject) => (
                    <label key={subject} className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={(event) => setSelectedSubjects((current) => event.target.checked ? [...current, subject] : current.filter((item) => item !== subject))}
                      />
                      <span>{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {error ? <p className="mt-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}
        <div className="mt-8 flex justify-between">
          <button onClick={() => setStep((prev) => Math.max(1, prev - 1))} className="rounded-2xl bg-slate-100 px-5 py-3 dark:bg-slate-800">Back</button>
          {step < 3 ? <button onClick={() => setStep((prev) => prev + 1)} className="rounded-2xl bg-accent px-5 py-3 text-white">Continue</button> : <button onClick={finish} disabled={!canFinish || submitting} className="rounded-2xl bg-accent px-5 py-3 text-white disabled:opacity-50">{submitting ? "Finishing..." : "Finish"}</button>}
        </div>
      </div>
    </div>
  );
}
