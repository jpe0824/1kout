import { useAuth } from "@/hooks/auth-provider";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
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
import { ArrowLeft, CalendarIcon } from "lucide-react";
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
import { zBody_create_log } from "client/zod.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { BodyCreateLog, createLog } from "client";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z
  .object({
    start_time: z.date(),
    end_time: z.date(),
  })
  .superRefine((data, ctx) => {
    if (data.start_time > data.end_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: "Start time must be before end time.",
        path: ["start_time"],
      });
    }
  });

export default function NewLog() {
  const [loading, setLoading] = useState<boolean>(false);
  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_time: new Date(),
      end_time: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    //converting JS Date() object to datetime string
    const stringDateStart = values.start_time
      .toISOString()
      .replace("Z", "+00:00");
    console.log(stringDateStart);
    const stringDateEnd = values.end_time.toISOString().replace("Z", "+00:00");
    const createLogData: BodyCreateLog = {
      start_time: stringDateStart,
      end_time: stringDateEnd,
    };

    createLog({ body: createLogData })
      .then((res) => {
        if (res.response.status === 401) {
          refreshAuth();
          onSubmit(values);
        }
        if (res.response.status === 403) {
          logout();
        }
        if (!res.response.ok || !res.data) throw res.error;
        toast({ title: "Successfully created new log entry!" });
        navigate("/logging");
      })
      .catch((err) => {
        throw err;
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
            New Log Entry
          </CardTitle>
          <CardDescription>
            Enter your start and end times below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 bg-muted">
                          <DatetimePicker
                            selected={field.value}
                            setDate={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date and time</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4 bg-muted">
                          <DatetimePicker
                            selected={field.value}
                            setDate={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription></FormDescription>
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
