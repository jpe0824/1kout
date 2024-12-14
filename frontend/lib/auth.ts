"use server";

import { authApi, configuration } from "@/api";
import { cookies } from "next/headers";

function setCookie(
  name: string,
  value: string,
  options: { path: string; maxAge?: number }
) {
  const cookieStore = cookies();
  cookieStore.set(name, value, options);
}

function getCookie(name: string) {
  const cookieStore = cookies();
  return cookieStore.get(name)?.value;
}

function clearCookies() {
  const cookieStore = cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function login(username: string, password: string) {
  await authApi
    .loginApiV1AuthLoginPost(username, password)
    .then((res) => {
      configuration.username = username;
      configuration.password = password;
      configuration.accessToken = res.data.access_token;

      setCookie("access_token", res.data.access_token, {
        path: "/",
        maxAge: 30,
      });
      setCookie("refresh_token", res.data.refresh_token, {
        path: "/",
        maxAge: 2 * 60,
      });

      console.log(res.status);

      return res.status;
    })
    .catch((err) => {
      throw err;
    });
}

export async function isAuthenticated(): Promise<boolean> {
  const isAuthenticated = await authApi.testTokenApiV1AuthTestTokenPost();

  if (isAuthenticated.statusText == "OK") {
    return true;
  }
  return false;
}

export async function refreshToken(): Promise<boolean> {
  const refreshToken = getCookie("refresh_token");
  if (!refreshToken) return false;

  await authApi
    .refreshTokenApiV1AuthRefreshPost(refreshToken)
    .then((res) => {
      setCookie("access_token", res.data.access_token, {
        path: "/",
        maxAge: 60,
      });
      setCookie("refresh_token", res.data.refresh_token, {
        path: "/",
        maxAge: 8 * 24 * 60,
      });

      return true;
    })
    .catch((err) => {
      console.log(err);
      clearCookies();
      return false;
    });
  return false;
}
