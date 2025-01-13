"use client";

import { Button } from "../ui/button";
import { useAuth } from "@/lib/auth";
import { LoadingSpinner } from "../ui/loading-spinner";

export function SignIn() {
  const { signIn, loading } = useAuth();

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-2xl font-bold">Welcome to Workout.OS</h1>
      <p className="text-muted-foreground">
        Your AI-powered workout companion for personalized routines based on
        your goals and equipment
      </p>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p>• Generate custom workouts based on your fitness goals</p>
        <p>• Track progress across different muscle groups</p>
        <p>• Adapt routines based on available equipment</p>
        <p>• Save and reuse your favorite workouts</p>
      </div>
      <Button onClick={signIn} disabled={loading} className="w-full max-w-sm">
        {loading ? (
          <LoadingSpinner className="mr-2 h-4 w-4" />
        ) : (
          "Continue with Google"
        )}
      </Button>
    </div>
  );
}
