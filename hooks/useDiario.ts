"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  buildDiarioPayload,
  mapDiarioEntryRow,
  type CreateDiarioInput,
  type DiarioEntryView
} from "@/lib/diario";
import type { DiarioEntryRow } from "@/lib/types/database";

export function useDiario(obraId: string | null) {
  const [entries, setEntries] = useState<DiarioEntryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!obraId) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("diario_entries")
        .select("*")
        .eq("obra_id", obraId)
        .order("entry_date", { ascending: false });
      if (fetchError) {
        setError(fetchError.message);
        setEntries([]);
        return;
      }
      setEntries((data as DiarioEntryRow[]).map(mapDiarioEntryRow));
    } catch {
      setError("Erro ao carregar diário");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [obraId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createEntry = useCallback(
    async (input: Omit<CreateDiarioInput, "obra_id">) => {
      if (!obraId) throw new Error("Selecione uma obra");
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("diario_entries")
        .insert(buildDiarioPayload({ ...input, obra_id: obraId }));
      if (insertError) throw new Error(insertError.message);
      await refetch();
    },
    [obraId, refetch]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("diario_entries")
        .delete()
        .eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      await refetch();
    },
    [refetch]
  );

  return { entries, loading, error, refetch, createEntry, deleteEntry };
}
