import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/auth-provider";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import NotAuthorized from "../auth/not-authorized";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUser } from "client";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const formSchema = z.object({
  invite_code: z.string(),
});

export default function JoinBoard() {
  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invite_code: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    addUser({ query: values })
      .then((res) => {
        if (res.response.status === 401) {
          refreshAuth();
          onSubmit(values);
        }
        if (res.response.status === 403) {
          logout();
        }
        if (res.response.ok) {
          if (!res.data) throw res.error;

          toast({ title: "Successfully added to leaderboard!" });
          navigate("/leaderboard"); // navigate to dynamic route for leaderboard
        } else {
          throw res;
        }
      })
      .catch((err) => {
        //handled by middleware
      });
    setLoading(false);
  }

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
            Join a Leaderboard
          </CardTitle>
          <CardDescription>Join with an invite code.</CardDescription>
          <CardDescription>
            No invite code? Create a new leaderboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="invite_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={8} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
