import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PreferencesSchema = z.object({
  fitness_goal: z.string(),
  experience_level: z.string(),
  workout_days: z.array(z.string()),
  equipment: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
    })
  ),
});

const RequestSchema = z.object({
  preferences: PreferencesSchema,
  includeAnalysis: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { preferences, includeAnalysis } = RequestSchema.parse(body);

    const prompt = `Generate a detailed workout plan based on the following preferences:
- Fitness Goal: ${preferences.fitness_goal}
- Experience Level: ${preferences.experience_level}
- Workout Days: ${preferences.workout_days.join(", ")}
- Available Equipment: ${preferences.equipment
      .map(
        (e: { name: string; quantity: number }) => `${e.name} (${e.quantity})`
      )
      .join(", ")}

For each exercise, include:
- Name
- Sets
- Reps
- Target muscles
- Notes on form and technique

${
  includeAnalysis
    ? `Also include a workout analysis with:
- Muscle groups covered and frequency
- Weekly volume per muscle group
- Rest periods and recovery notes
- General training tips and progression notes`
    : ""
}

Format the response as a JSON object with:
{
  "workout": {
    "monday": [{ "name": "Exercise", "sets": 3, "reps": 10, "targetMuscles": ["muscle1"], "notes": "form tips" }],
    ...
  }${
    includeAnalysis
      ? `,
  "analysis": {
    "muscleGroupsCovered": { "muscle": "frequency" },
    "weeklyVolume": { "muscle": "total sets" },
    "restPeriods": ["rest notes"],
    "notes": ["training tips"]
  }`
      : ""
  }
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    const workoutPlan = JSON.parse(response);
    return NextResponse.json(workoutPlan);
  } catch (error) {
    console.error("Error generating workout:", error);
    return NextResponse.json(
      { error: "Failed to generate workout" },
      { status: 500 }
    );
  }
}
