import { toast } from "@/hooks/use-toast";
import { BodyLogin, login, refresh, testToken, User } from "client";

export async function loginUser(loginData: BodyLogin): Promise<void> {
  await login({ body: loginData })
    .then((res) => {
      if (res.response.ok && res.data) {
        localStorage.setItem("auth_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        toast({
          title: "Successfully logged in!",
        });
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

export async function testAuth() {
  await testToken()
    .then()
    .catch((err) => {
      console.log("token not valid");
    });
}

export async function refreshAuth() {
  await refresh({ body: `${localStorage.getItem("refresh_token")}` })
    .then((res) => {
      if (res.response.ok && res.data) {
        localStorage.setItem("auth_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
      } else {
        throw res.error;
      }
    })
    .catch((err) => {
      throw err;
    });
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
}
