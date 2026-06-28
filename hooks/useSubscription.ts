"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PLAN_LIMITS,
  type SubscriptionPlan,
  type SubscriptionRow
} from "@/lib/types/database";

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        setSubscription(null);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (fetchError) {
        setError(fetchError.message);
        setSubscription(null);
        return;
      }
      setSubscription(data as SubscriptionRow | null);
    } catch {
      setError("Erro ao carregar assinatura");
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const plan: SubscriptionPlan = subscription?.plan ?? "gratuito";
  const limits = PLAN_LIMITS[plan];

  return { subscription, plan, limits, loading, error, refetch };
}
