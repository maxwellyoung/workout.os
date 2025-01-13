import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase-admin";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userId, input } = await request.json();

    if (!userId || !input) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
      Analyze the following workout-related text and extract relevant information.
      If it's about a future intention, classify as "intention". If it's about a completed workout, classify as "completion".
      
      Text: "${input}"
      
      Return a JSON object with these fields (include only if mentioned or clearly implied):
      {
        "type": "intention" or "completion",
        "exercise": name of exercise if mentioned,
        "weight": weight in lbs if mentioned (number only),
        "sets": number of sets if mentioned (number only),
        "reps": number of reps if mentioned (number only),
        "intensity": "low", "medium", or "high" based on context,
        "mood": emotional state or energy level if mentioned,
        "notes": any additional relevant information
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a fitness tracking assistant that analyzes workout-related text and extracts structured data.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error("Invalid response from OpenAI");
    }

    const content = response.choices[0].message.content;
    let processed;

    try {
      processed = JSON.parse(content);
    } catch {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error("Invalid JSON response from OpenAI");
    }

    // Ensure type is always set
    if (!processed.type) {
      processed.type = "completion";
    }

    // Store in Supabase using admin client
    const { error: supabaseError } = await supabaseAdmin
      .from("workout_stats")
      .insert({
        user_id: userId,
        raw_input: input,
        processed_data: processed,
        type: processed.type,
        exercise: processed.exercise,
        weight: processed.weight,
        sets: processed.sets,
        reps: processed.reps,
        intensity: processed.intensity,
        mood: processed.mood,
        notes: processed.notes,
        created_at: new Date().toISOString(),
      });

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      throw new Error("Failed to save workout stats");
    }

    return NextResponse.json(processed);
  } catch (error) {
    console.error("Error processing stats:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process stats";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
