import type { ObraRow, ObraStatus, ObraType } from "@/lib/types/database";
import { formatCents, formatDateBr, daysUntil } from "@/lib/format";

export type ObraView = {
  id: string;
  name: string;
  type: ObraType;
  status: ObraStatus;
  city: string;
  state: string;
  address: string;
  spent: string;
  budget: string;
  daysLeft: string;
  progress: number;
  startDate: string;
  deliveryDate: string;
  responsible?: string;
};

export function mapObraRow(row: ObraRow): ObraView {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    city: row.city ?? "—",
    state: row.state ?? "—",
    address: row.address ?? "—",
    spent: formatCents(row.spent_cents),
    budget: formatCents(row.budget_cents),
    daysLeft: daysUntil(row.delivery_date),
    progress: row.progress,
    startDate: formatDateBr(row.start_date),
    deliveryDate: formatDateBr(row.delivery_date),
    responsible: row.responsible ?? undefined
  };
}

export type CreateObraInput = {
  name: string;
  type: ObraType;
  city?: string;
  state?: string;
  address?: string;
  budget_cents?: number;
  delivery_date?: string | null;
  responsible?: string;
};

export function buildCreateObraPayload(input: CreateObraInput, ownerId: string) {
  return {
    owner_id: ownerId,
    name: input.name,
    type: input.type,
    status: "Ativa" as const,
    city: input.city ?? null,
    state: input.state ?? null,
    address: input.address ?? null,
    budget_cents: input.budget_cents ?? 0,
    spent_cents: 0,
    progress: 0,
    delivery_date: input.delivery_date ?? null,
    responsible: input.responsible ?? null
  };
}
