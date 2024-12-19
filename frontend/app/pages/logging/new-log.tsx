import { useAuth } from "@/hooks/auth-provider";
import React from "react";
import { useNavigate } from "react-router";
import NotAuthorized from "../auth/not-authorized";

export default function NewLog() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <NotAuthorized />;
  }

  return <div>New Log</div>;
}
