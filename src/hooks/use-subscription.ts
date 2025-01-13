import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import {
  checkSubscription,
  getFeatures,
  getRemainingGenerations,
} from "@/lib/subscription";

export function useSubscription() {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingGenerations, setRemainingGenerations] = useState<
    number | "unlimited"
  >(0);

  useEffect(() => {
    async function checkStatus() {
      if (!user?.id) {
        setIsPro(false);
        setRemainingGenerations(0);
        setIsLoading(false);
        return;
      }

      const isSubscribed = await checkSubscription(user.id);
      setIsPro(isSubscribed);

      if (!isSubscribed) {
        const remaining = await getRemainingGenerations(user.id);
        setRemainingGenerations(remaining);
      } else {
        setRemainingGenerations("unlimited");
      }

      setIsLoading(false);
    }

    checkStatus();
  }, [user?.id]);

  const features = getFeatures(isPro);

  return {
    isPro,
    isLoading,
    features,
    remainingGenerations,
  };
}
