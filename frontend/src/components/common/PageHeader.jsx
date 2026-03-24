import { motion } from "framer-motion";

export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[32px] bg-hero p-6 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
        </div>
        {actions}
      </div>
    </motion.div>
  );
}
