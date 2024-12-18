import { logUserOut, refreshToken } from "@/hooks/auth-provider";
import { client } from "client";

export function middleware() {
  client.interceptors.request.use((request, options) => {
    request.headers.set(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    return request;
  });

  client.interceptors.response.use(async (response, request, options) => {
    if (response.status === 200) return response;
    if (response.status === 401) {
      refreshToken();
      // client.request.call(request.body, options); //type issue, seems to be working ok atm
    }
    if (response.status === 403) {
      logUserOut();
    }
    return response;
  });
}
