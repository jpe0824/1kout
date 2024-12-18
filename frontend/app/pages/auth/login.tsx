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
import { zBody_login } from "client/zod.gen";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ShootingStars } from "@/components/ui/shooting-starts";
import { StarsBackground } from "@/components/ui/stars-background";
import { BodyLogin } from "client";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/auth-provider";

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof zBody_login>>({
    resolver: zodResolver(zBody_login),
    defaultValues: {
      username: undefined,
      password: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof zBody_login>) {
    setLoading(true);
    const loginData: BodyLogin = {
      username: values.username,
      password: values.password,
      grant_type: "password",
    };
    try {
      await loginUser(loginData);
      setLoading(false);
      navigate("/");
    } catch {
      setLoading(false);
      //err handled on auth.ts util
    }
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen z-30">
      <Card className="m-2 p-4 w-96 lg:w-96">
        <CardHeader>
          <CardTitle className="flex flex-row items-center">
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            Login
          </CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>
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
                    <FormLabel>
                      <div className="flex justify-between">
                        <div>Password</div>
                        <div>
                          <a className="hover:underline" href="">
                            Forgot your password?
                          </a>
                        </div>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*****" {...field} />
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
        <CardFooter className="justify-center">
          <span>Don&apos;t have an account?</span>
          <Button className="underline" variant={"link"} type="button" asChild>
            <Link to="/auth/register">Sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
