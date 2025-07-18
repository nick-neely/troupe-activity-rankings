"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useActivityStore } from "@/lib/store";
import { Heart, ThumbsUp, TrendingUp } from "lucide-react";

export function StatsCards() {
  const getTotalStats = useActivityStore((state) => state.getTotalStats);
  const isLoaded = useActivityStore((state) => state.isLoaded);
  const stats = getTotalStats();

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      name: "Total Activities",
      value: stats.totalActivities.toString(),
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      name: "Love Votes",
      value: stats.totalLoveVotes.toString(),
      icon: Heart,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
    {
      name: "Like Votes",
      value: stats.totalLikeVotes.toString(),
      icon: ThumbsUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      name: "Avg Score",
      value: stats.avgScore.toFixed(1),
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statItems.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.name}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1 font-mono">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
