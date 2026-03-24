import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", roll_no: "", department: "", semester: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (!form.name || !form.email || !form.password) {
        throw new Error("Name, university email, and password are required.");
      }
      if (!form.email.endsWith("@university.edu")) {
        throw new Error("Use an email ending with @university.edu.");
      }
      if (form.role === "teacher" && !form.email.startsWith("faculty.")) {
        throw new Error("Teacher sign-up uses a faculty email like faculty.name@university.edu.");
      }
      if (form.role === "student" && form.email.startsWith("faculty.")) {
        throw new Error("Student sign-up cannot use a faculty-prefixed email.");
      }
      await register(form);
      navigate("/onboarding");
    } catch (err) {
      const apiMessage = err?.response?.data?.error?.message;
      const fieldErrors = err?.response?.data?.error?.field_errors;
      const firstFieldError = fieldErrors ? Object.values(fieldErrors).flat()?.[0] : "";
      setError(firstFieldError || apiMessage || err.message || "Unable to register right now. Check whether the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-card backdrop-blur-2xl dark:bg-slate-900/80">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-500">StudentHub</p>
        <h1 className="mt-3 font-heading text-4xl">Create your campus account</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-500">
          Students and teachers use separate role sign-ins. Student emails use the normal university format, while teacher accounts use a faculty email like <span className="font-medium text-slate-700">faculty.name@university.edu</span>.
        </p>
        <div className="mt-6 inline-flex rounded-full bg-[#F4F5F7] p-1 shadow-inner dark:bg-slate-800">
          {[
            ["student", "Student"],
            ["teacher", "Teacher"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => updateField("role", value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${form.role === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["name", "Full name"],
            ["email", "University email"],
            ["password", "Password"],
            ["roll_no", "Roll number"],
            ["department", "Department"],
            ["semester", "Semester"],
          ].map(([key, label]) => (
            <input
              key={key}
              type={key === "password" ? "password" : key === "email" ? "email" : "text"}
              className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 dark:bg-slate-800"
              placeholder={key === "email" && form.role === "teacher" ? "faculty.name@university.edu" : label}
              value={form[key]}
              onChange={(e) => updateField(key, e.target.value)}
            />
          ))}
        </div>
        {error ? <p className="mt-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}
        <button type="submit" disabled={submitting} className="mt-6 rounded-2xl bg-[#111827] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? "Creating account..." : "Register"}
        </button>
        <p className="mt-4 text-sm text-slate-500">Already registered? <Link to="/login" className="text-accent">Sign in</Link></p>
      </form>
    </div>
  );
}
