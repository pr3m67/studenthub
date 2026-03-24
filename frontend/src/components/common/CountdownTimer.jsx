import { useEffect, useState } from "react";

function getCountdown(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    d: Math.floor(totalSeconds / 86400),
    h: Math.floor((totalSeconds % 86400) / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
  };
}

export default function CountdownTimer({ target }) {
  const [countdown, setCountdown] = useState(getCountdown(target));

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return <span className="font-mono text-xs text-slate-500">{countdown.d}d {countdown.h}h {countdown.m}m {countdown.s}s</span>;
}
