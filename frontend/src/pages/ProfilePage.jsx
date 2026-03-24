import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Avatar from "../components/common/Avatar";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/api";

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [projects, setProjects] = useState(user?.projects?.join(", ") || "");

  const save = async () => {
    const formData = new FormData();
    formData.append("skills", JSON.stringify(skills.split(",").map((item) => item.trim()).filter(Boolean)));
    formData.append("projects", JSON.stringify(projects.split(",").map((item) => item.trim()).filter(Boolean)));
    await userService.updateProfile(formData);
    await refreshProfile();
  };

  return (
    <div className="page-shell">
      <PageHeader eyebrow="Profile" title="Your student identity" subtitle="Keep your personal record polished for clubs, placements, and campus communication." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-card card-pad">
          <Avatar name={user?.name} src={user?.profile_pic} />
          <p className="mt-4 font-heading text-2xl">{user?.name}</p>
          <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
          <p className="mt-1 text-sm text-slate-500">{user?.department} • Semester {user?.semester}</p>
          <div className="mt-5 h-3 rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-success" style={{ width: `${user?.profile_completeness || 0}%` }} />
          </div>
        </div>
        <div className="glass-card card-pad">
          <p className="font-heading text-xl">Skills & Projects</p>
          <textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={4} className="mt-4 w-full rounded-3xl bg-slate-100 px-4 py-4 dark:bg-slate-800" placeholder="Comma-separated skills" />
          <textarea value={projects} onChange={(e) => setProjects(e.target.value)} rows={4} className="mt-4 w-full rounded-3xl bg-slate-100 px-4 py-4 dark:bg-slate-800" placeholder="Comma-separated projects" />
          <button onClick={save} className="mt-4 rounded-2xl bg-accent px-5 py-3 text-white">Save profile</button>
        </div>
      </div>
    </div>
  );
}
