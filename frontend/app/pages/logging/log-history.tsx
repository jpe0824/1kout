import { useAuth } from "@/hooks/auth-provider";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NotAuthorized from "../auth/not-authorized";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getLogs, getLogsHours, Log, LogHours } from "client";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { DataTable } from "@/components/data-table";
import { columns } from "@/pages/logging/log-columns";

export default function LogHistory() {
  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogHours[]>([]);

  const getLogHistory = async () => {
    if (!user) return;
    await getLogsHours()
      .then((res) => {
        if (res.response.status === 401) {
          refreshAuth();
          getLogHistory();
        }
        if (res.response.status === 403) {
          logout();
        }
        if (!res.response.ok || !res.data) throw res.error;
        setLogs(res.data);
      })
      .catch((err) => {
        //handled by middleware
      });
  };

  useEffect(() => {
    getLogHistory();
  }, []);

  if (!user) {
    return <NotAuthorized />;
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen z-30">
      <Card className="p-0 md:p-2 max-w-screen md:w-auto ">
        <CardHeader>
          <CardTitle className="flex flex-row items-center">
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            Log History
          </CardTitle>
          <CardDescription>View and edit logs.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={logs} />
        </CardContent>
        <CardFooter className="justify-center"></CardFooter>
      </Card>
    </div>
  );
}
