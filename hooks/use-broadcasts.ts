import { useQuery } from "@tanstack/react-query";

export interface BroadcastData {
  id: number;
  slug: string;
  title: string;
  bodyMarkdown: string;
  level: "info" | "warn" | "critical";
  version: number;
  updatedAt: string;
}

export interface BroadcastsResponse {
  revision: number;
  broadcasts: BroadcastData[];
}

export function useBroadcasts() {
  return useQuery<BroadcastsResponse>({
    queryKey: ["broadcasts"],
    queryFn: async () => {
      const res = await fetch("/api/broadcasts/active", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch broadcasts");
      }

      return res.json();
    },
    refetchInterval: 15000, // ~15s polling
    refetchOnWindowFocus: true, // picks up changes when user returns
    staleTime: 0,
  });
}
