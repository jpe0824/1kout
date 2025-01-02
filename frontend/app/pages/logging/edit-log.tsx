import { useAuth } from "@/hooks/auth-provider";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
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
import {
  BodyCreateLog,
  createLog,
  editLog,
  EditLogData,
  getLogById,
  Log,
  LogUpdate,
} from "client";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const formSchema = z.object({
  start_time: z.date(),
  end_time: z.date(),
});

export default function EditLog() {
  const [loading, setLoading] = useState<boolean>(true);
  const [logId, setLogId] = useState<string>("");
  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [log, setLog] = useState<Log | null>(null);

  useEffect(() => {
    const logIdQuery = searchParams.get("id");
    if (!logIdQuery) throw "404 not found";
    setLogId(logIdQuery);
  }, []);

  useEffect(() => {
    if (!logId) return;
    getLogById({ path: { logid: logId } })
      .then((res) => {
        if (!res.response.ok || !res.data) throw res.error?.detail;
        setLog(res.data);
      })
      .catch((err) => {
        // if (err.response.status === 403) {
        //   console.log("error 403");
        //   logout();
        // }
        // toast({
        //   variant: "destructive",
        //   title: "Uh oh! Something went wrong.",
        //   description: `${err.error.detail}`,
        //   action: (
        //     <ToastAction altText="Try again">
        //       <Button
        //         onClick={() => {
        //           if (err.response.status === 401) {
        //             console.log("error 401");
        //             refreshAuth();
        //           }
        //         }}
        //       >
        //         Try again
        //       </Button>
        //     </ToastAction>
        //   ),
        // });
      });
    setLoading(false);
  }, [logId]);

  useEffect(() => {
    if (!log) return;
    form.reset({
      start_time: new Date(log.start_time.replace("+00:00", "Z")),
      end_time: new Date(log.end_time.replace("+00:00", "Z")),
    });
  }, [log]);

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
    const stringDateEnd = values.end_time.toISOString().replace("Z", "+00:00");
    const editLogData: LogUpdate = {
      start_time: stringDateStart,
      end_time: stringDateEnd,
    };

    editLog({ body: editLogData, path: { logid: logId } })
      .then((res) => {
        if (res.response.ok) {
          toast({ title: "Successfully updated the log!" });
          navigate("/logging");
        } else {
          throw res;
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${err.error.detail}`,
          action: (
            <ToastAction altText="Try again">
              <Button
                onClick={() => {
                  if (err.response.status === 401) {
                    console.log("error 401");
                  }
                  if (err.response.status === 403) {
                    console.log("error 403");
                  }
                }}
              >
                Try again
              </Button>
            </ToastAction>
          ),
        });
      });
    setLoading(false);
  }

  if (!user) {
    return <NotAuthorized />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen z-30">
      <Card className="m-2 p-4 w-96 lg:w-96">
        <CardHeader>
          <CardTitle className="flex flex-row items-center">
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            Edit Log
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
