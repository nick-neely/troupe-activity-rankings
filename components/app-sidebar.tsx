"use client";

import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { logout, useAuth } from "@/hooks/use-auth";
import {
  BarChart3,
  Github,
  Info,
  LayoutDashboard,
  Linkedin,
  LogOut,
  Mail,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const publicItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "About", url: "/about", icon: Info },
];

const adminItems = [{ title: "Admin Dashboard", url: "/admin", icon: Shield }];

/**
 * Renders the application sidebar with navigation and user controls based on authentication state.
 *
 * Displays public and admin-specific navigation items, and conditionally shows user information, logout, or login options in the footer.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Admin dashboard should be last if authenticated
  const allItems = isAuthenticated
    ? [...publicItems, ...adminItems]
    : publicItems;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar variant="inset" className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="mb-2 px-2 flex flex-col items-center">
          <Image
            src="/icon.png"
            alt="Troupe Icon"
            width={1024}
            height={1024}
            className="rounded-full mb-2 shadow w-16 h-16 object-cover"
            priority
          />
          <h1 className="text-xl font-bold">Troupe Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Trip Activity Analytics
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item, idx) => {
                const isActive = pathname === item.url;
                // If admin dashboard is present and is last, add separator above it
                const isAdminItem = item.title === "Admin Dashboard";
                const isLast = idx === allItems.length - 1 && isAdminItem;
                return (
                  <React.Fragment key={item.title}>
                    {isLast && <SidebarSeparator />}
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 rounded-xl transition-colors duration-100 md:h-10 h-14 px-4 w-full text-base md:text-sm md:px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </React.Fragment>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 space-y-2">
          {!isLoading &&
            (isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Admin: {user.username}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full h-14 md:h-10 text-base md:text-sm rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full h-14 md:h-10 text-base md:text-sm rounded-xl"
              >
                <Link href="/admin/login">
                  <User className="w-4 h-4 mr-2" />
                  Admin Login
                </Link>
              </Button>
            ))}
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Nick Neely</span>
            <div className="flex gap-4 md:gap-2">
              <a
                href="https://github.com/nick-neely/troupe-scraper-web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-muted-foreground hover:text-slate-900 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/nick-neely/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-muted-foreground hover:text-slate-900 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@nickneely.dev"
                className="inline-flex items-center text-muted-foreground hover:text-slate-900 transition-colors"
                aria-label="Email Nick Neely"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
