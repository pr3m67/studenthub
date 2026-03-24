import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import CategoryTabs from "../components/events/CategoryTabs";
import EventCalendar from "../components/events/EventCalendar";
import EventCard from "../components/events/EventCard";
import EventModal from "../components/events/EventModal";
import { useAuth } from "../context/AuthContext";
import { eventsService } from "../services/api";

const categories = ["All", "Academic", "Sports", "Cultural", "Technical", "Fest", "Workshop"];

export default function EventsPage() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Academic", date: "", venue: "", description: "" });
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const events = useQuery({ queryKey: ["events", category], queryFn: () => eventsService.all(category === "All" ? {} : { category }) });
  const refetchList = () => queryClient.invalidateQueries({ queryKey: ["events"] });
  const interested = useMutation({ mutationFn: eventsService.toggleInterested, onSuccess: refetchList });
  const going = useMutation({ mutationFn: eventsService.toggleGoing, onSuccess: refetchList });
  const createEvent = useMutation({ mutationFn: eventsService.create, onSuccess: () => { refetchList(); setForm({ title: "", category: "Academic", date: "", venue: "", description: "" }); } });
  const items = events.data?.data?.data || [];
  return (
    <div className="page-shell">
      <PageHeader eyebrow="Campus Life" title="Events and college affairs" subtitle="Browse upcoming campus events, filter by category, and track countdowns to what matters next." />
      <CategoryTabs categories={categories} active={category} onChange={setCategory} />
      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((event) => <EventCard key={event.id} event={event} onOpen={setSelected} onInterested={(id) => interested.mutate(id)} onGoing={(id) => going.mutate(id)} />)}
      </div>
      {user?.role === "admin" ? (
        <div className="glass-card apple-panel card-pad">
          <p className="font-heading text-xl">Admin Event Composer</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" placeholder="Event title" />
            <input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" />
            <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800" placeholder="Venue" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
              {categories.filter((item) => item !== "All").map((item) => <option key={item}>{item}</option>)}
            </select>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-3xl bg-slate-100 px-4 py-4 dark:bg-slate-800 md:col-span-2" rows={4} placeholder="Description" />
          </div>
          <button onClick={() => createEvent.mutate(form)} className="mt-4 rounded-2xl bg-accent px-5 py-3 text-white">Create event</button>
        </div>
      ) : null}
      <EventCalendar events={items} />
      <EventModal open={Boolean(selected)} event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
