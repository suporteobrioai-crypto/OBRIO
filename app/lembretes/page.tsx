"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Bell,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  Pencil,
  RotateCcw,
  Smartphone,
  TriangleAlert,
  Trash2
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Card, Metric } from "@/components/Ui";

type ReminderStatus = "today" | "tomorrow" | "future" | "overdue" | "completed";
type ReminderPriority = "Alta" | "Média" | "Baixa";
type ReminderChannel = "Aplicativo" | "WhatsApp" | "Aplicativo + WhatsApp";
type ReminderGroup = "Hoje" | "Amanhã" | "Próximos 7 dias";

type Reminder = {
  id: number;
  title: string;
  time: string;
  dateLabel: string;
  countdown: string;
  group: ReminderGroup;
  status: ReminderStatus;
  priority: ReminderPriority;
  channel: ReminderChannel;
};

const filters = ["Todos", "Hoje", "Semana", "Concluídos", "Pendentes", "Atrasados"] as const;

const initialReminders: Reminder[] = [
  { id: 1, title: "Conferir entrega da areia", time: "09:00", dateLabel: "Hoje", countdown: "Faltam 1h 18min", group: "Hoje", status: "today", priority: "Média", channel: "Aplicativo" },
  { id: 2, title: "Pagar pedreiro João", time: "17:00", dateLabel: "Hoje", countdown: "Faltam 9h 18min", group: "Hoje", status: "today", priority: "Alta", channel: "Aplicativo + WhatsApp" },
  { id: 3, title: "Revisar comprovante da Equipe Alfa", time: "11:30", dateLabel: "Ontem", countdown: "Atrasado há 20h", group: "Hoje", status: "overdue", priority: "Alta", channel: "WhatsApp" },
  { id: 4, title: "Comprar cimento", time: "08:00", dateLabel: "Amanhã", countdown: "Vence em 1 dia", group: "Amanhã", status: "tomorrow", priority: "Média", channel: "Aplicativo + WhatsApp" },
  { id: 5, title: "Ligar para o fornecedor de esquadrias", time: "14:00", dateLabel: "Amanhã", countdown: "Vence em 1 dia", group: "Amanhã", status: "tomorrow", priority: "Baixa", channel: "Aplicativo" },
  { id: 6, title: "Receber material elétrico", time: "10:30", dateLabel: "15/06", countdown: "Vence em 5 dias", group: "Próximos 7 dias", status: "future", priority: "Média", channel: "Aplicativo + WhatsApp" },
  { id: 7, title: "Vistoriar a laje", time: "16:00", dateLabel: "16/06", countdown: "Vence em 6 dias", group: "Próximos 7 dias", status: "future", priority: "Alta", channel: "Aplicativo" },
  { id: 8, title: "Enviar relatório semanal", time: "18:00", dateLabel: "07/06", countdown: "Concluído há 2 dias", group: "Próximos 7 dias", status: "completed", priority: "Baixa", channel: "WhatsApp" }
];

const statusConfig = {
  today: { label: "Hoje", dot: "bg-amber-400", text: "text-amber-700", surface: "bg-amber-50" },
  tomorrow: { label: "Amanhã", dot: "bg-build", text: "text-build", surface: "bg-[#FFF4EA]" },
  future: { label: "Futuro", dot: "bg-graphite/30", text: "text-graphite/55", surface: "bg-concrete" },
  overdue: { label: "Atrasado", dot: "bg-red-600", text: "text-red-700", surface: "bg-red-50" },
  completed: { label: "Concluído", dot: "bg-moss", text: "text-moss", surface: "bg-[#EAF4EF]" }
} satisfies Record<ReminderStatus, { label: string; dot: string; text: string; surface: string }>;

const priorityConfig = {
  Alta: "border-red-200 bg-red-50 text-red-700",
  Média: "border-amber-200 bg-amber-50 text-amber-700",
  Baixa: "border-black/5 bg-white text-graphite/55"
} satisfies Record<ReminderPriority, string>;

export default function LembretesPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("Todos");
  const [reminders, setReminders] = useState(initialReminders);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const filteredReminders = useMemo(
    () =>
      reminders.filter((reminder) => {
        if (activeFilter === "Todos") return true;
        if (activeFilter === "Hoje") return reminder.status === "today";
        if (activeFilter === "Semana") return reminder.status !== "completed";
        if (activeFilter === "Concluídos") return reminder.status === "completed";
        if (activeFilter === "Pendentes") return reminder.status !== "completed";
        return reminder.status === "overdue";
      }),
    [activeFilter, reminders]
  );

  const summary = {
    pending: reminders.filter((item) => item.status !== "completed").length,
    today: reminders.filter((item) => item.status === "today").length,
    week: reminders.filter((item) => ["today", "tomorrow", "future"].includes(item.status)).length,
    overdue: reminders.filter((item) => item.status === "overdue").length,
    completed: 18
  };

  function completeReminder(id: number) {
    setReminders((items) =>
      items.map((item) => item.id === id ? { ...item, status: "completed" as const } : item)
    );
  }

  function postponeReminder(id: number) {
    setReminders((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, group: "Amanhã" as const, dateLabel: "Amanhã", countdown: "Vence em 1 dia", status: "tomorrow" as const }
          : item
      )
    );
  }

  function startEditing(reminder: Reminder) {
    setEditingId(reminder.id);
    setEditingTitle(reminder.title);
  }

  function saveEditing(id: number) {
    const title = editingTitle.trim();
    if (title) {
      setReminders((items) => items.map((item) => item.id === id ? { ...item, title } : item));
    }
    setEditingId(null);
    setEditingTitle("");
  }

  return (
    <AppShell title="Lembretes" subtitle="O Obrio AI lembra você no aplicativo e no WhatsApp.">
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Bell size={20} className="text-build" />
          <h2 className="text-xl font-black text-foundation">Resumo dos lembretes</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Metric label="Pendentes" value={String(summary.pending)} helper="Aguardando ação" />
          <Metric label="Hoje" value={String(summary.today)} helper="Compromissos do dia" />
          <Metric label="Próximos 7 dias" value={String(summary.week)} helper="Agenda da semana" />
          <Metric label="Atrasados" value={String(summary.overdue)} helper="Exigem atenção" />
          <Metric label="Concluídos no mês" value={String(summary.completed)} helper="Tarefas finalizadas" />
        </div>
      </section>

      <section className="mt-4">
        <Card>
          <div className="flex items-center gap-2">
            <CalendarClock size={20} className="text-build" />
            <h2 className="text-lg font-black text-foundation">Filtrar agenda</h2>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`h-10 shrink-0 rounded-[8px] px-4 text-sm font-black ${
                  activeFilter === filter ? "bg-foundation text-white" : "bg-concrete text-foundation"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-4">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-foundation">Agenda da Obra</h2>
              <p className="mt-1 text-sm font-semibold text-graphite/60">
                Compromissos organizados por data, prioridade e canal.
              </p>
            </div>
            <Clock3 size={22} className="shrink-0 text-build" />
          </div>

          <div className="mt-5 grid gap-6">
            {filteredReminders.some((item) => item.status === "overdue") ? (
              <div className="rounded-[8px] border border-red-200 bg-red-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-red-700">
                  <TriangleAlert size={19} />
                  <h3 className="text-sm font-black uppercase">Exigem Atenção</h3>
                </div>
                <div className="grid gap-3">
                  {filteredReminders
                    .filter((item) => item.status === "overdue")
                    .map((reminder) => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        editing={editingId === reminder.id}
                        editingTitle={editingTitle}
                        onEditingTitle={setEditingTitle}
                        onComplete={completeReminder}
                        onPostpone={postponeReminder}
                        onEdit={startEditing}
                        onSave={saveEditing}
                        onDelete={(id) => setReminders((items) => items.filter((item) => item.id !== id))}
                      />
                    ))}
                </div>
              </div>
            ) : null}

            {(["Hoje", "Amanhã", "Próximos 7 dias"] as ReminderGroup[]).map((group) => {
              const groupItems = filteredReminders.filter(
                (item) => item.group === group && item.status !== "overdue"
              );
              if (!groupItems.length) return null;

              return (
                <div key={group}>
                  <h3 className="mb-3 text-xs font-black uppercase text-build">{group}</h3>
                  <div className="grid gap-3">
                    {groupItems.map((reminder) => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        editing={editingId === reminder.id}
                        editingTitle={editingTitle}
                        onEditingTitle={setEditingTitle}
                        onComplete={completeReminder}
                        onPostpone={postponeReminder}
                        onEdit={startEditing}
                        onSave={saveEditing}
                        onDelete={(id) => setReminders((items) => items.filter((item) => item.id !== id))}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {!filteredReminders.length ? (
              <div className="rounded-[8px] bg-concrete p-5 text-center">
                <CheckCircle2 size={28} className="mx-auto text-moss" />
                <p className="mt-2 font-black text-foundation">
                  Nenhum lembrete encontrado neste filtro.
                </p>
              </div>
            ) : null}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

function ReminderCard({
  reminder,
  editing,
  editingTitle,
  onEditingTitle,
  onComplete,
  onPostpone,
  onEdit,
  onSave,
  onDelete
}: {
  reminder: Reminder;
  editing: boolean;
  editingTitle: string;
  onEditingTitle: (value: string) => void;
  onComplete: (id: number) => void;
  onPostpone: (id: number) => void;
  onEdit: (reminder: Reminder) => void;
  onSave: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const status = statusConfig[reminder.status];

  return (
    <article className={`rounded-[8px] border border-black/5 p-3 ${status.surface}`}>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
            <span className={`text-xs font-black ${status.text}`}>{status.label}</span>
            <span className={`rounded-[6px] border px-2 py-1 text-[11px] font-black ${priorityConfig[reminder.priority]}`}>
              {reminder.priority}
            </span>
          </div>

          {editing ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                autoFocus
                value={editingTitle}
                onChange={(event) => onEditingTitle(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-[8px] border border-build bg-white px-3 text-sm font-bold outline-none"
              />
              <button
                type="button"
                onClick={() => onSave(reminder.id)}
                className="h-11 rounded-[8px] bg-foundation px-4 text-sm font-black text-white"
              >
                Salvar
              </button>
            </div>
          ) : (
            <h4 className={`mt-2 text-sm font-black text-foundation sm:text-base ${reminder.status === "completed" ? "line-through opacity-55" : ""}`}>
              {reminder.title}
            </h4>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-graphite/60 sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <CalendarClock size={14} className="text-build" />
              {reminder.dateLabel} {reminder.time}
            </span>
            <span aria-hidden="true" className="text-graphite/30">•</span>
            <span className={`inline-flex items-center gap-1 font-black ${status.text}`}>
              {reminder.countdown}
            </span>
            <span aria-hidden="true" className="text-graphite/30">•</span>
            <ChannelBadge channel={reminder.channel} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <ActionButton label="Concluir" icon={<Check size={16} />} onClick={() => onComplete(reminder.id)} disabled={reminder.status === "completed"} />
          <ActionButton label="Adiar" icon={<RotateCcw size={16} />} onClick={() => onPostpone(reminder.id)} />
          <ActionButton label="Editar" icon={<Pencil size={16} />} onClick={() => onEdit(reminder)} />
          <ActionButton label="Excluir" icon={<Trash2 size={16} />} onClick={() => onDelete(reminder.id)} danger />
        </div>
      </div>
    </article>
  );
}

function ChannelBadge({ channel }: { channel: ReminderChannel }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {channel.includes("Aplicativo") ? (
        <span className="inline-flex items-center gap-1 rounded-[6px] bg-white px-2 py-1 text-[11px] font-black text-foundation">
          <Smartphone size={12} className="text-build" />
          Aplicativo
        </span>
      ) : null}
      {channel.includes("WhatsApp") ? (
        <span className="inline-flex items-center gap-1 rounded-[6px] bg-[#E8F8EE] px-2 py-1 text-[11px] font-black text-[#168C45]">
          <WhatsAppIcon size={13} />
          WhatsApp
        </span>
      ) : null}
    </span>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  danger = false,
  disabled = false
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`grid h-11 min-w-11 place-items-center rounded-[8px] border bg-white transition disabled:cursor-not-allowed disabled:opacity-35 ${
        danger
          ? "border-red-100 text-red-600 hover:bg-red-50"
          : "border-black/5 text-foundation hover:border-build/40 hover:text-build"
      }`}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}
