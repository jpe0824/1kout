import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "@/hooks/use-toast";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { deleteLog, DeleteLogData, Log, LogHours, PublicUser } from "client";
import { MoreHorizontal, Pencil, Trash, TriangleAlert } from "lucide-react";
import { title } from "process";
import { createSearchParams, useNavigate } from "react-router";
import { formatTime } from "@/lib/utils";

export const columns: ColumnDef<PublicUser>[] = [
  {
    accessorKey: "picture",
    header: "",
  },
  {
    accessorKey: "nick_name",
    header: "Nickname",
  },
  {
    accessorKey: "hours",
    header: "Hours",
    cell: ({ row }) => {
      const formatted = formatTime(row.getValue("hours"));
      return <div>{formatted}</div>;
    },
  },
];
