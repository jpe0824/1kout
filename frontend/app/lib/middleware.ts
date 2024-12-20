import { toast } from "@/hooks/use-toast";
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
    if (response.ok) {
      return response;
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
      });
      return response;
    }
    if (response.status === 401) {
      // logUserOut();
      // client.request.call(request.body, options); //type issue, seems to be working ok atm
    }
    if (response.status === 403) {
    }
    return response;
  });
}
