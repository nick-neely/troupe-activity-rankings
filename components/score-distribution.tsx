"use client";

import { useActivityStore } from "@/lib/store";
import { TrendingUp } from "lucide-react";

export function ScoreDistribution() {
  const getScoreDistribution = useActivityStore(
    (state) => state.getScoreDistribution
  );
  const distribution = getScoreDistribution();

  const colors = [
    "from-green-500 to-green-600",
    "from-blue-500 to-blue-600",
    "from-yellow-500 to-yellow-600",
    "from-orange-500 to-orange-600",
    "from-red-500 to-red-600",
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-2xl">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Score Distribution</h3>
          <p className="text-sm text-slate-600">Activity performance spread</p>
        </div>
      </div>

      <div className="space-y-3">
        {distribution.map((range, index) => (
          <div key={range.range} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{range.range}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium font-mono">
                  {range.count}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  ({range.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${
                  colors[index % colors.length]
                }`}
                style={{ width: `${range.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
