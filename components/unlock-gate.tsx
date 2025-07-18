"use client";

import { ActivitySync } from "@/components/activity-sync";
import { AppSidebar } from "@/components/app-sidebar";
import { QueryProvider } from "@/components/query-provider";
import { SitewideUnlockOverlay } from "@/components/sitewide-unlock-overlay";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useUnlockStore } from "@/lib/store";
import React from "react";
import MainLayout from "./main-layout";

export function UnlockGate({ children }: { children: React.ReactNode }) {
  const { hydrated, unlocked } = useUnlockStore();
  // Only render app content if hydrated and unlocked
  if (!hydrated) {
    return (
      <div className="fixed inset-0 bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!unlocked) {
    return <SitewideUnlockOverlay />;
  }
  return (
    <QueryProvider>
      <ActivitySync>
        <SidebarProvider>
          <AppSidebar />
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </SidebarProvider>
      </ActivitySync>
    </QueryProvider>
  );
}
