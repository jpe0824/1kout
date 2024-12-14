import { client } from "@/client";
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
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";

client.setConfig({
  baseUrl: "http://localhost:8000",
  headers: {
    Authorization: "Bearer <token_from_service_client>",
  },
});

export default function Home() {
  return (
    <div className="bg-light dark:bg-dark bg-cover bg-fixed bg-left lg:bg-center xl:bg-center 2xl:bg-center">
      <div className="absolute top-0 right-0 m-5 z-10">
        <ThemeToggle />
      </div>
      <div className="flex h-screen justify-center items-center z-40">
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-7xl font-bold text-center mb-12">
            1,000 Hours
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
                  <Link href="/log" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Log
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/login" legacyBehavior passHref>
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
      <ShootingStars className="invisible dark:visible -z-10" />
      <StarsBackground className="invisible dark:visible -z-10" />
    </div>
  );
}
