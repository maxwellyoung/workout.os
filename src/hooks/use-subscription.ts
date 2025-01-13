import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { checkSubscription, getFeatures } from "@/lib/subscription";

export function useSubscription() {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (!user?.id) {
        setIsPro(false);
        setIsLoading(false);
        return;
      }

      const isSubscribed = await checkSubscription(user.id);
      setIsPro(isSubscribed);
      setIsLoading(false);
    }

    checkStatus();
  }, [user?.id]);

  const features = getFeatures(isPro);

  return {
    isPro,
    isLoading,
    features,
  };
}
