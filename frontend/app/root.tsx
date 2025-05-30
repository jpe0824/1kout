"use client";

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { ThemeProvider } from "./hooks/theme-provider";
import "./app.css";
import { client } from "client";
// import { middleware } from "./lib/middleware";
import { Toaster } from "./components/ui/toaster";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { ShootingStars } from "./components/ui/shooting-starts";
import { StarsBackground } from "./components/ui/stars-background";
import { AuthProvider, useAuth } from "./hooks/auth-provider";
import { toast } from "./hooks/use-toast";
import { useMiddleware } from "./lib/middleware";

export function Layout({ children }: { children: React.ReactNode }) {
  const baseURL = import.meta.env.VITE_API_URL;
  client.setConfig({
    baseUrl: baseURL,
  });

  useMiddleware();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <SidebarTrigger className="z-40 m-5 absolute" size="icon" />
              {children}
              <ShootingStars className="invisible dark:visible" />
              <StarsBackground className="invisible dark:visible" />
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
        <Scripts />
        <ScrollRestoration />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
