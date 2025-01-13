import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get user's subscription status
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    // If user has a pro subscription, allow unlimited generations
    if (subscription?.status === "active") {
      return NextResponse.json({ canGenerate: true });
    }

    // Count workout generations in the last 30 days
    const { count, error } = await supabaseAdmin
      .from("workout_generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (error) {
      console.error("Error checking workout generation limit:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Free users get 100 generations per month for testing
    return NextResponse.json({ canGenerate: (count || 0) < 100 });
  } catch (error) {
    console.error("Error in check-limit route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
