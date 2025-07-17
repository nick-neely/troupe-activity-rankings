"use client";

import { useActivities } from "@/hooks/use-activities";
import { useActivityStore } from "@/lib/store";
import { useEffect } from "react";

export function ActivitySync({ children }: { children: React.ReactNode }) {
  const { data: activities } = useActivities(true);
  const setActivities = useActivityStore((state) => state.setActivities);

  useEffect(() => {
    if (activities) {
      setActivities(activities);
    }
  }, [activities, setActivities]);

  return <>{children}</>;
}
