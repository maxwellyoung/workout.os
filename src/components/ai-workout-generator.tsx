"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getSubscriptionStatus } from "@/lib/subscription";

interface Workout {
  [day: string]: Array<{
    id: string;
    name: string;
    sets: number;
    reps: number;
    completed: boolean;
    targetMuscles?: string[];
    notes?: string;
  }>;
}

interface AIWorkoutGeneratorProps {
  onWorkoutGenerated?: (workout: Workout) => void;
  saveAsRoutine?: boolean;
}

export function AIWorkoutGenerator({
  onWorkoutGenerated,
  saveAsRoutine = false,
}: AIWorkoutGeneratorProps) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [remainingGenerations, setRemainingGenerations] = useState<
    number | null
  >(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if (!user?.id) return;

      // Get subscription status
      const { isPro } = await getSubscriptionStatus(user.id);
      setIsPro(isPro);

      if (!isPro) {
        // Count existing generations in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count } = await supabase
          .from("workout_routines")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", thirtyDaysAgo.toISOString());

        setRemainingGenerations(3 - (count || 0));
      }
    }

    checkSubscription();
  }, [user]);

  async function generateWorkout() {
    if (!user) {
      toast.error("Please sign in to generate a workout");
      return;
    }

    setIsGenerating(true);
    toast.loading("Analyzing your preferences and history...");

    try {
      const response = await fetch("/api/generate-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.code === "GENERATION_LIMIT_REACHED") {
          toast.error(data.error, {
            action: {
              label: "Upgrade",
              onClick: () => (window.location.href = "/settings/billing"),
            },
          });
          return;
        }
        throw new Error("Failed to generate workout");
      }

      const workout = await response.json();

      if (saveAsRoutine) {
        toast.loading("Saving your new routine...");
        const { error } = await supabase.from("workout_routines").insert({
          user_id: user.id,
          name: workout.name,
          description: workout.description,
          workouts: workout.workouts,
          analysis: workout.analysis,
        });

        if (error) throw error;
      }

      toast.success("Workout generated successfully!");
      onWorkoutGenerated?.(workout.workouts);

      // Update remaining generations count for free users
      if (!isPro) {
        setRemainingGenerations((prev) => (prev !== null ? prev - 1 : null));
      }
    } catch (error) {
      console.error("Error generating workout:", error);
      toast.error("Failed to generate workout");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center gap-2"
    >
      <Button
        onClick={generateWorkout}
        disabled={
          isGenerating ||
          (remainingGenerations !== null && remainingGenerations <= 0)
        }
        className="bg-primary hover:bg-primary/90 min-w-[200px]"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate AI Workout"
        )}
      </Button>
      {!isPro && remainingGenerations !== null && (
        <p className="text-xs text-muted-foreground">
          {remainingGenerations} generation
          {remainingGenerations !== 1 ? "s" : ""} remaining this month
        </p>
      )}
    </motion.div>
  );
}
