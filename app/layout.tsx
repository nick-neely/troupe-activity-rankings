import { ActivitySync } from "@/components/activity-sync";
import { AppSidebar } from "@/components/app-sidebar";
import { QueryProvider } from "@/components/query-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Troupe Activity Dashboard",
  description: "Analyze and visualize your group trip activity data",
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}
    >
      <body>
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
      </body>
    </html>
  );
}
