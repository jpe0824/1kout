"use client";

import {
  loginApiV1AuthLoginPost,
  refreshTokenApiV1AuthRefreshPost,
  testTokenApiV1AuthTestTokenPost,
} from "@/client";
import { TokenSchema, LoginApiV1AuthLoginPostData } from "@/client/types.gen";
import { cookies } from "next/headers";
import { client } from "@/client";

client.setConfig({
  baseUrl: "http://localhost:8000",
  headers: {
    Authorization: "Bearer <token_from_service_client>",
  },
});

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

export async function login(username: string, password: string): Promise<void> {
  try {
    const loginData: LoginApiV1AuthLoginPostData = {
      body: {
        grant_type: "password",
        username,
        password,
        scope: "",
        client_id: null,
        client_secret: null,
      },
    };

    const result = await loginApiV1AuthLoginPost(loginData);

    if (
      result.data &&
      "access_token" in result.data &&
      "refresh_token" in result.data
    ) {
      setCookie("access_token", result.data.access_token, {
        path: "/",
        maxAge: 60, // Changed to seconds
      });
      setCookie("refresh_token", result.data.refresh_token, {
        path: "/",
        maxAge: 2 * 60 * 60, // Changed to seconds
      });

      console.log(result.data);
      return;
    } else {
      throw new Error("Invalid response from login API");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  let authToken = getCookie("access_token");
  if (!authToken) authToken = "";
  const isAuthenticated = await testTokenApiV1AuthTestTokenPost({
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    baseUrl: "http://localhost:8000",
  });

  console.log("running func");

  if (isAuthenticated.response.statusText == "OK") {
    return true;
  }
  return false;
}

export async function refreshToken(): Promise<boolean> {
  const refreshToken = "";
  if (!refreshToken) return false;

  await refreshTokenApiV1AuthRefreshPost({ body: refreshToken })
    .then((res) => {
      if (!res.data) return false;
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
      // clearCookies();
      return false;
    });
  return false;
}
