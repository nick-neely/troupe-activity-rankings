"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useActivityStore } from "@/lib/store";
import { Award, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { useState } from "react";

export function BudgetAnalysis() {
  const getBudgetAnalysis = useActivityStore(
    (state) => state.getBudgetAnalysis
  );
  const budgetData = getBudgetAnalysis();
  const isMobile = useIsMobile();

  const [expandedRanges, setExpandedRanges] = useState<Record<string, boolean>>(
    {}
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentSheetRange, setCurrentSheetRange] = useState<string | null>(
    null
  );

  const toggleRange = (priceRange: string) => {
    setExpandedRanges((prev) => ({
      ...prev,
      [priceRange]: !prev[priceRange],
    }));
  };

  const openSheet = (priceRange: string) => {
    setCurrentSheetRange(priceRange);
    setSheetOpen(true);
  };

  const currentSheetActivities = currentSheetRange
    ? budgetData
        .find((b) => b.priceRange === currentSheetRange)
        ?.activities.sort((a, b) => (b.score || 0) - (a.score || 0)) || []
    : [];

  const colors = [
    "from-green-500 to-green-600",
    "from-blue-500 to-blue-600",
    "from-indigo-500 to-indigo-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-2xl">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Budget Optimization
          </h2>
          <p className="text-sm text-slate-600">
            Best value activities across price ranges
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {budgetData.map((range, index) => {
          const isExpanded = expandedRanges[range.priceRange];
          const hasMore = range.activities.length > 1;
          const sortedActivities = [...range.activities].sort(
            (a, b) => (b.score || 0) - (a.score || 0)
          );

          return (
            <div
              key={range.priceRange}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {range.priceRange}
                  </h3>
                  <p className="text-sm text-slate-600">
                    <span className="font-mono">{range.count}</span> activities
                    • Avg score:{" "}
                    <span className="font-mono">
                      {range.avgScore.toFixed(1)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900 font-mono">
                    {range.avgScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-500">Average Score</div>
                </div>
              </div>

              {range.activities.length > 0 && (
                <div className="space-y-2">
                  {isMobile && isExpanded ? (
                    <div className="space-y-2">
                      {sortedActivities.map((activity, activityIndex) => (
                        <div
                          key={activity.name}
                          className={`p-3 bg-white rounded-xl border border-slate-200 transition-all duration-200 ${
                            activityIndex > 0
                              ? "animate-in slide-in-from-top-2 fade-in-0"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {activityIndex === 0 && (
                              <div className="p-2 bg-yellow-100 rounded-xl flex-shrink-0">
                                <Award className="w-4 h-4 text-yellow-600" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 truncate pr-2">
                                {activity.name}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {activityIndex === 0
                                  ? "Best value in range"
                                  : `Rank #${activityIndex + 1}`}{" "}
                                • {activity.category}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg font-bold text-indigo-600 font-mono">
                                {activity.score}
                              </div>
                              <div className="text-xs text-slate-500 whitespace-nowrap font-mono">
                                ❤️{activity.love_votes} 👍{activity.like_votes}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    range.bestValue && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 rounded-xl flex-shrink-0">
                            <Award className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 truncate pr-2">
                              {range.bestValue.name}
                            </h4>
                            <p className="text-sm text-slate-600">
                              Best value in this range
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-indigo-600 font-mono">
                              {range.bestValue.score}
                            </div>
                            <div className="text-xs text-slate-500 whitespace-nowrap font-mono">
                              ❤️{range.bestValue.love_votes} 👍
                              {range.bestValue.like_votes}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {hasMore && (
                    <>
                      {isMobile ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRange(range.priceRange)}
                          className="w-full mt-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-xl transition-all duration-200"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" />
                              Show All {range.count} Activities
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openSheet(range.priceRange)}
                          className="w-full mt-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-xl transition-all duration-200"
                        >
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show All {range.count} Activities
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Progress bar showing relative performance */}
              <div className="mt-3">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      colors[index % colors.length]
                    } transition-all duration-300`}
                    style={{
                      width: `${Math.min((range.avgScore / 10) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Sheet for Budget Analysis */}
      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="right"
            className="w-full md:w-[500px] lg:w-[600px] rounded-l-3xl p-6"
          >
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold text-slate-900">
                {currentSheetRange} Activities
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
              {currentSheetActivities.map((activity, index) => (
                <div
                  key={activity.name}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 text-base truncate pr-2">
                        {activity.name}
                      </h4>
                      <p className="text-sm text-slate-500">
                        Rank #{index + 1} • {activity.category}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-indigo-600 font-mono">
                        {activity.score}
                      </div>
                      <div className="text-sm text-slate-500 whitespace-nowrap font-mono">
                        ❤️{activity.love_votes} 👍{activity.like_votes} 👎
                        {activity.pass_votes}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
