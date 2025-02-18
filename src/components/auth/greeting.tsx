"use client";

import { useAuth } from "./auth-provider";

export function Greeting() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <div className="text-muted-foreground">
      <p className="text-sm">
        Welcome back,{" "}
        <span className="font-medium text-foreground">
          {user.user_metadata.full_name || user.email}
        </span>
      </p>
    </div>
  );
}
