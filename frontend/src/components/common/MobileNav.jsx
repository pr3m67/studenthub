import { Home, CalendarDays, ClipboardCheck, GraduationCap, NotebookPen } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/timetable", icon: CalendarDays, label: "Time" },
  { to: "/attendance", icon: ClipboardCheck, label: "Attend" },
  { to: "/results", icon: GraduationCap, label: "Results" },
  { to: "/studytools", icon: NotebookPen, label: "Tools" },
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 rounded-3xl bg-accent p-2 shadow-card md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] ${isActive ? "bg-white text-accent" : "text-white/75"}`}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
