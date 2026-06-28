"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  buildPagamentoPayload,
  buildPrestadorPayload,
  mapPagamentoRow,
  mapPrestadorRow,
  type CreatePagamentoInput,
  type CreatePrestadorInput,
  type PagamentoView,
  type PrestadorView
} from "@/lib/pagamentos";
import type { PagamentoRow, PrestadorRow } from "@/lib/types/database";

export function usePagamentos(obraId: string | null) {
  const [pagamentos, setPagamentos] = useState<PagamentoView[]>([]);
  const [prestadores, setPrestadores] = useState<PrestadorView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!obraId) {
      setPagamentos([]);
      setPrestadores([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const [pagRes, prestRes] = await Promise.all([
        supabase
          .from("pagamentos")
          .select("*")
          .eq("obra_id", obraId)
          .order("payment_date", { ascending: false }),
        supabase
          .from("prestadores")
          .select("*")
          .eq("obra_id", obraId)
          .order("created_at", { ascending: false })
      ]);
      if (pagRes.error || prestRes.error) {
        setError(pagRes.error?.message ?? prestRes.error?.message ?? "Erro");
        setPagamentos([]);
        setPrestadores([]);
        return;
      }
      const prestRows = (prestRes.data ?? []) as PrestadorRow[];
      const prestViews = prestRows.map(mapPrestadorRow);
      setPrestadores(prestViews);
      const prestById = new Map(prestRows.map((p) => [p.id, p]));
      setPagamentos(
        ((pagRes.data ?? []) as PagamentoRow[]).map((row) =>
          mapPagamentoRow(row, row.prestador_id ? prestById.get(row.prestador_id) : null)
        )
      );
    } catch {
      setError("Erro ao carregar pagamentos");
      setPagamentos([]);
      setPrestadores([]);
    } finally {
      setLoading(false);
    }
  }, [obraId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createPagamento = useCallback(
    async (input: Omit<CreatePagamentoInput, "obra_id">) => {
      if (!obraId) throw new Error("Selecione uma obra");
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("pagamentos")
        .insert(buildPagamentoPayload({ ...input, obra_id: obraId }));
      if (insertError) throw new Error(insertError.message);
      await refetch();
    },
    [obraId, refetch]
  );

  const createPrestador = useCallback(
    async (input: Omit<CreatePrestadorInput, "obra_id">) => {
      if (!obraId) throw new Error("Selecione uma obra");
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("prestadores")
        .insert(buildPrestadorPayload({ ...input, obra_id: obraId }))
        .select("id")
        .single();
      if (insertError) throw new Error(insertError.message);
      await refetch();
      return (data as { id: string }).id;
    },
    [obraId, refetch]
  );

  return {
    pagamentos,
    prestadores,
    loading,
    error,
    refetch,
    createPagamento,
    createPrestador
  };
}
