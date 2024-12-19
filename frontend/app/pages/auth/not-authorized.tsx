import { Button } from "@/components/ui/button";
import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";

export default function NotAuthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen z-30">
      <div className="flex flex-col items-center">
        <LockKeyhole size={40} />
        <h1 className="text-lg my-4">
          Oops! You must be logged in to view this page.
        </h1>
        <div>
          <Button
            onClick={() => {
              navigate("/auth/login");
            }}
          >
            <LogIn />
            Login
          </Button>
          <span className="mx-2">or</span>
          <Button
            onClick={() => {
              navigate("/auth/register");
            }}
          >
            <UserRound />
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
