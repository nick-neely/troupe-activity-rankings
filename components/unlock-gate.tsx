"use client";

import { SitewideUnlockOverlay } from "@/components/sitewide-unlock-overlay";
import { useUnlockStore } from "@/lib/store";
import { ActivitySync } from "@/components/activity-sync";
import { AppSidebar } from "@/components/app-sidebar";
import { QueryProvider } from "@/components/query-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

export function UnlockGate({ children }: { children: React.ReactNode }) {
  const { hydrated, unlocked } = useUnlockStore();
  // Only render app content if hydrated and unlocked
  if (!hydrated || !unlocked) {
    return <SitewideUnlockOverlay />;
  }
  return (
    <QueryProvider>
      <ActivitySync>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 min-h-screen bg-slate-100">
            <div className="m-4 bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="p-6">
                <div className="mb-6">
                  <SidebarTrigger className="h-8 w-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50" />
                </div>
                {children}
              </div>
            </div>
          </main>
          <Toaster />
        </SidebarProvider>
      </ActivitySync>
    </QueryProvider>
  );
}
