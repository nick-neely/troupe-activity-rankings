"use client";

import { useActivityStore } from "@/lib/store";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

/**
 * Renders a bar chart showing the distribution of activity scores.
 */
export function VoteDistributionChart() {
  // Get voting patterns for vote distribution chart
  const getVotingPatterns = useActivityStore(
    (state) => state.getVotingPatterns
  );
  const { lovePercentage, likePercentage, passPercentage } =
    getVotingPatterns();
  const data = [
    { name: "Love", value: lovePercentage },
    { name: "Like", value: likePercentage },
    { name: "Pass", value: passPercentage },
  ];
  const COLORS = ["#ec4899", "#10b981", "#6b7280"];

  // Custom label renderer for outside labels with connector lines
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    name: string;
    value: number;
    index: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 24;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? "start" : "end";
    const color = COLORS[index % COLORS.length];
    // Connector line points
    const lineRadius = outerRadius + 8;
    const lineX = cx + lineRadius * Math.cos(-midAngle * RADIAN);
    const lineY = cy + lineRadius * Math.sin(-midAngle * RADIAN);
    return (
      <g>
        {/* Connector line */}
        <line
          x1={lineX}
          y1={lineY}
          x2={x}
          y2={y}
          stroke={color}
          strokeWidth={1}
        />
        {/* Label text */}
        <text
          x={x}
          y={y}
          fill={color}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize={14}
        >
          {`${name} (${value.toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 my-10">
      <h2 className="text-xl font-semibold text-slate-900 mb-10">
        Vote Distribution
      </h2>
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={renderCustomLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
