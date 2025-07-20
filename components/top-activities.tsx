"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useActivityStore } from "@/lib/store";
import { Heart, Star, ThumbsUp } from "lucide-react";

export function TopActivities() {
  const getTopActivities = useActivityStore((state) => state.getTopActivities);
  const isLoaded = useActivityStore((state) => state.isLoaded);
  const topActivities = getTopActivities(8);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Top Activities
      </h2>
      <div className="space-y-4">
        {!isLoaded
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-2xl gap-3"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="w-8 h-8 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-8" />
                </div>
              </div>
            ))
          : topActivities.map((activity, index) => (
              <div
                key={activity.name}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 rounded-2xl gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 min-w-8 min-h-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold font-mono">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {activity.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {activity.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="flex items-center gap-1 text-pink-600">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono">
                      {activity.love_votes}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono">
                      {activity.like_votes}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4" />
                    <span className="text-lg font-bold font-mono text-slate-900">
                      {activity.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
