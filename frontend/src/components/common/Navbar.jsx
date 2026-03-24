import { Bell, MoonStar, Search, SunMedium } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notices/NotificationBell";
import Avatar from "./Avatar";

export default function Navbar() {
  const { toggleTheme, theme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="glass-card flex items-center gap-3 px-4 py-3">
      <div className="flex flex-1 items-center gap-3 rounded-2xl bg-slate-100/80 px-4 py-3 dark:bg-slate-800/80">
        <Search size={18} className="text-slate-500" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search notices, clubs, events..." />
      </div>
      <NotificationBell />
      <button onClick={toggleTheme} className="rounded-2xl bg-slate-100 p-3 transition hover:scale-105 dark:bg-slate-800">
        {theme === "dark" ? <SunMedium size={18} /> : <MoonStar size={18} />}
      </button>
      <Avatar name={user?.name} src={user?.profile_pic} />
    </div>
  );
}
