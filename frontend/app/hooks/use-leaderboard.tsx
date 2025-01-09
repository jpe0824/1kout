import {
  getJoinedLeaderboards,
  getOwnedLeaderboards,
  deleteLeaderboard,
  Leaderboard,
} from "client";
import { useState, useEffect } from "react";
import { useAuth } from "./auth-provider";

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
        //handled by middleware
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
        //handled by middleware
      });
  };

  const deleteBoard = async (board: Leaderboard) => {
    await deleteLeaderboard({ path: { leaderboardId: board.uuid } })
      .then((res) => {
        if (!res.response.ok) throw res.error;
        getJoinedBoards();
        getOwnedBoards();
      })
      .catch((err) => {
        //handled by middleware
      });
  };

  const resetLeaderboards = () => {
    setLeaderboards([]);
    setOwnedLeaderboards([]);
  };

  useEffect(() => {
    getJoinedBoards();
    getOwnedBoards();
  }, []);

  useEffect(() => {
    getJoinedBoards();
    getOwnedBoards();
  }, [user]);

  return {
    leaderboards,
    ownedLeaderboards,
    getJoinedBoards,
    getOwnedBoards,
    resetLeaderboards,
    deleteBoard,
  };
};

export default useLeaderboards;
