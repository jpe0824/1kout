import { useAuth } from "@/hooks/auth-provider";
import React, { useEffect, useState } from "react";
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
import { ArrowLeft, Pause, Play, Square } from "lucide-react";
import { BodyCreateLog, createLog } from "client";
import { toast } from "@/hooks/use-toast";

export default function LogTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<Date | null>(null);
  const [totalPauseTime, setTotalPauseTime] = useState(0);

  const { user, logout, refreshAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1000);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, isPaused]);

  const handleStart = () => {
    if (!isRunning) {
      setStartTime(new Date());
      setIsRunning(true);
      setIsPaused(false);
      setElapsedTime(0);
      setTotalPauseTime(0);
    } else {
      // Resuming from pause
      setIsPaused(false);
      // Calculate pause duration and add to total
      if (pauseStartTime) {
        const pauseDuration = new Date().getTime() - pauseStartTime.getTime();
        setTotalPauseTime((prev) => prev + pauseDuration);
      }
      setPauseStartTime(null);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    setPauseStartTime(new Date());
  };

  const handleStop = async () => {
    if (!startTime) return;

    setIsRunning(false);
    setIsPaused(false);

    // Calculate final pause time if stopped while paused
    let finalPauseTime = totalPauseTime;
    if (isPaused && pauseStartTime) {
      finalPauseTime += new Date().getTime() - pauseStartTime.getTime();
    }

    // Create log entry
    setLoading(true);
    const endTime = new Date();

    // Adjust end time by subtracting total pause duration
    const adjustedEndTime = new Date(endTime.getTime() - finalPauseTime);

    const createLogData: BodyCreateLog = {
      start_time: startTime.toISOString().replace("Z", "+00:00"),
      end_time: adjustedEndTime.toISOString().replace("Z", "+00:00"),
    };

    createLog({ body: createLogData })
      .then((res) => {
        if (res.response.status === 401) {
          refreshAuth();
          handleStop(); // Retry after refresh
          return;
        }
        if (res.response.status === 403) {
          logout();
          return;
        }
        if (!res.response.ok || !res.data) throw res.error;

        toast({ title: "Successfully logged time!" });
        setStartTime(null);
        setElapsedTime(0);
        setPauseStartTime(null);
        setTotalPauseTime(0);
      })
      .catch((err) => {
        //handled by middleware
      });
    setLoading(false);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

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
            Timer
          </CardTitle>
          <CardDescription>Track your time with the stopwatch.</CardDescription>
          <CardDescription>
            Don't close or refresh this tab to accurately log your time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-8">
            <div className="text-4xl font-mono">{formatTime(elapsedTime)}</div>
            <div className="flex gap-4">
              <Button
                size="icon"
                variant={isRunning && !isPaused ? "secondary" : "default"}
                onClick={handleStart}
                disabled={loading}
              >
                <Play className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant={isPaused ? "secondary" : "default"}
                onClick={handlePause}
                disabled={!isRunning || loading}
              >
                <Pause className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={handleStop}
                disabled={!isRunning || loading}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          {startTime && (
            <div className="text-sm text-muted-foreground">
              Started at: {startTime.toLocaleTimeString()}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
