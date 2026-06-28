import type { PagamentoRow, PrestadorRow } from "@/lib/types/database";
import { formatCents, formatDateBr } from "@/lib/format";

export type PrestadorView = {
  id: string;
  obraId: string;
  name: string;
  role: string;
  phone: string;
};

export type PagamentoView = {
  id: string;
  obraId: string;
  prestadorId?: string;
  prestadorName: string;
  role: string;
  amount: string;
  amountCents: number;
  date: string;
  status: PagamentoRow["status"];
  receiptPath?: string;
  notes?: string;
};

export function mapPrestadorRow(row: PrestadorRow): PrestadorView {
  return {
    id: row.id,
    obraId: row.obra_id,
    name: row.name,
    role: row.role ?? "—",
    phone: row.phone ?? "—"
  };
}

export function mapPagamentoRow(
  row: PagamentoRow,
  prestador?: PrestadorRow | null
): PagamentoView {
  return {
    id: row.id,
    obraId: row.obra_id,
    prestadorId: row.prestador_id ?? undefined,
    prestadorName: prestador?.name ?? "Prestador",
    role: prestador?.role ?? "—",
    amount: formatCents(row.amount_cents),
    amountCents: row.amount_cents,
    date: formatDateBr(row.payment_date),
    status: row.status,
    receiptPath: row.receipt_path ?? undefined,
    notes: row.notes ?? undefined
  };
}

export type CreatePagamentoInput = {
  obra_id: string;
  prestador_id?: string;
  amount_cents: number;
  payment_date?: string;
  status?: PagamentoRow["status"];
  receipt_path?: string;
  notes?: string;
};

export function buildPagamentoPayload(input: CreatePagamentoInput) {
  return {
    obra_id: input.obra_id,
    prestador_id: input.prestador_id ?? null,
    amount_cents: input.amount_cents,
    payment_date: input.payment_date ?? new Date().toISOString().slice(0, 10),
    status: input.status ?? "pago",
    receipt_path: input.receipt_path ?? null,
    notes: input.notes ?? null
  };
}

export type CreatePrestadorInput = {
  obra_id: string;
  name: string;
  role?: string;
  phone?: string;
};

export function buildPrestadorPayload(input: CreatePrestadorInput) {
  return {
    obra_id: input.obra_id,
    name: input.name,
    role: input.role ?? null,
    phone: input.phone ?? null
  };
}
