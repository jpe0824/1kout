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
  const { user, refreshTryAgain, refreshAuth, logout } = useAuth();

  const getJoinedBoards = async () => {
    if (!user) return;
    await getJoinedLeaderboards()
      .then((res) => {
        if (res.response.status === 401) {
          if (refreshTryAgain) {
            refreshAuth();
            getJoinedLeaderboards();
          }

        }
        if (res.response.status === 403) {
          logout();
        }
        if (!res.response.ok || !res.data) throw res.error;
        if (!res.response.ok) throw res.error;
        if (!res.data) return;
        setLeaderboards(res.data);
      })
      .catch((err) => {
        throw err;
      });
  };

  const getOwnedBoards = async () => {
    if (!user) return;
    await getOwnedLeaderboards()
      .then((res) => {
        if (!res.response.ok) throw res.error;
        if (!res.data) return;
        setOwnedLeaderboards(res.data);
      })
      .catch((err) => {
        throw err;
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
