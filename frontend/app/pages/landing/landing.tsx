"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ShootingStars } from "@/components/ui/shooting-starts";
import { StarsBackground } from "@/components/ui/stars-background";
import { useAuth } from "@/hooks/auth-provider";
import { formatTime, formatTimeToHours } from "@/lib/utils";
import { getTotalHours, TotalHours } from "client";
import Autoplay from "embla-carousel-autoplay";
import React, { useEffect, useState } from "react";

export function Landing() {
  const { user, refreshAuth, logout } = useAuth();
  const [hours, setHours] = useState<TotalHours | null>(null);

  const getHours = async () => {
    if (!user) return;
    await getTotalHours()
      .then((res) => {
        if (res.response.status === 401) {
          refreshAuth();
          getHours();
        }
        if (res.response.status === 403) {
          logout();
        }
        if (!res.response.ok || !res.data) throw res.error;
        setHours(res.data);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    getHours();
  }, [user]);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );
  return (
    <div className="bg-light dark:bg-dark bg-cover bg-fixed bg-left lg:bg-center xl:bg-center 2xl:bg-center z-30">
      <div className="absolute top-0 right-0 m-5">
        <ThemeToggle />
      </div>
      <div className="flex flex-col h-screen justify-center items-center">
        <div className="flex basis-1/3 justify-center items-center">
          <h1 className="font-pacifico text-5xl md:text-7xl font-bold text-center">
            1,000 Hours
          </h1>
        </div>
        <div className="flex basis-1/12 justify-center items-center">
          {user ? (
            <div className="flex flex-col text-center">
              <h1 className="text-xl md:text-2xl font-semibold">
                Hi {user.first_name || "there"}, you've spent
              </h1>
              <h1 className="font-pacifico text-3xl md:text-5xl font-bold my-4">
                {formatTimeToHours(hours?.hours || "00:00:00")} hours outside!
              </h1>
            </div>
          ) : (
            <h1 className="text-2xl md:text-4xl font-bold text-center">
              Get Outside.
            </h1>
          )}
        </div>
        <div className="flex basis-1/12 justify-center items-center bg-muted/25 lg:bg-transparent">
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-md"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="flex justify-center items-center">
              <CarouselItem className="text-center font-semibold p-6">
                The average person spends x minutes outside.
              </CarouselItem>
              <CarouselItem className="text-center font-semibold p-6">
                Sit laborum recusandae debitis at magni.
              </CarouselItem>
              <CarouselItem className="text-center font-semibold p-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
