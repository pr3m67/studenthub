import { motion } from "framer-motion";
import ProgressRing from "../common/ProgressRing";

export default function TimetableCard({ entry, attendance = 78, compact = false, highlight = false }) {
  const tone = attendance >= 75 ? "#4CAF82" : attendance >= 60 ? "#E8A838" : "#E05C5C";
  const cardHeight = compact ? "min-h-[220px]" : "min-h-[280px]";
  return (
    <motion.div whileHover={{ rotateY: 180 }} transition={{ duration: 0.6 }} className={`relative ${cardHeight} [transform-style:preserve-3d]`}>
      <div className={`glass-card absolute inset-0 overflow-hidden card-pad [backface-visibility:hidden] ${highlight ? "ring-2 ring-success animate-pulseGlow" : ""}`} style={{ borderTop: `6px solid ${entry.color_tag}` }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading text-2xl">{entry.subject}</p>
            <p className="mt-2 text-sm text-slate-500">{entry.teacher}</p>
          </div>
          {entry.batch_group ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{entry.batch_group}</span> : null}
        </div>
        <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-accent">{entry.start_time} - {entry.end_time}</div>
        <p className="mt-5 text-sm">Venue: {entry.venue}</p>
        {entry.source_type === "custom" ? <p className="mt-3 text-xs font-semibold text-sage">Custom class</p> : null}
        {entry.raw_text ? <p className="mt-4 line-clamp-3 text-xs text-slate-400">{entry.raw_text}</p> : null}
      </div>
      <div className="glass-card absolute inset-0 flex flex-col items-center justify-center gap-4 card-pad [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <p className="font-heading text-lg">{entry.subject}</p>
        <ProgressRing value={attendance} color={tone} label="attendance" />
        <p className="text-center text-xs text-slate-500">{attendance >= 75 ? "Safe. You have buffer." : attendance >= 60 ? "Attend a few more to recover." : "Detained risk. Prioritize this subject."}</p>
      </div>
    </motion.div>
  );
}
