import { useAuth } from "@/hooks/auth-provider";
import React from "react";
import { useNavigate } from "react-router";
import NotAuthorized from "../auth/not-authorized";

export default function LogHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <NotAuthorized />;
  }

  return <div>log history</div>;
}
