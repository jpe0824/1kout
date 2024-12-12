"use server";

import { authApi } from "@/api";
import { cookies } from "next/headers";

function setCookie(
  name: string,
  value: string,
  options: { path: string; maxAge?: number }
) {
  const cookieStore = cookies();
  cookieStore.set(name, value, options);
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
      setCookie("access_token", res.data.access_token, {
        path: "/",
        maxAge: 60,
      });
      setCookie("refresh_token", res.data.refresh_token, {
        path: "/",
        maxAge: 8 * 24 * 60,
      });

      return res.status;
    })
    .catch((err) => {
      throw err;
    });
}

export async function isAuthenticated() {
  await authApi
    .testTokenApiV1AuthTestTokenPost()
    .then((res) => {
      if (res.status == 200) {
        return true;
      }
    })
    .catch((err) => {
      console.log(err);
      clearCookies();
      return false;
    });
}

export async function refreshToken(refreshToken: string) {
  await authApi
    .refreshTokenApiV1AuthRefreshPost(refreshToken)
    .then((res) => {
      clearCookies();
      setCookie("access_token", res.data.access_token, {
        path: "/",
        maxAge: 60,
      });
      setCookie("refresh_token", res.data.refresh_token, {
        path: "/",
        maxAge: 8 * 24 * 60,
      });

      return res.status;
    })
    .catch((err) => {
      throw err;
    });
}
