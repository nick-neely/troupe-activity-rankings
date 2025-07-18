"use client";

import { type CategoryIconMapping } from "@/lib/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
const QUERY_KEYS = {
  categoryMappings: ["categoryMappings"] as const,
} as const;

// API functions
async function fetchCategoryMappings(): Promise<CategoryIconMapping[]> {
  const response = await fetch("/api/category-mappings");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch category mappings: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data.mappings;
}

async function updateCategoryMapping(category: string, iconName: string) {
  const response = await fetch("/api/category-mappings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category, iconName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update category mapping");
  }
  return response.json();
}

// Hooks
export function useCategoryMappings() {
  return useQuery({
    queryKey: QUERY_KEYS.categoryMappings,
    queryFn: fetchCategoryMappings,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

export function useUpdateCategoryMapping() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      iconName,
    }: {
      category: string;
      iconName: string;
    }) => updateCategoryMapping(category, iconName),
    onSuccess: () => {
      // Invalidate and refetch category mappings
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categoryMappings });
    },
  });
}
