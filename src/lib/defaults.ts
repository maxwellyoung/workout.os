import { Workout, Equipment } from '@/components/workout-tracker'

export const defaultWorkouts: Workout = {
  'Monday': [
    { id: '1', name: 'Dumbbell Chest Press', sets: 3, reps: 10, completed: false },
    { id: '2', name: 'Dumbbell Bicep Curls', sets: 3, reps: 12, completed: false },
    { id: '3', name: 'Dumbbell Tricep Pulls', sets: 3, reps: 12, completed: false },
    { id: '4', name: 'Pull-Ups', sets: 3, reps: 8, completed: false },
    { id: '5', name: 'Jump Rope', sets: 1, reps: 1, completed: false },
    { id: '6', name: 'Yoga', sets: 1, reps: 1, completed: false },
  ],
  'Tuesday': [
    { id: '7', name: 'Ab Wheel Rollouts', sets: 3, reps: 10, completed: false },
    { id: '8', name: 'Jump Rope (Cardio)', sets: 1, reps: 1, completed: false },
    { id: '9', name: 'Football Drills/Play', sets: 1, reps: 1, completed: false },
    { id: '10', name: 'Yoga', sets: 1, reps: 1, completed: false },
  ],
  'Wednesday': [],
  'Thursday': [
    { id: '11', name: 'Dumbbell Chest Press', sets: 3, reps: 10, completed: false },
    { id: '12', name: 'Dumbbell Bicep Curls', sets: 3, reps: 12, completed: false },
    { id: '13', name: 'Dumbbell Tricep Pulls', sets: 3, reps: 12, completed: false },
    { id: '14', name: 'Pull-Ups', sets: 3, reps: 8, completed: false },
    { id: '15', name: 'Jump Rope', sets: 1, reps: 1, completed: false },
    { id: '16', name: 'Yoga', sets: 1, reps: 1, completed: false },
  ],
  'Friday': [
    { id: '17', name: 'Ab Wheel Rollouts', sets: 3, reps: 10, completed: false },
    { id: '18', name: 'Jump Rope (Cardio)', sets: 1, reps: 1, completed: false },
    { id: '19', name: 'Football Drills/Play', sets: 1, reps: 1, completed: false },
    { id: '20', name: 'Yoga', sets: 1, reps: 1, completed: false },
  ],
  'Saturday': [
    { id: '21', name: 'Dumbbell Chest Press', sets: 3, reps: 10, completed: false },
    { id: '22', name: 'Dumbbell Bicep Curls', sets: 3, reps: 12, completed: false },
    { id: '23', name: 'Dumbbell Tricep Pulls', sets: 3, reps: 12, completed: false },
    { id: '24', name: 'Pull-Ups', sets: 3, reps: 8, completed: false },
    { id: '25', name: 'Jump Rope', sets: 1, reps: 1, completed: false },
    { id: '26', name: 'Yoga', sets: 1, reps: 1, completed: false },
  ],
  'Sunday': [
    { id: '27', name: 'Full-Body Stretch', sets: 1, reps: 1, completed: false },
  ],
}

export const defaultEquipment: Equipment[] = [
  { id: '1', name: 'Dumbbells (10kg)', quantity: 2 },
  { id: '2', name: 'Pull-up Bar', quantity: 1 },
  { id: '3', name: 'Jump Rope', quantity: 1 },
  { id: '4', name: 'Ab Wheel', quantity: 1 },
  { id: '5', name: 'Yoga Mat', quantity: 1 },
  { id: '6', name: 'Football', quantity: 1 },
]

