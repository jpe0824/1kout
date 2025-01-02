import {
  getJoinedLeaderboards,
  getOwnedLeaderboards,
  Leaderboard,
} from "client";
import { useState, useEffect } from "react";
import { useAuth } from "./auth-provider";
import { toast } from "./use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

const useLeaderboards = () => {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [ownedLeaderboards, setOwnedLeaderboards] = useState<Leaderboard[]>([]);
  const { user, logout, refreshAuth } = useAuth();

  const getJoinedBoards = async () => {
    await getJoinedLeaderboards()
      .then((res) => {
        if (!res.response.ok) throw res.error?.detail;
        if (!res.data) return;
        setLeaderboards(res.data);
      })
      .catch((err) => {
        console.error("Error fetching joined leaderboards:", err);
        // if (err.response.status === 403) {
        //   console.log("error 403");
        //   logout();
        // }
        // toast({
        //   variant: "destructive",
        //   title: "Uh oh! Something went wrong.",
        //   description: `${err.error.detail}`,
        //   action: (
        //     <ToastAction altText="Try again">
        //       <Button
        //         onClick={() => {
        //           if (err.response.status === 401) {
        //             console.log("error 401");
        //             refreshAuth();
        //           }
        //         }}
        //       >
        //         Try again
        //       </Button>
        //     </ToastAction>
        //   ),
        // });
      });
  };

  const getOwnedBoards = async () => {
    await getOwnedLeaderboards()
      .then((res) => {
        if (!res.response.ok) throw res.error?.detail;
        if (!res.data) return;
        setOwnedLeaderboards(res.data);
      })
      .catch((err) => {
        console.error("Error fetching joined leaderboards:", err);
      });
  };

  useEffect(() => {
    getJoinedBoards();
    getOwnedBoards();
  }, []);

  useEffect(() => {
    getJoinedBoards();
    getOwnedBoards();
  }, [user]);

  return { leaderboards, ownedLeaderboards, getJoinedBoards, getOwnedBoards };
};

export default useLeaderboards;
