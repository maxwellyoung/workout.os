import { Exercise } from './workout-tracker'
import { Button } from "@/components/ui/button"
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion"
import AddExerciseDialog from './add-exercise-dialog'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DayViewProps = {
  workouts: Exercise[]
  day: string
  toggleExercise: (exerciseId: string) => void
  addExercise: (exercise: Exercise) => void
  removeExercise: (exerciseId: string) => void
  setSelectedDay: (day: string) => void
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function DayView({ workouts, day, toggleExercise, addExercise, removeExercise, setSelectedDay }: DayViewProps) {
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={day} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-[180px] glassmorphic">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setIsAddExerciseOpen(true)} className="glassmorphic">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Exercise
        </Button>
      </div>
      <ul className="space-y-2">
        {workouts.map((exercise) => (
          <motion.li
            key={exercise.id}
            className="flex items-center justify-between p-4 glassmorphic rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleExercise(exercise.id)}
                className={`w-6 h-6 rounded-full ${
                  exercise.completed
                    ? 'bg-primary'
                    : 'bg-secondary border-2 border-primary'
                }`}
              />
              <span className="text-lg">{exercise.name} ({exercise.sets}x{exercise.reps})</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeExercise(exercise.id)}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </motion.li>
        ))}
      </ul>
      <AddExerciseDialog
        isOpen={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(false)}
        onAdd={(exercise) => {
          addExercise(exercise)
          setIsAddExerciseOpen(false)
        }}
      />
    </div>
  )
}

