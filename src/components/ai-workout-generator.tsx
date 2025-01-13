"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "./auth/auth-provider";
import { useSubscription } from "@/hooks/use-subscription";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
  targetMuscles?: string[];
  notes?: string;
}

interface WorkoutData {
  [day: string]: Exercise[];
}

interface AIWorkoutGeneratorProps {
  onWorkoutGenerated: (workout: WorkoutData) => void | Promise<void>;
  saveAsRoutine?: boolean;
}

export function AIWorkoutGenerator({
  onWorkoutGenerated,
  saveAsRoutine,
}: AIWorkoutGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { isPro, remainingGenerations } = useSubscription();

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please sign in to generate workouts");
      return;
    }

    if (!isPro && remainingGenerations === 0) {
      toast.error(
        "You've reached your monthly limit. Upgrade to Pro for unlimited generations!"
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, saveAsRoutine }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.code === "generation_limit_exceeded" && !isPro) {
          toast.error(
            "You've reached your monthly limit. Upgrade to Pro for unlimited generations!"
          );
          return;
        }
        throw new Error("Failed to generate workout");
      }

      const workout = await response.json();
      await onWorkoutGenerated(workout);
      toast.success("Workout generated successfully!");
    } catch (error) {
      console.error("Error generating workout:", error);
      toast.error("Failed to generate workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Workout"}
      </Button>
      {!isPro && (
        <p className="text-xs text-muted-foreground text-center">
          {remainingGenerations} generations remaining
        </p>
      )}
    </div>
  );
}
