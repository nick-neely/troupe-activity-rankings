"use client";

import { type ActivityData } from "@/lib/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
const QUERY_KEYS = {
  activities: ["activities"] as const,
  latestActivities: ["activities", "latest"] as const,
} as const;

// API functions
async function fetchActivities(
  latest: boolean = false
): Promise<ActivityData[]> {
  const url = latest ? "/api/activities?latest=true" : "/api/activities";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const data = await response.json();
  return data.activities;
}

async function uploadActivities(formData: FormData) {
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload activities");
  }

  return response.json();
}

// Hooks
export function useActivities(latest: boolean = false) {
  return useQuery({
    queryKey: latest ? QUERY_KEYS.latestActivities : QUERY_KEYS.activities,
    queryFn: () => fetchActivities(latest),
  });
}

export function useUploadActivities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadActivities,
    onSuccess: () => {
      // Invalidate both queries to refetch data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activities });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.latestActivities });
    },
  });
}
