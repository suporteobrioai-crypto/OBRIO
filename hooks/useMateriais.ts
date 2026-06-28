"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  buildCompraPayload,
  buildMaterialPayload,
  mapCompraRow,
  mapMaterialRow,
  type CompraView,
  type CreateCompraInput,
  type CreateMaterialInput,
  type MaterialView
} from "@/lib/materiais";
import type { CompraRow, MaterialRow } from "@/lib/types/database";

export function useMateriais(obraId: string | null) {
  const [compras, setCompras] = useState<CompraView[]>([]);
  const [materiais, setMateriais] = useState<MaterialView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!obraId) {
      setCompras([]);
      setMateriais([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const [comprasRes, materiaisRes] = await Promise.all([
        supabase
          .from("compras")
          .select("*")
          .eq("obra_id", obraId)
          .order("purchase_date", { ascending: false }),
        supabase
          .from("materiais")
          .select("*")
          .eq("obra_id", obraId)
          .order("created_at", { ascending: false })
      ]);
      if (comprasRes.error || materiaisRes.error) {
        setError(comprasRes.error?.message ?? materiaisRes.error?.message ?? "Erro");
        setCompras([]);
        setMateriais([]);
        return;
      }
      setCompras((comprasRes.data as CompraRow[]).map(mapCompraRow));
      setMateriais((materiaisRes.data as MaterialRow[]).map(mapMaterialRow));
    } catch {
      setError("Erro ao carregar materiais");
      setCompras([]);
      setMateriais([]);
    } finally {
      setLoading(false);
    }
  }, [obraId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const createCompra = useCallback(
    async (input: Omit<CreateCompraInput, "obra_id">) => {
      if (!obraId) throw new Error("Selecione uma obra");
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("compras")
        .insert(buildCompraPayload({ ...input, obra_id: obraId }));
      if (insertError) throw new Error(insertError.message);
      await refetch();
    },
    [obraId, refetch]
  );

  const createMaterial = useCallback(
    async (input: Omit<CreateMaterialInput, "obra_id">) => {
      if (!obraId) throw new Error("Selecione uma obra");
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("materiais")
        .insert(buildMaterialPayload({ ...input, obra_id: obraId }));
      if (insertError) throw new Error(insertError.message);
      await refetch();
    },
    [obraId, refetch]
  );

  return {
    compras,
    materiais,
    loading,
    error,
    refetch,
    createCompra,
    createMaterial
  };
}
