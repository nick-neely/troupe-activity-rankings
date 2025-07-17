"use client";

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
import {
  BarChart3,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Upload Data", url: "/admin", icon: Upload },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Trends", url: "/trends", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

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
              {items.map((item) => {
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
        <div className="px-2">
          <span className="text-xs text-muted-foreground">© 2025 Troupe</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
