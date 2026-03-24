import { useEffect, useState } from "react";

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setSeconds((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [running]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  const adjustMinutes = (delta) => {
    setSeconds((current) => Math.max(5 * 60, current + delta * 60));
    setRunning(false);
  };

  return (
    <div className="glass-card card-pad text-center">
      <p className="font-heading text-xl">Pomodoro</p>
      <p className="mt-4 font-heading text-6xl">{minutes}:{remainder}</p>
      <div className="mt-4 flex justify-center gap-3">
        <button onClick={() => adjustMinutes(-5)} className="rounded-full bg-slate-100 px-4 py-2 text-xl dark:bg-slate-800">-</button>
        <button onClick={() => adjustMinutes(5)} className="rounded-full bg-slate-100 px-4 py-2 text-xl dark:bg-slate-800">+</button>
      </div>
      <div className="mt-5 flex justify-center gap-3">
        <button onClick={() => setRunning((prev) => !prev)} className="rounded-2xl bg-accent px-5 py-3 text-white">{running ? "Pause" : "Start"}</button>
        <button onClick={() => { setSeconds(25 * 60); setRunning(false); }} className="rounded-2xl bg-slate-100 px-5 py-3 dark:bg-slate-800">Reset</button>
      </div>
    </div>
  );
}
