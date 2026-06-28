"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapObraRow, mapObraRowToShell, type ObraView, type ShellProject } from "@/lib/obras";
import type { ObraRow } from "@/lib/types/database";

export function useObras() {
  const [obras, setObras] = useState<ObraView[]>([]);
  const [shellProjects, setShellProjects] = useState<ShellProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("obras")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setObras([]);
        setShellProjects([]);
        return;
      }

      const rows = (data ?? []) as ObraRow[];
      setObras(rows.map(mapObraRow));
      setShellProjects(rows.map(mapObraRowToShell));
    } catch {
      setError("Configure as variáveis do Supabase em .env.local");
      setObras([]);
      setShellProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { obras, shellProjects, loading, error, refetch };
}
