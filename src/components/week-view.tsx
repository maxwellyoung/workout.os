import { Exercise, Workout } from "./workout-tracker";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import AddExerciseDialog from "./add-exercise-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

type WeekViewProps = {
  workouts: Workout;
  toggleExercise: (day: string, exerciseId: string) => void;
  addExercise: (day: string, exercise: Exercise) => void;
  removeExercise: (day: string, exerciseId: string) => void;
};

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeekView({
  workouts,
  toggleExercise,
  addExercise,
  removeExercise,
}: WeekViewProps) {
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState<{
    isOpen: boolean;
    day: string | null;
  }>({
    isOpen: false,
    day: null,
  });

  return (
    <>
      {/* Mobile View */}
      <div className="block lg:hidden space-y-6">
        {daysOfWeek.map((day) => (
          <div key={day} className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-lg font-semibold">{day}</h3>
              <Button
                onClick={() => setIsAddExerciseOpen({ isOpen: true, day })}
                className="w-full sm:w-auto text-sm"
                variant="outline"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workouts[day].map((exercise) => (
                <motion.div
                  key={exercise.id}
                  className={cn(
                    "flex flex-col justify-between p-4 glassmorphic rounded-lg",
                    exercise.completed && "opacity-50"
                  )}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(day, exercise.id)}
                      className="h-8 w-8 p-0"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant={exercise.completed ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleExercise(day, exercise.id)}
                    className="mt-4 w-full text-sm"
                  >
                    {exercise.completed ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                </motion.div>
              ))}
              {workouts[day].length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <p>No exercises scheduled for {day}</p>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddExerciseOpen({ isOpen: true, day })}
                    className="mt-2"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Exercise
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg">{day}</h3>
              </div>
              <div className="space-y-2">
                {workouts[day].map((exercise) => (
                  <motion.div
                    key={exercise.id}
                    className={cn(
                      "glassmorphic rounded-lg p-3",
                      exercise.completed && "opacity-50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{exercise.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {exercise.sets} × {exercise.reps}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(day, exercise.id)}
                        className="h-6 w-6 p-0"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant={exercise.completed ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleExercise(day, exercise.id)}
                      className="w-full text-xs"
                    >
                      {exercise.completed ? "Incomplete" : "Complete"}
                    </Button>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddExerciseOpen({ isOpen: true, day })}
                  className="w-full text-xs"
                >
                  <PlusIcon className="mr-1 h-3 w-3" /> Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddExerciseDialog
        isOpen={isAddExerciseOpen.isOpen}
        onClose={() => setIsAddExerciseOpen({ isOpen: false, day: null })}
        onAdd={(exercise) => {
          if (isAddExerciseOpen.day) {
            addExercise(isAddExerciseOpen.day, exercise);
            setIsAddExerciseOpen({ isOpen: false, day: null });
          }
        }}
      />
    </>
  );
}
