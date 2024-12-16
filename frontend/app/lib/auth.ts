import { BodyLogin, login, refresh, testToken } from "client";

export async function loginUser(loginData: BodyLogin) {
  await login({ body: loginData })
    .then((res) => {
      if (res.response.ok && res.data) {
        localStorage.setItem("auth_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
      } else {
        throw res.response.status;
      }
    })
    .catch((err) => {
      console.log("error");
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
        throw res.response.status;
      }
    })
    .catch();
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("refresh_token");
}
