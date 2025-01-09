import { useAuth } from "@/hooks/auth-provider";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { getLeaderboardData, Leaderboard, PublicUser } from "client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
import { ArrowLeft, ShareIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { columns } from "./leaderboard-columns";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

export default function Leaderboard() {
  let { uuid } = useParams();
  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard>();

  const getLeaderboard = async () => {
    await getLeaderboardData({ path: { leaderboardId: uuid || "" } })
      .then((res) => {
        if (res.response.status === 401) {
          refreshAuth();
          getLeaderboard();
        }
        if (res.response.status === 403) {
          logout();
        }
        if (!res.response.ok || !res.data) throw res.error;
        const leaderboardResData: Leaderboard = {
          leaderboard_name: res.data.leaderboard_name,
          picture: res.data.picture,
          invite_code: res.data.invite_code,
          is_active: res.data.is_active,
          uuid: res.data.uuid,
        };
        setLeaderboard(leaderboardResData);
        setUsers(res.data.users_data);
      })
      .catch((err) => {
        //handled by middleware
      });
  };

  useEffect(() => {
    getLeaderboard();
  }, [uuid]);

  if (!user) {
    return <NotAuthorized />;
  }

  if (!leaderboard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen z-30">
      <Card className="p-0 md:p-2 max-w-screen md:w-auto md:min-w-96 ">
        <CardHeader>
          <CardTitle className="flex flex-row items-center">
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <div>
              {leaderboard?.leaderboard_name}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost">
                    <ShareIcon />
                    Invite
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="">{leaderboard?.invite_code}</div>
                </PopoverContent>
              </Popover>
            </div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} />
        </CardContent>
        <CardFooter className="justify-center"></CardFooter>
      </Card>
    </div>
  );
}
