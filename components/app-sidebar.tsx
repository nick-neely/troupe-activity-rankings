"use client";

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
} from "@/components/ui/sidebar";
import { logout, useAuth } from "@/hooks/use-auth";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const publicItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Trends", url: "/trends", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminItems = [{ title: "Upload Data", url: "/admin", icon: Upload }];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();

  const allItems = isAuthenticated
    ? [...publicItems.slice(0, 1), ...adminItems, ...publicItems.slice(1)]
    : publicItems;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar variant="inset" className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="mb-2 px-2">
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
              {allItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 space-y-2">
          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Admin: {user.username}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/admin/login">
                    <User className="w-4 h-4 mr-2" />
                    Admin Login
                  </Link>
                </Button>
              )}
            </>
          )}
          <span className="text-xs text-muted-foreground">© 2025 Troupe</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
