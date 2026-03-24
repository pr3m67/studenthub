import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      const apiMessage = err?.response?.data?.error?.message;
      setError(apiMessage || err.message || "Unable to sign in right now. Check whether the backend is reachable.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-card backdrop-blur-2xl dark:bg-slate-900/80">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-500">StudentHub</p>
        <h1 className="mt-3 font-heading text-4xl">Welcome back</h1>
        <p className="mt-3 text-sm text-slate-500">Pick your role before you sign in so student and teacher portals stay separated.</p>
        <div className="mt-5 inline-flex rounded-full bg-[#F4F5F7] p-1 shadow-inner dark:bg-slate-800">
          {[
            ["student", "Student"],
            ["teacher", "Teacher"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm((current) => ({ ...current, role: value }))}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${form.role === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <input className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 dark:bg-slate-800" placeholder={form.role === "teacher" ? "faculty.name@university.edu" : "University email"} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 dark:bg-slate-800" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p> : null}
          <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-[#111827] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Signing in..." : "Login"}
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-500">New here? <Link to="/register" className="text-accent">Create account</Link></p>
      </form>
    </div>
  );
}
