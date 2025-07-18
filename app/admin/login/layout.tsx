import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import React from "react";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Admin Login - Troupe Dashboard",
  description: "Admin login for Troupe Activity Dashboard",
};

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
