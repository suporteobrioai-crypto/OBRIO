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
  spentCents: number;
  budgetCents: number;
};

export type ShellProject = ObraView & {
  archived: boolean;
  displayStatus: string;
  propertyType: string;
  area: string;
};

export function displayObraStatus(status: ObraStatus): string {
  switch (status) {
    case "Ativa":
      return "Em andamento";
    case "Pausada":
      return "Pausada";
    case "Concluída":
      return "Concluída";
    case "Arquivada":
      return "Arquivada";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

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
    spentCents: row.spent_cents,
    budgetCents: row.budget_cents,
    daysLeft: daysUntil(row.delivery_date),
    progress: row.progress,
    startDate: formatDateBr(row.start_date),
    deliveryDate: formatDateBr(row.delivery_date),
    responsible: row.responsible ?? undefined
  };
}

export function mapObraRowToShell(row: ObraRow): ShellProject {
  const view = mapObraRow(row);
  return {
    ...view,
    archived: row.status === "Arquivada",
    displayStatus: displayObraStatus(row.status),
    propertyType: row.property_type ?? "—",
    area: row.area_sqm ? `${row.area_sqm} m²` : "—"
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
  property_type?: string;
  area_sqm?: number | null;
  goals?: string[];
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
    responsible: input.responsible ?? null,
    property_type: input.property_type ?? null,
    area_sqm: input.area_sqm ?? null,
    goals: input.goals ?? []
  };
}

export const ACTIVE_PROJECT_STORAGE_KEY = "obrio-active-project";

export function getInitials(name: string, email?: string | null): string {
  const source = name.trim() || email?.split("@")[0] || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}
