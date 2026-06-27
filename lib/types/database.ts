export type ObraType = "Obra completa" | "Reforma";
export type ObraStatus = "Ativa" | "Pausada" | "Concluída" | "Arquivada";

export type ObraRow = {
  id: string;
  owner_id: string;
  name: string;
  type: ObraType;
  status: ObraStatus;
  city: string | null;
  state: string | null;
  address: string | null;
  budget_cents: number;
  spent_cents: number;
  progress: number;
  start_date: string | null;
  delivery_date: string | null;
  responsible: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  whatsapp: string | null;
  created_at: string;
  updated_at: string;
};
