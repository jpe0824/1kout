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
  loginUser: (loginData: BodyLogin) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const initialState = {
  user: null,
  loginUser: (loginData: BodyLogin) => {},
  logout: () => {},
  refreshAuth: () => {},
};

const AuthContext = createContext<AuthContextState>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage("user", null);
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
          navigate("/", { replace: true });
        } else {
          throw res.error?.detail;
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${err}`,
        });
        throw err;
      });
  }

  async function testAuth(): Promise<void> {
    await testToken()
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        }
        return;
      })
      .catch((err) => {
        console.log("token not valid");
      });
  }

  async function refreshAuth() {
    await refresh({ body: `${localStorage.getItem("refresh_token")}` })
      .then((res) => {
        if (res.response.ok && res.data) {
          localStorage.setItem("access_token", res.data.access_token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
        } else {
          throw res.error;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/auth/login", { replace: true });
    navigate(0);
  }

  const value = useMemo(
    () => ({
      user,
      loginUser,
      refreshAuth,
      logout,
    }),
    [user]
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
