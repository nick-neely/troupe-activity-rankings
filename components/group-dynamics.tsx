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
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Heart,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

export function GroupDynamics() {
  const getGroupDynamics = useActivityStore((state) => state.getGroupDynamics);
  const dynamics = getGroupDynamics();
  const isMobile = useIsMobile();

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentSheetSection, setCurrentSheetSection] = useState<string | null>(
    null
  );

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const openSheet = (sectionKey: string) => {
    setCurrentSheetSection(sectionKey);
    setSheetOpen(true);
  };

  const sections = [
    {
      key: "consensus",
      title: "Consensus Winners",
      description: "Activities everyone loves with no opposition",
      activities: dynamics.consensus,
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      accentColor: "bg-green-50",
    },
    {
      key: "controversial",
      title: "Controversial Choices",
      description: "Mixed reactions - proceed with caution",
      activities: dynamics.controversial,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
      accentColor: "bg-yellow-50",
    },
    {
      key: "polarizing",
      title: "Polarizing Activities",
      description: "Strong opinions on both sides",
      activities: dynamics.polarizing,
      icon: Zap,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
      accentColor: "bg-red-50",
    },
    {
      key: "unanimous",
      title: "Unanimous Favorites",
      description: "Perfect agreement - safe bets",
      activities: dynamics.unanimous,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      borderColor: "border-indigo-200",
      accentColor: "bg-indigo-50",
    },
  ];

  const currentSheetActivities = currentSheetSection
    ? sections
        .find((s) => s.key === currentSheetSection)
        ?.activities.sort((a, b) => (b.score || 0) - (a.score || 0)) || []
    : [];

  const currentSheetTitle = currentSheetSection
    ? sections.find((s) => s.key === currentSheetSection)?.title
    : "Activities";

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-2xl">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Group Dynamics
          </h2>
          <p className="text-sm text-slate-600">
            Understanding how activities unite or divide your group
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const isExpanded = expandedSections[section.key];
          const visibleActivities =
            isMobile && isExpanded
              ? section.activities
              : section.activities.slice(0, 3);
          const hasMore = section.activities.length > 3;

          return (
            <div
              key={section.key}
              className={`p-4 rounded-2xl border ${section.borderColor} ${section.accentColor}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${section.bgColor} rounded-xl`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {section.description}
                  </p>
                </div>
                <div className="text-sm font-medium text-slate-700 bg-white px-2 py-1 rounded-xl border border-slate-200 font-mono">
                  {section.activities.length}
                </div>
              </div>

              <div className="space-y-2">
                {section.activities.length === 0 ? (
                  <p className="text-sm text-slate-500 italic py-4 text-center">
                    No activities in this category
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {visibleActivities.map((activity, index) => (
                        <div
                          key={activity.name}
                          className={`p-3 bg-white rounded-xl border border-slate-200 transition-all duration-200 ${
                            isMobile && index >= 3 && isExpanded
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
                                {activity.category}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-bold text-slate-900 font-mono">
                                {activity.score}
                              </div>
                              <div className="text-xs text-slate-500 whitespace-nowrap font-mono">
                                ❤️{activity.love_votes} 👍{activity.like_votes}{" "}
                                👎
                                {activity.pass_votes}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasMore && (
                      <>
                        {isMobile ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection(section.key)}
                            className="w-full mt-3 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-xl transition-all duration-200"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Show {section.activities.length - 3} More
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openSheet(section.key)}
                            className="w-full mt-3 text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-xl transition-all duration-200"
                          >
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Show All {section.activities.length} Activities
                          </Button>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Sheet for Group Dynamics */}
      {!isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="right"
            className="w-full md:w-[500px] lg:w-[600px] rounded-l-3xl p-6"
          >
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold text-slate-900">
                {currentSheetTitle}
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
              {currentSheetActivities.map((activity) => (
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
                        {activity.category}
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
