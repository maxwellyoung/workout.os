import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import type { WorkoutAnalysis } from "./workout-tracker";

interface WorkoutAnalysisProps {
  analysis: WorkoutAnalysis;
}

export function WorkoutAnalysis({ analysis }: WorkoutAnalysisProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <InfoCircledIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-lg mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            Workout Analysis
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm sm:text-base">
            Here&apos;s a breakdown of your workout plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-medium mb-2">Muscle Groups Covered</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(analysis.muscleGroupsCovered).map(
                ([muscle, count]) => (
                  <div
                    key={muscle}
                    className="flex justify-between items-center p-2 bg-muted rounded-md"
                  >
                    <span className="capitalize">{muscle}</span>
                    <span className="text-muted-foreground">{count}x</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Weekly Volume</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(analysis.weeklyVolume).map(([muscle, volume]) => (
                <div
                  key={muscle}
                  className="flex justify-between items-center p-2 bg-muted rounded-md"
                >
                  <span className="capitalize">{muscle}</span>
                  <span className="text-muted-foreground">{volume} sets</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Rest Periods</h3>
            <ul className="list-disc list-inside space-y-1">
              {analysis.restPeriods.map((period, index) => (
                <li key={index}>{period}</li>
              ))}
            </ul>
          </div>

          {analysis.notes.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Notes</h3>
              <ul className="list-disc list-inside space-y-1">
                {analysis.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
