import type { ResponsavelRow } from "@/lib/types/database";

export type ResponsavelView = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  role: string;
  project: string;
  projectId: string;
  status: "Ativo" | "Convite pendente";
};

export function mapResponsavelRow(
  row: ResponsavelRow,
  obraName: string
): ResponsavelView {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "—",
    whatsapp: row.phone ?? "—",
    email: row.email ?? "—",
    role: row.role ?? "—",
    project: obraName,
    projectId: row.obra_id,
    status: row.status === "Ativo" ? "Ativo" : "Convite pendente"
  };
}

export type CreateResponsavelInput = {
  obra_id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: "Pendente" | "Ativo";
};

export function buildResponsavelPayload(input: CreateResponsavelInput) {
  return {
    obra_id: input.obra_id,
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    role: input.role ?? null,
    status: input.status ?? "Pendente"
  };
}
