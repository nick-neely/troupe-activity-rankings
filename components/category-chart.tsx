"use client";

import { useActivityStore } from "@/lib/store";

export function CategoryChart() {
  const getCategoryStats = useActivityStore((state) => state.getCategoryStats);
  const categoryData = getCategoryStats();

  const maxScore = Math.max(...categoryData.map((d) => d.avgScore), 1);

  const colors = [
    "from-indigo-500 to-indigo-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-yellow-500 to-yellow-600",
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Category Performance
      </h2>
      <div className="space-y-4">
        {categoryData.map((item, index) => (
          <div key={item.category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-700">
                {item.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 font-mono">
                  {item.count} activities
                </span>
                <span className="text-sm font-semibold text-slate-900 font-mono">
                  {item.avgScore.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${
                  colors[index % colors.length]
                }`}
                style={{ width: `${(item.avgScore / maxScore) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
