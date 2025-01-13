import { useState } from 'react'
import { Exercise } from './workout-tracker'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AddExerciseDialogProps = {
  isOpen: boolean
  onClose: () => void
  onAdd: (exercise: Exercise) => void
}

export default function AddExerciseDialog({ isOpen, onClose, onAdd }: AddExerciseDialogProps) {
  const [name, setName] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && sets && reps) {
      onAdd({
        id: Date.now().toString(),
        name,
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
        completed: false
      })
      setName('')
      setSets('')
      setReps('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphic">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Add New Exercise</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Push-ups"
            />
          </div>
          <div>
            <Label htmlFor="sets">Number of Sets</Label>
            <Input
              id="sets"
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder="e.g., 3"
            />
          </div>
          <div>
            <Label htmlFor="reps">Number of Reps</Label>
            <Input
              id="reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <Button type="submit">Add Exercise</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

