export default function SkeletonCard({ className = "" }) {
  return <div className={`glass-card animate-pulse bg-slate-200/60 dark:bg-slate-800/60 ${className}`} />;
}
