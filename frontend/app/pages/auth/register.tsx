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
import { Input } from "@/components/ui/input";
import { ShootingStars } from "@/components/ui/shooting-starts";
import { StarsBackground } from "@/components/ui/stars-background";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastAction } from "@radix-ui/react-toast";
import { BodyRegisterUser, registerUser } from "client";
import { zBody_register_user } from "client/zod.gen";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

export default function RegisterUser() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof zBody_register_user>>({
    resolver: zodResolver(zBody_register_user),
    defaultValues: {
      email: undefined,
      password: undefined,
      nick_name: undefined,
      first_name: undefined,
      last_name: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof zBody_register_user>) {
    setLoading(true);
    const formData: BodyRegisterUser = {
      email: values.email,
      password: values.password,
      nick_name: values.nick_name,
      first_name: values.first_name,
      last_name: values.last_name,
    };
    registerUser({ body: formData })
      .then((res) => {
        if (res.response.ok) {
          toast({
            title: "Successfully created new user!",
            description: `Welcome ${values?.nick_name || ""}`,
          });
          navigate("/auth/login");
        } else {
          throw res.error?.detail;
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${err}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      });
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen z-30">
      <Card className="m-2 p-4 w-96 lg:w-96">
        <CardHeader>
          <CardTitle className="flex flex-row items-center">
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            Sign Up
          </CardTitle>
          <CardDescription>
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>Email used to sign in.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*****" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nick_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname*</FormLabel>
                    <FormControl>
                      <Input placeholder="Bob" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your display name on the site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bob" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ross" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={loading}>
                Next
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center"></CardFooter>
      </Card>
    </div>
  );
}
