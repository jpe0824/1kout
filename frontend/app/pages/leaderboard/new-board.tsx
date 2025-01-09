import { useAuth } from "@/hooks/auth-provider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import NotAuthorized from "../auth/not-authorized";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zBody_create_leaderboard } from "client/zod.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUser, createLeaderboard } from "client";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewBoard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [join, setJoin] = useState<boolean>(true);
  const [inviteCode, setInviteCode] = useState<string>();
  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof zBody_create_leaderboard>>({
    resolver: zodResolver(zBody_create_leaderboard),
    defaultValues: {
      leaderboard_name: undefined,
      picture: "",
    },
  });

  function onSubmit(values: z.infer<typeof zBody_create_leaderboard>) {
    setLoading(true);

    createLeaderboard({ body: values })
      .then((res) => {
        if (res.response.ok) {
          if (res.response.status === 401) {
            refreshAuth();
            onSubmit(values);
          }
          if (res.response.status === 403) {
            logout();
          }
          if (!res.data) throw res.error;
          if (join) {
            setInviteCode(res.data.invite_code); //Join leaderboard called if set
          } else {
            toast({ title: "Successfully created new leaderboard!" });
            navigate("/leaderboard"); // navigate to dynamic route for leaderboard
          }
        } else {
          throw res;
        }
      })
      .catch((err) => {
        //handled by middleware
      });
    setLoading(false);
  }

  useEffect(() => {
    if (!inviteCode) return;
    addUser({ query: { invite_code: inviteCode } })
      .then((res) => {
        if (!res.response.ok) throw res.error?.detail;
        toast({
          title: "Successfully created and added you to new leaderboard!",
        });
        navigate("/leaderboard"); // navigate to dynamic route for leaderboard
      })
      .catch((err) => {
        //handled by middleware
      });
  }, [inviteCode]);

  if (!user) {
    return <NotAuthorized />;
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen z-30">
      <Card className="m-2 p-4 w-96 lg:w-96">
        <CardHeader>
          <CardTitle className="flex flex-row items-center">
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            New Leaderboard
          </CardTitle>
          <CardDescription>Create a new leaderboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="leaderboard_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leaderboard Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Group Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Name used to view leaderboard
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Picture</FormLabel>
                    <FormControl>
                      <Input type="file" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <FormControl>
                  <Checkbox
                    checked={join}
                    onCheckedChange={() => {
                      setJoin(!join);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Join Leaderboard</FormLabel>
                  <FormDescription>
                    Automatically add yourself to the leaderboard.
                  </FormDescription>
                </div>
              </FormItem>
              <Button className="w-full" type="submit" disabled={loading}>
                Next
              </Button>
              <FormMessage />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center"></CardFooter>
      </Card>
    </div>
  );
}
