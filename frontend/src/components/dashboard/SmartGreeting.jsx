import { useAuth } from "../../context/AuthContext";

export default function SmartGreeting({ classesToday = 0, nextClass }) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-3xl">{greeting}, {user?.name?.split(" ")[0] || "Student"}!</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        You have {classesToday} classes today.{nextClass ? ` Next: ${nextClass.subject} at ${nextClass.start_time}.` : " Enjoy the breathing room."}
      </p>
    </div>
  );
}
