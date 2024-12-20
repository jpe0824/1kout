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
import { deleteLog, DeleteLogData, Log, LogHours } from "client";
import { MoreHorizontal, Pencil, Trash, TriangleAlert } from "lucide-react";
import { title } from "process";
import { createSearchParams, useNavigate } from "react-router";

const formatDate = (datestring: string) => {
  const date = new Date(datestring);

  const localDate = new Date(date.getTime());

  const year = localDate.getFullYear();
  const month = localDate.getMonth() + 1; //getMonth() returns 0 based month
  const day = localDate.getDate();
  let hours = localDate.getHours();
  const minutes = localDate.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${month}/${day}  ${hours}:${formattedMinutes} ${ampm}`;
};

const formatTime = (time: string) => {
  const parts = time.split(":");

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const columns: ColumnDef<LogHours>[] = [
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => {
      const formatted = formatDate(row.getValue("start_time"));
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => {
      const formatted = formatDate(row.getValue("end_time"));
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "hours",
    header: "Hours",
    cell: ({ row }) => {
      const formatted = formatTime(row.getValue("hours"));
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original;
      const navigate = useNavigate();

      const queryParams = createSearchParams({
        id: log.uuid,
      });

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    pathname: "/logging/edit-log",
                    search: `?${queryParams}`,
                  });
                }}
              >
                <Pencil />
                Edit Log
              </DropdownMenuItem>
              <AlertDialogTrigger>
                <DropdownMenuItem>
                  <Trash />
                  Delete Log
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex flex-row">
                <TriangleAlert className="mr-2 text-destructive" />
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                log entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white"
                onClick={() => {
                  deleteLog({ path: { logid: log.uuid } })
                    .then((res) => {
                      if (!res.response.ok) throw res.error?.detail;
                      toast({ title: "Successfully deleted log." });
                      navigate(0);
                    })
                    .catch((err) => {
                      toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: `${err}`,
                      });
                    });
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
