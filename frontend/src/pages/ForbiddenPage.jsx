import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-heading text-6xl">403</p>
      <p className="text-slate-500">This area needs a different role or permission set.</p>
      <Link to="/" className="rounded-2xl bg-accent px-5 py-3 text-white">Go home</Link>
    </div>
  );
}
