import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";

export default function PlacementStats({ drives = [] }) {
  const placed = Math.min(100, drives.length * 12);
  const data = [{ name: "Placed", value: placed }, { name: "Remaining", value: 100 - placed }];
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Placement Stats</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
              <Cell fill="#2D3A3A" />
              <Cell fill="#E8DCC8" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="-mt-20 text-center font-heading text-3xl">{placed}%</p>
    </div>
  );
}
