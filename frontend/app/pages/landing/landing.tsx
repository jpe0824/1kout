import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ShootingStars } from "@/components/ui/shooting-starts";
import { M } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { StarsBackground } from "@/components/ui/stars-background";
import { Link } from "react-router";

export function Landing() {
  return (
    <main>
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
                    <Link to="/#about">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        About
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/logs">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Log
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/login">
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        Leaderboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/">
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
    </main>
  );
}
