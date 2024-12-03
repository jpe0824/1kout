"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Home() {
  const { theme } = useTheme();

  return (
    <div className="bg-light dark:bg-dark bg-cover bg-fixed bg-left lg:bg-center xl:bg-center 2xl:bg-center">
      <div className="absolute top-0 right-0 m-5 z-10">
        <ThemeToggle />
      </div>
      <div className="flex h-screen justify-center items-center z-40">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-7xl font-bold text-center mb-12">
            Thousand Hours
          </h1>
          <div className="flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/#about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Log
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Leaderboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Timer
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
      <div className="flex h-screen justify-center items-center" id="about">
        <div className="flex flex-col justify-center">
          <h1 className="text-xl md:text-4xl font-bold text-center">
            Get Outside.
          </h1>
        </div>
      </div>

      {theme === "dark" && (
        <>
          <ShootingStars className="-z-10" />
          <StarsBackground className="-z-10" />
        </>
      )}
    </div>
  );
}
