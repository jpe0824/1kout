import useLeaderboards from "@/hooks/use-leaderboard";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Collapsible } from "./ui/collapsible";
import { ChevronRight, LucideIcon, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/auth-provider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Leaderboard } from "client";

export function NavLeaderboard({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | undefined;
    isActive?: boolean | undefined;
    items?: {
      title: string | undefined;
      url: string | undefined;
    }[];
  }[];
}) {
  const { user } = useAuth();
  const { leaderboards, ownedLeaderboards, deleteBoard } = useLeaderboards();

  const handleLeaderboardEdit = (board: Leaderboard) => {
    console.log(board);
  };

  const handleLeaderboardDelete = (board: Leaderboard) => {
    deleteBoard(board);
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={item.isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {item.items?.map((subItem) => (
                <SidebarMenuSub key={subItem.title}>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to={subItem.url ?? "/"}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              ))}
              {user &&
                [
                  ...(leaderboards ?? []),
                  ...(ownedLeaderboards?.filter(
                    (owned) =>
                      !leaderboards?.some(
                        (joined) => joined.uuid === owned.uuid
                      )
                  ) ?? []),
                ].map((board) => (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem key={board.uuid}>
                      <SidebarMenuButton asChild>
                        <Link to={`/leaderboard/${board.uuid}`}>
                          {board.leaderboard_name}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                    {ownedLeaderboards?.some(
                      (owned) => owned.uuid === board.uuid
                    ) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction>
                            <MoreHorizontal className="h-4 w-4" />
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem
                            onClick={() => handleLeaderboardEdit(board)}
                          >
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLeaderboardDelete(board)}>
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </SidebarMenuSub>
                ))}
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  );
}
