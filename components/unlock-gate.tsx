"use client";

import { ActivitySync } from "@/components/activity-sync";
import { AppSidebar } from "@/components/app-sidebar";
import { BroadcastBanners } from "@/components/broadcast-banners";
import { QueryProvider } from "@/components/query-provider";
import { SidebarPointer } from "@/components/sidebar-pointer";
import { SitewideUnlockOverlay } from "@/components/sitewide-unlock-overlay";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useUnlockStore } from "@/lib/store";
import { LoaderCircle } from "lucide-react";
import React from "react";

export function UnlockGate({ children }: { children: React.ReactNode }) {
  const { hydrated, unlocked } = useUnlockStore();

  if (!hydrated) {
    return (
      <div className="fixed inset-0 bg-slate-100 flex items-center justify-center">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!unlocked) {
    return <SitewideUnlockOverlay />;
  }

  return (
    <QueryProvider>
      <ActivitySync>
        <AppSidebar />
        <SidebarInset className="relative">
          <div className="p-4 md:p-6">
            <div className="mb-6 relative">
              <SidebarPointer />
              <SidebarTrigger
                className="w-12 h-12 md:w-8 md:h-8 rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                iconClassName="w-8 h-8 md:w-5 md:h-5"
                onClick={() => {
                  window.dispatchEvent(new Event("sidebar-opened"));
                }}
              />
            </div>
            {children}
          </div>
          <React.Suspense fallback={null}>
            <BroadcastBanners />
          </React.Suspense>
        </SidebarInset>
        <Toaster />
      </ActivitySync>
    </QueryProvider>
  );
}
