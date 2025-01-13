export async function checkWorkoutGenerationLimit(
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription/check-limit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to check generation limit");
    }

    const data = await response.json();
    return data.canGenerate;
  } catch (error) {
    console.error("Error checking workout generation limit:", error);
    return false;
  }
}

export async function getSubscriptionStatus(userId: string) {
  try {
    const response = await fetch("/api/subscription/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to get subscription status");
    }

    const data = await response.json();
    return {
      isPro: data.isPro,
      status: data.status,
    };
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return {
      isPro: false,
      status: "free",
    };
  }
}
