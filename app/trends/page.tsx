"use client";

import { EmptyState } from "@/components/empty-state";
import { useActivityStore } from "@/lib/store";

export default function TrendsPage() {
  const { activities, isLoaded } = useActivityStore();

  if (!isLoaded || activities.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Activity Trends
        </h1>
        <p className="text-slate-600">
          Track trending activities and emerging patterns in your group&apos;s
          preferences
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Trends Coming Soon
          </h3>
          <p className="text-slate-600">
            We&apos;re working on advanced trend analysis features to help you
            discover emerging patterns in your group&apos;s activity
            preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
