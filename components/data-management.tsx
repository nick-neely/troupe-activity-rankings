"use client"

import { useActivityStore } from "@/lib/store"
import { Trash2, Download, BarChart3 } from "lucide-react"
import Link from "next/link"

export function DataManagement() {
  const { activities, isLoaded, clearActivities, getTotalStats } = useActivityStore()
  const stats = getTotalStats()

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all activity data? This action cannot be undone.")) {
      clearActivities()
    }
  }

  const handleExportData = () => {
    if (activities.length === 0) return

    const csvContent = [
      "name,category,price,love_votes,like_votes,pass_votes,score",
      ...activities.map(
        (activity) =>
          `"${activity.name}","${activity.category}","${activity.price}",${activity.love_votes},${activity.like_votes},${activity.pass_votes},${activity.score}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `troupe-activities-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isLoaded || activities.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Data</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-bold text-slate-900">{stats.totalActivities}</div>
          <div className="text-sm text-slate-600">Activities</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-bold text-pink-600">{stats.totalLoveVotes}</div>
          <div className="text-sm text-slate-600">Love Votes</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-bold text-green-600">{stats.totalLikeVotes}</div>
          <div className="text-sm text-slate-600">Like Votes</div>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-bold text-slate-900">{stats.avgScore.toFixed(1)}</div>
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

        <button
          onClick={handleClearData}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-2xl text-sm font-medium hover:bg-red-100 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Clear Data
        </button>
      </div>
    </div>
  )
}
