"use client";

import { ActivitiesTable } from "@/components/activities-table";
import { CategoryChart } from "@/components/category-chart";
import { EmptyState } from "@/components/empty-state";
import { StatsCards } from "@/components/stats-cards";
import { TopActivities } from "@/components/top-activities";
import { useActivityStore } from "@/lib/store";

export default function Dashboard() {
  const { activities, isLoaded } = useActivityStore();

  if (!isLoaded || activities.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Trip Activity Dashboard
        </h1>
        <p className="text-slate-600">
          Analyze your group&apos;s activity preferences and make data-driven
          decisions
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Top Section: Top Activities and Category Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TopActivities />
        </div>
        <div className="lg:col-span-1">
          <CategoryChart />
        </div>
      </div>

      {/* Full Activities Table */}
      <div className="space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              All Activities
            </h2>
            <p className="text-slate-600">
              Complete list with sorting and filtering capabilities
            </p>
          </div>
          <div className="text-sm text-slate-500">
            <span className="font-mono">{activities.length}</span> total
            activities
          </div>
        </div>
        <ActivitiesTable />
      </div>
    </div>
  );
}
