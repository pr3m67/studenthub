import { CalendarDays, ClipboardCheck, GraduationCap, LayoutDashboard, Megaphone, NotebookPen, PartyPopper, UserCircle2, Users, BriefcaseBusiness } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/timetable", icon: CalendarDays, label: "Timetable" },
  { to: "/attendance", icon: ClipboardCheck, label: "Attendance" },
  { to: "/results", icon: GraduationCap, label: "Results" },
  { to: "/events", icon: PartyPopper, label: "Events" },
  { to: "/clubs", icon: Users, label: "Clubs" },
  { to: "/notices", icon: Megaphone, label: "Notices" },
  { to: "/studytools", icon: NotebookPen, label: "Study Tools" },
  { to: "/placement", icon: BriefcaseBusiness, label: "Placement" },
  { to: "/profile", icon: UserCircle2, label: "Profile" },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen border-r border-black/5 bg-white/70 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 md:block">
      <div className="rounded-3xl bg-hero p-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">StudentHub</p>
        <h1 className="mt-2 font-heading text-3xl text-primary dark:text-slate-100">Campus, organized.</h1>
      </div>
      <nav className="mt-8 space-y-2">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-accent text-white shadow-card" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
