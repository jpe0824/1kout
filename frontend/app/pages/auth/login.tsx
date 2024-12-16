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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { zBody_login } from "client/zod.gen";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ShootingStars } from "@/components/ui/shooting-starts";
import { StarsBackground } from "@/components/ui/stars-background";
import { loginUser, testAuth } from "@/lib/auth";
import { BodyLogin, LoginData } from "client";

export default function Login() {
  const form = useForm<z.infer<typeof zBody_login>>({
    resolver: zodResolver(zBody_login),
    defaultValues: {
      username: undefined,
      password: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof zBody_login>) {
    const loginData: BodyLogin = {
      username: values.username,
      password: values.password,
      grant_type: "password",
    };
    loginUser(loginData);
  }

  function onTest() {
    testAuth();
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="m-2 p-4 w-96 lg:w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in for full access</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*****" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant={"link"} type="button">
                Register?
              </Button>
              <Button type="submit">Next</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Button onClick={onTest}>Test Token</Button>
      <ShootingStars className="invisible dark:visible -z-10" />
      <StarsBackground className="invisible dark:visible -z-10" />
    </div>
  );
}
