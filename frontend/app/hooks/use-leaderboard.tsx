import {
  getJoinedLeaderboards,
  getOwnedLeaderboards,
  Leaderboard,
} from "client";
import { useState, useEffect } from "react";

const useLeaderboards = () => {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [ownedLeaderboards, setOwnedLeaderboards] = useState<Leaderboard[]>([]);

  const getJoinedBoards = async () => {
    await getJoinedLeaderboards()
      .then((res) => {
        if (!res.response.ok) throw res.error?.detail;
        if (!res.data) return;
        setLeaderboards(res.data);
      })
      .catch((err) => {
        console.error("Error fetching joined leaderboards:", err);
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

  return { leaderboards, getJoinedBoards, getOwnedBoards };
};

export default useLeaderboards;
