import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

export default function AttendanceDonut({ value = 0 }) {
  const data = [
    { name: "Present", value },
    { name: "Gap", value: Math.max(0, 100 - value) },
  ];
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Attendance Snapshot</p>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={58} outerRadius={78} dataKey="value">
              <Cell fill="#4CAF82" />
              <Cell fill="#E8DCC8" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="-mt-24 text-center font-heading text-3xl">{Math.round(value)}%</p>
    </div>
  );
}
