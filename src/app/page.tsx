import Header from "@/components/header";
import WorkoutTracker from "@/components/workout-tracker";
import { ProtectedRoute } from "@/components/protected-route";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <ProtectedRoute>
          <WorkoutTracker saveAsRoutine={false} />
        </ProtectedRoute>
      </div>
    </main>
  );
}
