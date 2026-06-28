import type { LembreteRow, LembreteStatus } from "@/lib/types/database";

export type ReminderStatus =
  | "today"
  | "tomorrow"
  | "future"
  | "overdue"
  | "completed";

export type ReminderView = {
  id: string;
  title: string;
  time: string;
  dateLabel: string;
  countdown: string;
  group: "Hoje" | "Amanhã" | "Próximos 7 dias";
  status: ReminderStatus;
  priority: "Alta" | "Média" | "Baixa";
  channel: "Aplicativo" | "WhatsApp" | "Aplicativo + WhatsApp";
  obraId: string;
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function deriveUiStatus(row: LembreteRow, now: Date): ReminderStatus {
  if (row.status === "concluido") return "completed";
  const due = new Date(row.due_at);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const startOfDayAfter = new Date(startOfTomorrow);
  startOfDayAfter.setDate(startOfDayAfter.getDate() + 1);
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  if (due < startOfToday) return "overdue";
  if (due >= startOfToday && due < startOfTomorrow) return "today";
  if (due >= startOfTomorrow && due < startOfDayAfter) return "tomorrow";
  if (due <= endOfWeek) return "future";
  return "future";
}

function countdownLabel(row: LembreteRow, uiStatus: ReminderStatus): string {
  if (uiStatus === "completed") return "Concluído";
  if (uiStatus === "overdue") return "Atrasado";
  const due = new Date(row.due_at);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (uiStatus === "today") return `Faltam ${hours}h`;
  if (uiStatus === "tomorrow") return "Vence em 1 dia";
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return `Vence em ${days} dias`;
}

function mapPriority(p: LembreteRow["priority"]): ReminderView["priority"] {
  if (p === "Alta") return "Alta";
  if (p === "Baixa") return "Baixa";
  return "Média";
}

function mapChannel(c: LembreteRow["channel"]): ReminderView["channel"] {
  if (c === "whatsapp") return "WhatsApp";
  if (c === "ambos") return "Aplicativo + WhatsApp";
  return "Aplicativo";
}

function mapGroup(uiStatus: ReminderStatus): ReminderView["group"] {
  if (uiStatus === "today" || uiStatus === "overdue") return "Hoje";
  if (uiStatus === "tomorrow") return "Amanhã";
  return "Próximos 7 dias";
}

function mapDateLabel(uiStatus: ReminderStatus, dueAt: string): string {
  if (uiStatus === "today") return "Hoje";
  if (uiStatus === "tomorrow") return "Amanhã";
  const due = new Date(dueAt);
  return due.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function mapLembreteRow(row: LembreteRow, now = new Date()): ReminderView {
  const uiStatus = deriveUiStatus(row, now);
  return {
    id: row.id,
    title: row.title,
    time: formatTime(row.due_at),
    dateLabel: mapDateLabel(uiStatus, row.due_at),
    countdown: countdownLabel(row, uiStatus),
    group: mapGroup(uiStatus),
    status: uiStatus,
    priority: mapPriority(row.priority),
    channel: mapChannel(row.channel),
    obraId: row.obra_id
  };
}

export function uiStatusToDbStatus(
  uiStatus: ReminderStatus
): LembreteStatus {
  if (uiStatus === "completed") return "concluido";
  return "pendente";
}

export function postponeDueAt(currentIso: string): string {
  const date = new Date(currentIso);
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
}
