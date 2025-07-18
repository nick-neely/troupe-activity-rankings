"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCategoryMappings,
  useUpdateCategoryMapping,
} from "@/hooks/use-category-mappings";
import { availableIcons } from "@/lib/config/available-icons";
import { useActivityStore } from "@/lib/store";
import { Settings, Tag } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

/**
 * Component for managing category to icon mappings.
 * Allows admins to set icons for different activity categories.
 * Changes sync across all users via the database.
 */
export function CategoryIconManager() {
  const { getAvailableCategories } = useActivityStore();
  const { data: mappings, isLoading, error, refetch } = useCategoryMappings();
  const updateMapping = useUpdateCategoryMapping();

  const categories = getAvailableCategories();

  // Memoize flattened icon list for efficient lookup
  const allIcons = React.useMemo(
    () => availableIcons.flatMap((group) => group.icons),
    []
  );

  // Local state for icon selections
  const [iconSelections, setIconSelections] = React.useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Sync local state with DB mappings on load
  React.useEffect(() => {
    if (mappings) {
      const initial = mappings.reduce((acc, mapping) => {
        acc[mapping.category] = mapping.iconName;
        return acc;
      }, {} as Record<string, string>);
      setIconSelections(initial);
    }
  }, [mappings]);

  // Track if there are unsaved changes
  const hasChanges = React.useMemo(() => {
    if (!mappings) return false;
    return categories.some(
      (cat) =>
        iconSelections[cat] &&
        iconSelections[cat] !==
          (mappings?.find((m) => m.category === cat)?.iconName ?? "Tag")
    );
  }, [iconSelections, mappings, categories]);

  // Handle icon selection (local state only)
  const handleIconSelect = (category: string, iconName: string) => {
    setIconSelections((prev) => ({ ...prev, [category]: iconName }));
  };

  // Submit all changes
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Find changed categories
      const changed = categories.filter(
        (cat) =>
          iconSelections[cat] &&
          iconSelections[cat] !==
            (mappings?.find((m) => m.category === cat)?.iconName ?? "Tag")
      );
      // Batch update
      await Promise.all(
        changed.map((cat) =>
          updateMapping.mutateAsync({
            category: cat,
            iconName: iconSelections[cat],
          })
        )
      );
      toast.success("Category icons updated successfully!");
      refetch();
    } catch {
      toast.error("Failed to update category icons. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 rounded-2xl p-4">
        <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Category Icons
        </h4>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading category mappings:", error);
    return (
      <div className="bg-slate-50 rounded-2xl p-4">
        <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Category Icons
        </h4>
        <p className="text-sm text-red-600">
          Failed to load category mappings. Please try again.
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-4">
        <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Category Icons
        </h4>
        <p className="text-sm text-slate-600">
          No categories found. Upload activity data to manage category icons.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-4">
      <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Category Icons
      </h4>
      <p className="text-sm text-slate-600 mb-4">
        Customize icons for each activity category to match your trip&apos;s
        theme. Choose from multiple options - for example, use{" "}
        <strong>Music</strong> icons for concert trips or{" "}
        <strong>Gaming</strong> icons for family entertainment.{" "}
        <strong>Submit changes to sync for all users.</strong>
      </p>

      <div className="space-y-3">
        {categories.map((category) => {
          const currentIconName = iconSelections[category] || "Tag";
          const currentIcon = allIcons.find(
            (icon) => icon.name === currentIconName
          );
          const IconComponent = currentIcon?.icon || Tag;

          return (
            <div
              key={category}
              className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg">
                  <IconComponent className="w-4 h-4 text-slate-600" />
                </div>
                <span className="font-medium text-slate-900">{category}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-300"
                    disabled={isSubmitting}
                  >
                    Change Icon
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-2xl w-64 max-h-80 overflow-y-auto"
                >
                  {availableIcons.map((group) => (
                    <div key={group.group}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {group.group}
                      </div>
                      {group.icons.map((iconOption) => {
                        const OptionIcon = iconOption.icon;
                        return (
                          <DropdownMenuItem
                            key={iconOption.name}
                            className={`rounded-xl flex items-center gap-2 px-3 py-2 ${
                              iconSelections[category] === iconOption.name
                                ? "bg-slate-100"
                                : ""
                            }`}
                            onClick={() =>
                              handleIconSelect(category, iconOption.name)
                            }
                          >
                            <OptionIcon className="w-4 h-4" />
                            {iconOption.label}
                          </DropdownMenuItem>
                        );
                      })}
                      {/* Add separator between groups except for the last one */}
                      {group !== availableIcons[availableIcons.length - 1] && (
                        <div className="border-t border-slate-200 my-1" />
                      )}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="default"
          size="lg"
          className="rounded-xl px-6"
          disabled={!hasChanges || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Saving..." : "Submit Changes"}
        </Button>
      </div>
    </div>
  );
}
