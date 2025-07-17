"use client";

import { useActivityStore } from "@/lib/store";
import { BarChart3 } from "lucide-react";

export function VotingPatterns() {
  const getVotingPatterns = useActivityStore(
    (state) => state.getVotingPatterns
  );
  const patterns = getVotingPatterns();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-2xl">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Voting Patterns</h3>
          <p className="text-sm text-slate-600">Group engagement overview</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-slate-900 font-mono">
            {patterns.totalVotes}
          </div>
          <div className="text-sm text-slate-600">Total Votes Cast</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">❤️ Love</span>
            <span className="text-sm font-medium font-mono">
              {patterns.lovePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-600"
              style={{ width: `${patterns.lovePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">👍 Like</span>
            <span className="text-sm font-medium font-mono">
              {patterns.likePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
              style={{ width: `${patterns.likePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">👎 Pass</span>
            <span className="text-sm font-medium font-mono">
              {patterns.passPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-slate-400 to-slate-500"
              style={{ width: `${patterns.passPercentage}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600 font-mono">
              {patterns.engagementScore.toFixed(1)}
            </div>
            <div className="text-xs text-slate-600">Avg votes per activity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
