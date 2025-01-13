import { supabase } from "./supabase";

export async function checkSubscription(userId: string) {
  if (!userId) return false;

  try {
    // First check if the subscriptions table exists
    const { error: tableError } = await supabase
      .from("subscriptions")
      .select("count")
      .limit(1);

    if (tableError?.code === "PGRST116") {
      console.log("Subscriptions table does not exist yet, creating...");
      // Table doesn't exist, create it
      const { error: createError } = await supabase.rpc(
        "create_subscriptions_table"
      );
      if (createError) {
        console.error("Error creating subscriptions table:", createError);
        return false;
      }
    }

    // Now check the subscription
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("status, price_id")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.log("Subscriptions table not found");
        return false;
      }
      if (error.code === "PGRST104") {
        console.log("No subscription found for user");
        return false;
      }
      console.error("Error fetching subscription:", error);
      return false;
    }

    return (
      subscription?.status === "active" || subscription?.status === "trialing"
    );
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
}

export async function checkWorkoutGenerationLimit(
  userId: string
): Promise<boolean> {
  if (!userId) return false;

  try {
    // First check if user is pro
    const isPro = await checkSubscription(userId);
    if (isPro) return true; // Pro users have unlimited generations

    // Check generation count in the last 30 days for free users
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count, error } = await supabase
      .from("workout_generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (error) {
      console.error("Error checking generation limit:", error);
      return false;
    }

    // Free users get 100 generations per month for testing
    return (count || 0) < 100;
  } catch (error) {
    console.error("Error checking workout generation limit:", error);
    return false;
  }
}

export function getFeatures(isPro: boolean) {
  return {
    aiWorkoutGenerations: isPro ? "unlimited" : 100,
    customTemplates: isPro,
    analytics: isPro,
    prioritySupport: isPro,
    advancedTracking: isPro,
  };
}

export async function getRemainingGenerations(userId: string): Promise<number> {
  if (!userId) return 0;

  try {
    // Check generation count in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count, error } = await supabase
      .from("workout_generations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", thirtyDaysAgo.toISOString());

    if (error) {
      console.error("Error checking generation count:", error);
      return 0;
    }

    // Free users get 100 generations per month for testing
    return 100 - (count || 0);
  } catch (error) {
    console.error("Error checking remaining generations:", error);
    return 0;
  }
}
