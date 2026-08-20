import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const statusConfig = {
  approved: { label: "Live", color: "#22c55e" },
  pending: { label: "Pending Review", color: "#eab308" },
  rejected: { label: "Rejected", color: "#ef4444" },
};

function getCourseStatusData(courses) {
  const counts = courses.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusConfig).map(([key, cfg]) => ({
    name: cfg.label,
    value: counts[key] || 0,
    color: cfg.color,
  }));
}

const CoursesGraph = ({ courses = [] }) => {
  const data = getCourseStatusData(courses);
  const total = data.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
      <div className="relative shrink-0">
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-sm text-gray-500">Courses</span>
        </div>
      </div>

      <div className="w-full sm:w-auto space-y-3">
        {data.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="w-28 sm:w-32">{c.name}</span>
            <span className="text-gray-500 whitespace-nowrap">
              {c.value} ({total ? ((c.value / total) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesGraph;