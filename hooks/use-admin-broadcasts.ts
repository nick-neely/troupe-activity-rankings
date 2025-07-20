import type { Broadcast, BroadcastFormData } from "@/lib/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface AdminBroadcastsResponse {
  broadcasts: Broadcast[];
}

export function useAdminBroadcasts() {
  return useQuery<AdminBroadcastsResponse>({
    queryKey: ["admin", "broadcasts"],
    queryFn: async () => {
      const res = await fetch("/api/broadcasts");
      if (!res.ok) {
        throw new Error("Failed to fetch broadcasts");
      }
      return res.json();
    },
  });
}

export function useCreateBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BroadcastFormData) => {
      const res = await fetch("/api/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create broadcast");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] }); // Refresh active broadcasts too
      toast.success("Broadcast created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create broadcast: ${error.message}`);
    },
  });
}

export function useUpdateBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<BroadcastFormData> & { id: number }) => {
      const res = await fetch("/api/broadcasts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update broadcast");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] }); // Refresh active broadcasts too
      toast.success("Broadcast updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update broadcast: ${error.message}`);
    },
  });
}

export function useDeleteBroadcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/broadcasts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        let errorMessage = "Failed to delete broadcast";
        try {
          const error = await res.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // Response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "broadcasts"] });
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] }); // Refresh active broadcasts too
      toast.success("Broadcast deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete broadcast: ${error.message}`);
    },
  });
}
