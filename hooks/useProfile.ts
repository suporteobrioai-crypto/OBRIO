"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/types/database";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
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
        setProfile(null);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (fetchError) {
        setError(fetchError.message);
        setProfile(null);
        return;
      }
      setProfile(data as ProfileRow | null);
    } catch {
      setError("Erro ao carregar perfil");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Pick<ProfileRow, "full_name" | "whatsapp" | "avatar_path" | "notification_prefs">>) => {
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (updateError) throw new Error(updateError.message);
      await refetch();
    },
    [refetch]
  );

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { profile, loading, error, refetch, updateProfile };
}
