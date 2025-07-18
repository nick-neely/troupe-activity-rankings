"use client";

import { AdminChangePasswordForm } from "@/components/admin-change-password";
import { CategoryIconManager } from "@/components/category-icon-manager";
import { useActivities } from "@/hooks/use-activities";
import { useActivityStore } from "@/lib/store";
import { BarChart3, Database, Download } from "lucide-react";
import Link from "next/link";

/**
 * Displays and manages activity data, including statistics, export functionality, and password management.
 *
 * Renders loading and empty states as appropriate. When activity data is available, shows summary statistics, provides a CSV export option, and includes a password change form.
 */
export function DataManagement() {
  const { data: activities, isLoading } = useActivities(true);
  const { getTotalStats } = useActivityStore();

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-3 bg-slate-50 rounded-2xl">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Data Management
        </h3>
        <div className="text-center py-8">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No activity data found</p>
          <p className="text-sm text-gray-400">
            Upload a CSV file to get started
          </p>
        </div>
      </div>
    );
  }

  const stats = getTotalStats();

  const handleExportData = () => {
    if (activities.length === 0) return;

    const csvContent = [
      "name,category,price,love_votes,like_votes,pass_votes,score,groupNames,website_link,google_maps_url",
      ...activities.map(
        (activity) =>
          `"${activity.name}","${activity.category}","${activity.price}",${
            activity.love_votes
          },${activity.like_votes},${activity.pass_votes},${activity.score},"${
            activity.groupNames || ""
          }","${activity.website_link || ""}","${
            activity.google_maps_url || ""
          }"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `troupe-activities-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Data Management
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-bold text-slate-900">
            {stats.totalActivities}
          </div>
          <div className="text-sm text-slate-600">Activities</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-bold text-pink-600">
            {stats.totalLoveVotes}
          </div>
          <div className="text-sm text-slate-600">Love Votes</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-bold text-green-600">
            {stats.totalLikeVotes}
          </div>
          <div className="text-sm text-slate-600">Like Votes</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-bold text-slate-900">
            {stats.avgScore.toFixed(1)}
          </div>
          <div className="text-sm text-slate-600">Avg Score</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-medium hover:shadow-lg transition-all duration-200"
        >
          <BarChart3 className="w-4 h-4" />
          View Dashboard
        </Link>

        <button
          onClick={handleExportData}
          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-2xl text-sm font-medium hover:bg-slate-200 transition-colors duration-200"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="mt-8 space-y-6">
        <CategoryIconManager />
        <AdminChangePasswordForm />
      </div>
    </div>
  );
}
