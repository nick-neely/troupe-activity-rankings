"use client";

import {
  BarChart3,
  Calendar,
  Heart,
  LayoutDashboard,
  MapPin,
  Menu,
  Settings,
  Star,
  TrendingUp,
  Upload,
  User,
  Users,
} from "lucide-react";
import React from "react";

// Mock navigation items
const publicItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Trends", url: "/trends", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItems = [{ title: "Upload Data", url: "/admin", icon: Upload }];

// Mock sidebar component
function MockSidebar() {
  const allItems = [
    ...publicItems.slice(0, 1),
    ...adminItems,
    ...publicItems.slice(1),
  ];

  return (
    <div className="w-64 bg-slate-100 border-r border-slate-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h1 className="text-xl font-bold">Troupe Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">Trip Activity Analytics</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Application
          </p>
          {allItems.map((item, index) => {
            const isActive = index === 2; // Mock "Trends" as active
            return (
              <div
                key={item.title}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="w-4 h-4" />
          <span>Admin Login</span>
        </div>
        <span className="text-xs text-slate-500">
          © {new Date().getFullYear()} Nick Neely
        </span>
      </div>
    </div>
  );
}

// Mock data for preview
const mockStats = [
  { label: "Total Activities", value: "48", icon: Calendar },
  { label: "Average Rating", value: "4.2", icon: Star },
  { label: "Participants", value: "12", icon: Users },
  { label: "Favorites", value: "8", icon: Heart },
];

const mockActivities = [
  {
    name: "Hiking Trail Explorer",
    category: "Outdoor",
    rating: 4.8,
    votes: 15,
  },
  { name: "Local Food Tour", category: "Food", rating: 4.6, votes: 12 },
  { name: "Museum Visit", category: "Culture", rating: 4.3, votes: 8 },
  { name: "Beach Day", category: "Outdoor", rating: 4.9, votes: 18 },
  {
    name: "City Walking Tour",
    category: "Sightseeing",
    rating: 4.4,
    votes: 10,
  },
];

/**
 * A mock version of the dashboard layout that renders underneath the unlock overlay
 * to provide an authentic glassmorphism effect while maintaining security.
 */
export function MockDashboardLayout() {
  return (
    <div className="h-screen w-full overflow-hidden flex">
      <MockSidebar />
      <main className="flex-1 min-h-screen bg-slate-100">
        <div className="m-4 bg-white rounded-xl shadow-lg border border-slate-200">
          <div className="p-6">
            <div className="mb-6">
              <button className="h-8 w-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center">
                <Menu className="h-4 w-4" />
              </button>
            </div>

            {/* Mock Dashboard Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Trip Activity Dashboard
                </h1>
                <p className="text-slate-600">
                  Analyze your group&apos;s activity preferences and make
                  data-driven decisions
                </p>
              </div>

              {/* Mock Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {stat.value}
                        </p>
                      </div>
                      <stat.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Mock Top Activities */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <h2 className="text-xl font-semibold text-slate-900">
                        Top Activities
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {mockActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {activity.name}
                              </p>
                              <p className="text-sm text-slate-600">
                                {activity.category}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-medium">
                                {activity.rating}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">
                              {activity.votes} votes
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mock Category Chart */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h2 className="text-xl font-semibold text-slate-900">
                        Categories
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Outdoor", count: 18, color: "bg-green-500" },
                        { name: "Food", count: 12, color: "bg-orange-500" },
                        { name: "Culture", count: 8, color: "bg-purple-500" },
                        {
                          name: "Sightseeing",
                          count: 10,
                          color: "bg-blue-500",
                        },
                      ].map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-slate-600">
                              {category.count}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${category.color}`}
                              style={{
                                width: `${(category.count / 18) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Activities Table */}
              <div className="space-y-4">
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
                    <span className="font-mono">48</span> total activities
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Activity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Votes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {mockActivities.map((activity, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                <span className="font-medium text-slate-900">
                                  {activity.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {activity.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="font-medium">
                                  {activity.rating}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                              {activity.votes}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
