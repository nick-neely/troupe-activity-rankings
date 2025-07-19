"use client";

import { BudgetAnalysis } from "@/components/budget-analysis";
import { CategoryLeaders } from "@/components/category-leaders";
import { ConsensusBuilder } from "@/components/consensus-builder";
import { EmptyState } from "@/components/empty-state";
import { GroupDynamics } from "@/components/group-dynamics";
import { ScoreDistribution } from "@/components/score-distribution";
import { VotingPatterns } from "@/components/voting-patterns";
import { useActivityStore } from "@/lib/store";

export default function AnalyticsPage() {
  const { activities, isLoaded } = useActivityStore();

  if (!isLoaded || activities.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8 p-0 md:p-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Advanced Analytics
        </h1>
        <p className="text-slate-600">
          Deep insights into your group&apos;s preferences to make better trip
          planning decisions
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <VotingPatterns />
        <ScoreDistribution />
        <ConsensusBuilder />
      </div>

      {/* Main Analytics Sections */}
      <div className="space-y-8">
        <CategoryLeaders />
        <BudgetAnalysis />
        <GroupDynamics />
      </div>
    </div>
  );
}
