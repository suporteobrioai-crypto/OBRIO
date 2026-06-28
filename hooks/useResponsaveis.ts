"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  buildResponsavelPayload,
  mapResponsavelRow,
  type CreateResponsavelInput,
  type ResponsavelView
} from "@/lib/responsaveis";
import type { ObraView } from "@/lib/obras";
import type { ResponsavelRow } from "@/lib/types/database";

export function useResponsaveis(obras: ObraView[]) {
  const [responsaveis, setResponsaveis] = useState<ResponsavelView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obraNameById = useCallback(
    (id: string) => obras.find((o) => o.id === id)?.name ?? "Obra",
    [obras]
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("responsaveis")
        .select("*")
        .order("created_at", { ascending: false });
      if (fetchError) {
        setError(fetchError.message);
        setResponsaveis([]);
        return;
      }
      setResponsaveis(
        (data as ResponsavelRow[]).map((row) =>
          mapResponsavelRow(row, obraNameById(row.obra_id))
        )
      );
    } catch {
      setError("Erro ao carregar responsáveis");
      setResponsaveis([]);
    } finally {
      setLoading(false);
    }
  }, [obraNameById]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createResponsavel = useCallback(
    async (input: CreateResponsavelInput) => {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("responsaveis")
        .insert(buildResponsavelPayload(input));
      if (insertError) throw new Error(insertError.message);
      await refetch();
    },
    [refetch]
  );

  const updateResponsavel = useCallback(
    async (id: string, input: Partial<CreateResponsavelInput>) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("responsaveis")
        .update(input)
        .eq("id", id);
      if (updateError) throw new Error(updateError.message);
      await refetch();
    },
    [refetch]
  );

  const deleteResponsavel = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("responsaveis")
        .delete()
        .eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      await refetch();
    },
    [refetch]
  );

  return {
    responsaveis,
    loading,
    error,
    refetch,
    createResponsavel,
    updateResponsavel,
    deleteResponsavel
  };
}
