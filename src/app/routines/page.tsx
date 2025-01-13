"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { motion } from "framer-motion";
import WorkoutTracker from "@/components/workout-tracker";
import Header from "@/components/header";
import { ProtectedRoute } from "@/components/protected-route";
import { AIWorkoutGenerator } from "@/components/ai-workout-generator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { processStatsUpdate } from "@/lib/stats-processor";

interface WorkoutRoutine {
  id: string;
  user_id: string;
  name: string;
  description: string;
  workouts: {
    [day: string]: Array<{
      id: string;
      name: string;
      sets: number;
      reps: number;
      completed: boolean;
      targetMuscles?: string[];
      notes?: string;
    }>;
  };
  analysis?: {
    muscleGroupsCovered: { [key: string]: number };
    weeklyVolume: { [key: string]: number };
    restPeriods: string[];
    notes: string[];
  };
  created_at: string;
  updated_at: string;
}

export default function RoutinesPage() {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);
  const [previewRoutine, setPreviewRoutine] = useState<WorkoutRoutine | null>(
    null
  );
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);
  const [statsInput, setStatsInput] = useState("");

  const fetchRoutines = useCallback(async () => {
    try {
      if (!user?.id) {
        console.error("No user ID found");
        return;
      }

      const { data, error } = await supabase
        .from("workout_routines")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error fetching routines:", {
          code: error.code,
          message: error.message,
          details: error.details,
        });

        if (error.code === "PGRST116") {
          // No data found - this is fine for new users
          setRoutines([]);
          return;
        }

        if (error.code === "42P01") {
          // Table doesn't exist
          toast.error(
            "Workout routines table not found. Please set up the database."
          );
          return;
        }

        throw error;
      }

      if (!data) {
        console.log("No routines found for user");
        setRoutines([]);
        return;
      }

      console.log("Fetched routines:", data);
      setRoutines(data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching routines:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
        toast.error(`Failed to load workout routines: ${error.message}`);
      } else {
        console.error("Unknown error fetching routines:", error);
        toast.error("Failed to load workout routines");
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRoutines();
    }
  }, [user, fetchRoutines]);

  async function deleteRoutine(routineId: string) {
    try {
      if (!user?.id) {
        console.error("No user ID found");
        return;
      }

      const { error } = await supabase
        .from("workout_routines")
        .delete()
        .eq("id", routineId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Supabase error deleting routine:", error);
        throw error;
      }

      setRoutines((prev) => prev.filter((routine) => routine.id !== routineId));
      toast.success("Routine deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting routine:", error.message);
        toast.error(`Failed to delete routine: ${error.message}`);
      } else {
        console.error("Unknown error deleting routine:", error);
        toast.error("Failed to delete routine");
      }
    }
  }

  const handleWorkoutGenerated = async () => {
    await fetchRoutines();
  };

  const handleLoadRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine.id);
  };

  const updateStats = async () => {
    setIsUpdatingStats(true);
    try {
      if (!user?.id) throw new Error("No user ID found");

      const processed = await processStatsUpdate(user.id, statsInput);

      if (processed.type === "intention") {
        toast.success("Workout intention saved");
      } else {
        toast.success("Workout stats recorded");
      }

      setStatsInput("");
    } catch (error) {
      console.error("Error updating stats:", error);
      toast.error("Failed to update stats");
    } finally {
      setIsUpdatingStats(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative">
        <div className="fixed inset-0 grid-pattern opacity-[0.03]" />
        <div className="fixed inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="relative">
          <Header />
          <main className="container mx-auto p-4 space-y-6">
            {!selectedRoutine && (
              <div className="flex flex-col space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <textarea
                      placeholder="Quick update (e.g., 'Feeling strong today, aiming for new PR on bench' or 'Completed 3 sets of squats at 225lbs')"
                      value={statsInput}
                      onChange={(e) => setStatsInput(e.target.value)}
                      className="w-full h-20 px-3 py-2 text-sm rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button
                    onClick={updateStats}
                    disabled={!statsInput.trim() || isUpdatingStats}
                    className="shrink-0"
                  >
                    {isUpdatingStats ? "Updating..." : "Update"}
                  </Button>
                </div>
              </div>
            )}

            {selectedRoutine ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRoutine(null)}
                  className="mb-4"
                >
                  Back to Routines
                </Button>
                {selectedRoutine === "new" ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Create New Routine</h2>
                    <p className="text-muted-foreground">
                      Use our AI to generate a personalized workout routine
                      based on your preferences.
                    </p>
                    <div className="flex justify-center py-4">
                      <AIWorkoutGenerator
                        onWorkoutGenerated={handleWorkoutGenerated}
                        saveAsRoutine={true}
                      />
                    </div>
                  </div>
                ) : (
                  <WorkoutTracker key={selectedRoutine} saveAsRoutine={false} />
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Workout Routines</h1>
                  <AIWorkoutGenerator
                    onWorkoutGenerated={handleWorkoutGenerated}
                    saveAsRoutine={true}
                  />
                </div>

                {!selectedRoutine && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {routines.map((routine) => (
                      <motion.div
                        key={routine.id}
                        className="glassmorphic rounded-lg p-4 flex flex-col"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 10,
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{routine.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRoutine(routine.id)}
                              className="h-8 w-8 p-0"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {routine.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created:{" "}
                            {new Date(routine.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setPreviewRoutine(routine)}
                          >
                            View
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => handleLoadRoutine(routine)}
                          >
                            Load
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {previewRoutine && (
        <Dialog
          open={!!previewRoutine}
          onOpenChange={() => setPreviewRoutine(null)}
        >
          <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl">
                {previewRoutine?.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {previewRoutine?.description}
              </p>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex gap-6 p-6 min-w-max">
                  {previewRoutine?.workouts &&
                    Object.entries(previewRoutine.workouts).map(
                      ([day, exercises], dayIndex) => (
                        <div
                          key={`${previewRoutine.id}-${day}-${dayIndex}`}
                          className="w-[350px] flex-none space-y-4"
                        >
                          <h3 className="text-lg font-semibold capitalize">
                            {day}
                          </h3>
                          <div className="space-y-3">
                            {exercises.map((exercise, exerciseIndex) => (
                              <div
                                key={exercise.id || `${day}-${exerciseIndex}`}
                                className="glassmorphic rounded-lg p-4 space-y-2"
                              >
                                <h4 className="font-medium">{exercise.name}</h4>
                                <div className="text-sm text-muted-foreground">
                                  {exercise.sets} sets × {exercise.reps} reps
                                </div>
                                {exercise.notes && (
                                  <p className="text-sm text-muted-foreground border-t pt-2 mt-2">
                                    {exercise.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => setPreviewRoutine(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  if (previewRoutine) {
                    handleLoadRoutine(previewRoutine);
                    setPreviewRoutine(null);
                  }
                }}
              >
                Load Routine
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ProtectedRoute>
  );
}
