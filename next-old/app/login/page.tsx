"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, isAuthenticated, refreshToken } from "@/lib/auth";
import { client } from "@/client";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    await login(username, password)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  const handleTest1 = async (): Promise<void> => {
    try {
      try {
        const isAuthenticatedResult = await isAuthenticated();
      } catch {
        console.log("User is not authenticated");

        // Attempt to refresh the token
        const refreshed = await refreshToken();

        if (refreshed) {
          console.log("Authentication successful after refresh");
        } else {
          console.log("Failed to authenticate after refresh");
        }
      }
    } catch {
      console.log(error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <button onClick={handleTest1}>test isAuthenticated</button>
      <button>refresh</button>
    </div>
  );
}
