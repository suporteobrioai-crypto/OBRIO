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
  property_type: string | null;
  area_sqm: number | null;
  goals: string[] | null;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  whatsapp: string | null;
  avatar_path: string | null;
  notification_prefs: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type SubscriptionPlan = "gratuito" | "mensal" | "premium";

export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: string;
  stripe_customer_id: string | null;
  current_period_end: string | null;
  created_at: string;
};

export type LembreteStatus = "pendente" | "concluido" | "adiado";
export type LembretePriority = "Alta" | "Media" | "Baixa";
export type LembreteChannel = "app" | "whatsapp" | "ambos";

export type LembreteRow = {
  id: string;
  obra_id: string;
  title: string;
  due_at: string;
  status: LembreteStatus;
  priority: LembretePriority | null;
  channel: LembreteChannel;
  created_at: string;
  updated_at: string;
};

export type ResponsavelRow = {
  id: string;
  obra_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  status: "Pendente" | "Ativo";
  created_at: string;
};

export type DiarioEntryRow = {
  id: string;
  obra_id: string;
  entry_date: string;
  author_name: string | null;
  content: string;
  tags: string[] | null;
  weather_note: string | null;
  attachment_paths: string[] | null;
  created_at: string;
};

export type CompraRow = {
  id: string;
  obra_id: string;
  purchase_date: string;
  supplier: string | null;
  total_cents: number;
  nf_path: string | null;
  notes: string | null;
  created_at: string;
};

export type MaterialRow = {
  id: string;
  compra_id: string | null;
  obra_id: string;
  name: string;
  category: string | null;
  qty: number | null;
  unit: string | null;
  amount_cents: number;
  warranty_until: string | null;
  created_at: string;
};

export type PrestadorRow = {
  id: string;
  obra_id: string;
  name: string;
  role: string | null;
  phone: string | null;
  created_at: string;
};

export type PagamentoStatus = "pago" | "pendente" | "atrasado";

export type PagamentoRow = {
  id: string;
  obra_id: string;
  prestador_id: string | null;
  amount_cents: number;
  payment_date: string;
  status: PagamentoStatus;
  receipt_path: string | null;
  notes: string | null;
  created_at: string;
};

export const PLAN_LIMITS: Record<
  SubscriptionPlan,
  { obraLimit: number; responsavelLimit: number; label: string }
> = {
  gratuito: { obraLimit: 1, responsavelLimit: 1, label: "Gratuito" },
  mensal: { obraLimit: 5, responsavelLimit: 5, label: "Mensal" },
  premium: { obraLimit: 10, responsavelLimit: 10, label: "Premium" }
};
