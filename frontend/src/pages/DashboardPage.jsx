import { useQuery } from "@tanstack/react-query";
import { attendanceService, eventsService, noticesService, resultsService, studytoolsService, timetableService, weatherService } from "../services/api";
import SmartGreeting from "../components/dashboard/SmartGreeting";
import TodayScheduleStrip from "../components/dashboard/TodayScheduleStrip";
import AttendanceDonut from "../components/dashboard/AttendanceDonut";
import UpcomingEventsWidget from "../components/dashboard/UpcomingEventsWidget";
import NoticesWidget from "../components/dashboard/NoticesWidget";
import AcademicSnapshot from "../components/dashboard/AcademicSnapshot";
import WeatherWidget from "../components/dashboard/WeatherWidget";
import DeadlineWidget from "../components/dashboard/DeadlineWidget";

export default function DashboardPage() {
  const today = useQuery({ queryKey: ["today"], queryFn: () => timetableService.today() });
  const attendance = useQuery({ queryKey: ["attendance-summary"], queryFn: () => attendanceService.summary() });
  const events = useQuery({ queryKey: ["events-mini"], queryFn: () => eventsService.all({ page: 1 }) });
  const notices = useQuery({ queryKey: ["notices-mini"], queryFn: () => noticesService.all({ page: 1 }) });
  const cgpa = useQuery({ queryKey: ["cgpa"], queryFn: () => resultsService.cgpa() });
  const tasks = useQuery({ queryKey: ["tasks-mini"], queryFn: () => studytoolsService.tasks() });
  const weather = useQuery({ queryKey: ["weather"], queryFn: () => weatherService.campus() });

  const todayEntries = today.data?.data?.data || [];
  const attendanceItems = attendance.data?.data?.data || [];
  const overall = attendanceItems.length ? attendanceItems.reduce((sum, item) => sum + item.percentage, 0) / attendanceItems.length : 0;

  return (
    <div className="page-shell">
      <SmartGreeting classesToday={todayEntries.length} nextClass={todayEntries[0]} />
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <TodayScheduleStrip entries={todayEntries} />
        <AttendanceDonut value={overall} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <UpcomingEventsWidget events={events.data?.data?.data || []} />
        <NoticesWidget notices={notices.data?.data?.data || []} />
        <AcademicSnapshot cgpa={cgpa.data?.data?.data?.cgpa || 0} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <WeatherWidget temp={weather.data?.data?.data?.temp} condition={weather.data?.data?.data?.condition} />
        <DeadlineWidget tasks={tasks.data?.data?.data || []} />
      </div>
    </div>
  );
}
