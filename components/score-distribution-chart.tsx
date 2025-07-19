"use client";

import { useActivityStore } from "@/lib/store";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Renders a bar chart showing the distribution of activity scores.
 */
export function ScoreDistributionChart() {
  const getScoreDistribution = useActivityStore(
    (state) => state.getScoreDistribution
  );
  const data = getScoreDistribution().map((d) => ({
    name: d.range,
    count: d.count,
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 my-10">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Score Distribution
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        >
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
