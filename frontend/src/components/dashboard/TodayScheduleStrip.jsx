import DayStrip from "../timetable/DayStrip";

export default function TodayScheduleStrip({ entries = [] }) {
  return <DayStrip entries={entries} compact />;
}
