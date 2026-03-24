import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-heading text-6xl">404</p>
      <p className="text-slate-500">The page you requested drifted out of the campus map.</p>
      <Link to="/" className="rounded-2xl bg-accent px-5 py-3 text-white">Back to dashboard</Link>
    </div>
  );
}
