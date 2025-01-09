import { BodyLogin, client, login, refresh, testToken, User } from "client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { redirect, replace, useNavigate } from "react-router";
import { toast } from "./use-toast";
import { useLocalStorage } from "@/lib/utils";
import { optional } from "zod";
import useLeaderboards from "./use-leaderboard";

type AuthProviderProps = {
  children: React.ReactNode;
};

interface AuthContextState {
  user: User | null;
  refreshTryAgain: boolean;
  loginUser: (loginData: BodyLogin) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const initialState = {
  user: null,
  refreshTryAgain: true,
  loginUser: (loginData: BodyLogin) => {},
  logout: () => {
    console.log("logout not set");
  },
  refreshAuth: () => {
    console.log("refresh not set");
  },
};

const AuthContext = createContext<AuthContextState>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage("user", null);
  const [refreshTryAgain, setRefreshTryAgain] = useState(true);
  const { resetLeaderboards } = useLeaderboards();
  const navigate = useNavigate();

  async function loginUser(loginData: BodyLogin): Promise<void> {
    await login({ body: loginData })
      .then((res) => {
        if (res.response.ok && res.data) {
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          toast({
            title: "Successfully logged in!",
          });
          testAuth();
        } else {
          throw res.error;
        }
      })
      .catch((err) => {
        //handled by middleware
      });
  }

  async function testAuth(): Promise<void> {
    await testToken()
      .then((res) => {
        if (!res.response.ok) throw res.error;
        if (res.data) {
          setUser(res.data);
          navigate("/");
        }
        return;
      })
      .catch((err) => {
        //handled by middleware
      });
  }

  async function refreshAuth() {
    if (!refreshTryAgain) return;
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) logout();
    else {
      await refresh({ body: refreshToken })
        .then((res) => {
          if (res.response.ok && res.data) {
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
          } else {
            throw res.error;
          }
        })
        .catch((err) => {
          logout();
          //handled by middleware
        });
    }
  }

  function logout() {
    console.log("running logout");
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    resetLeaderboards();
    navigate("/auth/login", { replace: true });
  }

  const value = useMemo(
    () => ({
      user,
      refreshTryAgain,
      loginUser,
      refreshAuth,
      logout,
    }),
    [user, refreshTryAgain]
  );

  return (
    <AuthContext.Provider {...props} value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
