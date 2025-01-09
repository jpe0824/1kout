import { useAuth } from "@/hooks/auth-provider";
import { toast } from "@/hooks/use-toast";
import { client } from "client";

export function useMiddleware() {
  const { user } = useAuth();

  client.interceptors.request.use((request, options) => {
    request.headers.set(
      "Authorization",
      `Bearer ${localStorage.getItem("access_token")}`
    );
    return request;
  });

  client.interceptors.error.use(async (error: any) => {
    console.error(error);
    if (!error.detail) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error.detail}`,
      });
    }

    return error;
  });
}
