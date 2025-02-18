import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase";

export function useIntention() {
  const { user } = useAuth();
  const [intention, setIntention] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIntention() {
      if (!user?.id) {
        setIntention(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("workout_stats")
          .select("raw_input, type")
          .eq("user_id", user.id)
          .eq("type", "intention")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code !== "PGRST116") {
            // No data found
            console.error("Error fetching intention:", error);
          }
          setIntention(null);
        } else {
          setIntention(data.raw_input);
        }
      } catch (error) {
        console.error("Error in fetchIntention:", error);
        setIntention(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIntention();
  }, [user?.id]);

  return {
    intention,
    isLoading,
  };
}
