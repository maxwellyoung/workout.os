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

export function getFeatures(isPro: boolean) {
  return {
    aiWorkoutGenerations: isPro ? "unlimited" : 3,
    customTemplates: isPro,
    analytics: isPro,
    prioritySupport: isPro,
    advancedTracking: isPro,
  };
}
