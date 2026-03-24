import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#2D3A3A", "#7C9A92", "#E8DCC8", "#4CAF82", "#E8A838", "#E05C5C"];

export default function GradeDistribution({ subjects = [] }) {
  const counts = subjects.reduce((acc, item) => {
    acc[item.grade] = (acc[item.grade] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts).map(([grade, value]) => ({ grade, value }));
  return (
    <div className="glass-card card-pad">
      <p className="font-heading text-xl">Grade Distribution</p>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="grade" outerRadius={100}>
              {data.map((item, index) => <Cell key={item.grade} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
