import { client } from "client";
import { logout, refreshAuth } from "./auth";

export function middleware() {
  client.interceptors.request.use((request, options) => {
    request.headers.set(
      "Authorization",
      `Bearer ${localStorage.getItem("auth_token")}`
    );
    return request;
  });

  client.interceptors.response.use(async (response, request, options) => {
    if (response.status === 200) return response;
    if (response.status === 401) {
      await refreshAuth();
      client.request.call(request.body, options); //type issue, seems to be working ok atm
    }
    if (response.status === 403) {
      logout();
    }
    return response;
  });
}
