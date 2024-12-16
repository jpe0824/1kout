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
    console.log(`response intercepted: ${response.status}`);
    if (response.status === 401) {
      await refreshAuth();
      client.request.call(request.body, options);
    }
    if (response.status === 403) {
      logout();
    }
    return response;
  });
}
