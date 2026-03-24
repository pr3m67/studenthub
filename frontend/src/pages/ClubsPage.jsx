import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import ClubCard from "../components/clubs/ClubCard";
import ClubFeed from "../components/clubs/ClubFeed";
import FixtureCard from "../components/clubs/FixtureCard";
import { clubsService } from "../services/api";

export default function ClubsPage() {
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();
  const clubs = useQuery({ queryKey: ["clubs"], queryFn: () => clubsService.all() });
  const posts = useQuery({ queryKey: ["club-posts", selected], queryFn: () => selected ? clubsService.posts(selected) : Promise.resolve({ data: { data: [] } }), enabled: Boolean(selected) });
  const join = useMutation({
    mutationFn: clubsService.join,
    onSuccess: (_, id) => {
      setSelected(id);
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      queryClient.invalidateQueries({ queryKey: ["club-posts", id] });
    },
  });
  const items = clubs.data?.data?.data || [];
  return (
    <div className="page-shell">
      <PageHeader eyebrow="Societies" title="Clubs and communities" subtitle="Explore clubs, join with optimistic actions, and follow the latest posts from communities across campus." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((club) => <div key={club.id} onClick={() => setSelected(club.id)}><ClubCard club={club} onToggle={(id) => join.mutate(id)} /></div>)}
        </div>
        <div className="space-y-4">
          <FixtureCard />
          <ClubFeed posts={posts.data?.data?.data || []} />
        </div>
      </div>
    </div>
  );
}
