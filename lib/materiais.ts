import type { CompraRow, MaterialRow } from "@/lib/types/database";
import { formatCents, formatDateBr } from "@/lib/format";

export type CompraView = {
  id: string;
  obraId: string;
  date: string;
  supplier: string;
  total: string;
  totalCents: number;
  nfPath?: string;
  notes?: string;
};

export type MaterialView = {
  id: string;
  obraId: string;
  compraId?: string;
  name: string;
  category: string;
  qty: string;
  unit: string;
  amount: string;
  warrantyUntil: string;
};

export function mapCompraRow(row: CompraRow): CompraView {
  return {
    id: row.id,
    obraId: row.obra_id,
    date: formatDateBr(row.purchase_date),
    supplier: row.supplier ?? "—",
    total: formatCents(row.total_cents),
    totalCents: row.total_cents,
    nfPath: row.nf_path ?? undefined,
    notes: row.notes ?? undefined
  };
}

export function mapMaterialRow(row: MaterialRow): MaterialView {
  return {
    id: row.id,
    obraId: row.obra_id,
    compraId: row.compra_id ?? undefined,
    name: row.name,
    category: row.category ?? "—",
    qty: row.qty != null ? String(row.qty) : "—",
    unit: row.unit ?? "—",
    amount: formatCents(row.amount_cents),
    warrantyUntil: formatDateBr(row.warranty_until)
  };
}

export type CreateCompraInput = {
  obra_id: string;
  purchase_date?: string;
  supplier?: string;
  total_cents: number;
  nf_path?: string;
  notes?: string;
};

export function buildCompraPayload(input: CreateCompraInput) {
  return {
    obra_id: input.obra_id,
    purchase_date: input.purchase_date ?? new Date().toISOString().slice(0, 10),
    supplier: input.supplier ?? null,
    total_cents: input.total_cents,
    nf_path: input.nf_path ?? null,
    notes: input.notes ?? null
  };
}

export type CreateMaterialInput = {
  obra_id: string;
  compra_id?: string;
  name: string;
  category?: string;
  qty?: number;
  unit?: string;
  amount_cents?: number;
  warranty_until?: string | null;
};

export function buildMaterialPayload(input: CreateMaterialInput) {
  return {
    obra_id: input.obra_id,
    compra_id: input.compra_id ?? null,
    name: input.name,
    category: input.category ?? null,
    qty: input.qty ?? null,
    unit: input.unit ?? null,
    amount_cents: input.amount_cents ?? 0,
    warranty_until: input.warranty_until ?? null
  };
}
