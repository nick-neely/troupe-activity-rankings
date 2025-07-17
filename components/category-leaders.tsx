"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile"; // Assuming this hook is available
import { useActivityStore } from "@/lib/store";
import { ChevronDown, ChevronUp, Crown, TrendingUp } from "lucide-react";
import { useState } from "react";

export function CategoryLeaders() {
  const getCategoryLeaders = useActivityStore(
    (state) => state.getCategoryLeaders
  );
  const activities = useActivityStore((state) => state.activities);
  const categoryLeaders = getCategoryLeaders();
  const isMobile = useIsMobile();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentSheetCategory, setCurrentSheetCategory] = useState<
    string | null
  >(null);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const openSheet = (categoryName: string) => {
    setCurrentSheetCategory(categoryName);
    setSheetOpen(true);
  };

  const getCategoryActivities = (categoryName: string) => {
    return activities
      .filter((activity) => activity.category === categoryName)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  };

  const currentSheetActivities = currentSheetCategory
    ? getCategoryActivities(currentSheetCategory)
    : [];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-2xl">
          <Crown className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Category Leaders
          </h2>
          <p className="text-sm text-slate-600">
            Top-performing activities by category
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryLeaders.map((category) => {
          const isExpanded = expandedCategories[category.category];
          const categoryActivities = getCategoryActivities(category.category);
          const visibleActivities =
            isMobile && isExpanded
              ? categoryActivities
              : [category.topActivity];
          const hasMore = categoryActivities.length > 1;

          return (
            <div
              key={category.category}
              className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">
                  {category.category}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-indigo-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium font-mono">
                      {category.avgScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200 font-mono">
                    {category.totalActivities}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {visibleActivities.map((activity, index) => (
                  <div
                    key={activity.name}
                    className={`p-3 bg-white rounded-xl border border-slate-200 transition-all duration-200 ${
                      isMobile && index > 0 && isExpanded
                        ? "animate-in slide-in-from-top-2 fade-in-0"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 text-sm truncate pr-2">
                          {activity.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {index === 0 && !isExpanded && isMobile
                            ? "Top performer"
                            : `Rank #${index + 1}`}
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

                {hasMore && (
                  <>
                    {isMobile ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(category.category)}
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
                            Show All {category.totalActivities}
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openSheet(category.category)}
                        className="w-full mt-2 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-xl transition-all duration-200"
                      >
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show All {category.totalActivities}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Sheet for Category Leaders */}
      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="right"
            className="w-full md:w-[500px] lg:w-[600px] rounded-l-3xl p-6"
          >
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold text-slate-900">
                {currentSheetCategory} Activities
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
                        Rank #{index + 1}
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
