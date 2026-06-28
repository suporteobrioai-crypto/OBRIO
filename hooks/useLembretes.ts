"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  mapLembreteRow,
  postponeDueAt,
  type ReminderView,
  uiStatusToDbStatus
} from "@/lib/lembretes";
import type { LembreteRow } from "@/lib/types/database";

export function useLembretes(obraId: string | null) {
  const [reminders, setReminders] = useState<ReminderView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!obraId) {
      setReminders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("lembretes")
        .select("*")
        .eq("obra_id", obraId)
        .order("due_at", { ascending: true });
      if (fetchError) {
        setError(fetchError.message);
        setReminders([]);
        return;
      }
      setReminders((data as LembreteRow[]).map((row) => mapLembreteRow(row)));
    } catch {
      setError("Erro ao carregar lembretes");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, [obraId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const completeReminder = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("lembretes")
        .update({ status: "concluido", updated_at: new Date().toISOString() })
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
      await refetch();
    },
    [refetch]
  );

  const postponeReminder = useCallback(
    async (id: string) => {
      const current = reminders.find((r) => r.id === id);
      if (!current) return;
      const supabase = createClient();
      const row = (await supabase.from("lembretes").select("due_at").eq("id", id).single()).data as { due_at: string } | null;
      const nextDue = postponeDueAt(row?.due_at ?? new Date().toISOString());
      const { error: updateError } = await supabase
        .from("lembretes")
        .update({ due_at: nextDue, status: "adiado", updated_at: new Date().toISOString() })
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
      await refetch();
    },
    [reminders, refetch]
  );

  const updateTitle = useCallback(
    async (id: string, title: string) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("lembretes")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
      await refetch();
    },
    [refetch]
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("lembretes")
        .delete()
        .eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      await refetch();
    },
    [refetch]
  );

  const createReminder = useCallback(
    async (input: {
      title: string;
      due_at: string;
      priority?: "Alta" | "Media" | "Baixa";
      channel?: "app" | "whatsapp" | "ambos";
    }) => {
      if (!obraId) throw new Error("Selecione uma obra");
      const supabase = createClient();
      const { error: insertError } = await supabase.from("lembretes").insert({
        obra_id: obraId,
        title: input.title,
        due_at: input.due_at,
        priority: input.priority ?? "Media",
        channel: input.channel ?? "app",
        status: "pendente"
      });
      if (insertError) throw new Error(insertError.message);
      await refetch();
    },
    [obraId, refetch]
  );

  return {
    reminders,
    loading,
    error,
    refetch,
    completeReminder,
    postponeReminder,
    updateTitle,
    deleteReminder,
    createReminder
  };
}

export { uiStatusToDbStatus };
