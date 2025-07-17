"use client";

import { useActivityStore } from "@/lib/store";
import { CheckCircle } from "lucide-react";

export function ConsensusBuilder() {
  const getGroupDynamics = useActivityStore((state) => state.getGroupDynamics);
  const dynamics = getGroupDynamics();

  const consensusScore = dynamics.consensus.length;
  const controversialScore = dynamics.controversial.length;
  const totalActivities = useActivityStore((state) => state.activities.length);

  const consensusPercentage =
    totalActivities > 0 ? (consensusScore / totalActivities) * 100 : 0;
  const healthScore = Math.max(
    0,
    100 - (controversialScore / Math.max(totalActivities, 1)) * 100
  );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Consensus Health</h3>
          <p className="text-sm text-slate-600">Group agreement level</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 font-mono">
            {healthScore.toFixed(0)}%
          </div>
          <div className="text-sm text-slate-600">Agreement Score</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Consensus Activities</span>
            <span className="font-medium font-mono">{consensusScore}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Controversial Activities</span>
            <span className="font-medium font-mono">{controversialScore}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-600 text-center font-mono">
            {consensusPercentage.toFixed(1)}% of activities have group consensus
          </div>
        </div>
      </div>
    </div>
  );
}
