import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import React from "react";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Admin Login - Troupe Dashboard",
  description: "Admin login for Troupe Activity Dashboard",
};

/**
 * Provides the layout for the admin login page, rendering its children and a toast notification system.
 *
 * @param children - The content to display within the admin login layout
 */
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
