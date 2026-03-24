import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../components/common/PageHeader";
import DriveCard from "../components/placement/DriveCard";
import PlacementStats from "../components/placement/PlacementStats";
import ProfileCompletion from "../components/placement/ProfileCompletion";
import ResumeUploader from "../components/placement/ResumeUploader";
import { useAuth } from "../context/AuthContext";
import { placementService } from "../services/api";

export default function PlacementPage() {
  const { user, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const drives = useQuery({ queryKey: ["placement-drives"], queryFn: () => placementService.all() });
  const toggle = useMutation({ mutationFn: placementService.toggleInterest, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["placement-drives"] }) });
  const upload = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return placementService.uploadResume(formData);
    },
    onSuccess: () => refreshProfile(),
  });
  const items = drives.data?.data?.data || [];
  return (
    <div className="page-shell">
      <PageHeader eyebrow="Placements" title="Internships and drives" subtitle="Track company drives, keep your resume synced in GridFS, and monitor placement readiness." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {items.map((drive) => <DriveCard key={drive.id} drive={drive} onToggle={(id) => toggle.mutate(id)} />)}
        </div>
        <div className="space-y-6">
          <ProfileCompletion user={user} />
          <ResumeUploader onUpload={(file) => upload.mutate(file)} />
          <PlacementStats drives={items} />
        </div>
      </div>
    </div>
  );
}
