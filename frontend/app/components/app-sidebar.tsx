import {
  Calendar,
  FileClock,
  Home,
  Inbox,
  ListOrdered,
  Search,
  Settings,
  TreePine,
} from "lucide-react";

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
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { Link } from "react-router";
import { NavUser } from "@/components/nav-user";
import { useEffect, useState } from "react";
import { User } from "client";
import { useAuth } from "@/hooks/auth-provider";

const data = {
  navMain: [
    {
      title: "Hours",
      url: "/logging",
      icon: FileClock,
      isActive: true,
      items: [
        {
          title: "Log History",
          url: "/logging",
        },
        {
          title: "New Log",
          url: "/logging/new-log",
        },
      ],
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: ListOrdered,
      items: [
        {
          title: "Leaderboard",
          url: "/leaderboard",
        },
        {
          title: "Create New",
          url: "/leaderboard/create",
        },
        {
          title: "Join",
          url: "/leaderboard/join",
        },
      ],
    },
  ],
};

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <TreePine />
                <span className="font-pacifico text-lg md:text-xl font-bold px-2">
                  1,000 Hours
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
