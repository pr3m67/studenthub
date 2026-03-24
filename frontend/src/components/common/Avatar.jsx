import { initials } from "../../utils/format";

export default function Avatar({ name, src }) {
  if (src) {
    return <img src={src} alt={name} className="h-11 w-11 rounded-2xl object-cover shadow-card" />;
  }
  return <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent font-heading text-sm text-white shadow-card">{initials(name)}</div>;
}
