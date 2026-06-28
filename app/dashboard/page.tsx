"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CloudRain,
  FileText,
  PackageCheck,
  TriangleAlert,
  WalletCards
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Metric } from "@/components/Ui";
import { useLembretes } from "@/hooks/useLembretes";
import { useDiario } from "@/hooks/useDiario";
import { useMateriais } from "@/hooks/useMateriais";
import { useObraAtiva } from "@/hooks/useObraAtiva";
import { useObras } from "@/hooks/useObras";
import { usePagamentos } from "@/hooks/usePagamentos";
import { formatCents } from "@/lib/format";
import { ACTIVE_PROJECT_STORAGE_KEY } from "@/lib/obras";

const progressByMonth = [
  { label: "Jan", value: 10 },
  { label: "Fev", value: 22 },
  { label: "Mar", value: 35 },
  { label: "Abr", value: 41 }
];

const forecast = [
  { day: "Hoje", condition: "Nublado", temperature: "24°", rain: "20%", favorable: true },
  { day: "Qui", condition: "Chuva", temperature: "22°", rain: "80%", favorable: false },
  { day: "Sex", condition: "Chuva", temperature: "23°", rain: "70%", favorable: false },
  { day: "Sáb", condition: "Sol", temperature: "27°", rain: "10%", favorable: true },
  { day: "Dom", condition: "Sol", temperature: "28°", rain: "5%", favorable: true },
  { day: "Seg", condition: "Nublado", temperature: "25°", rain: "30%", favorable: true },
  { day: "Ter", condition: "Sol", temperature: "27°", rain: "10%", favorable: true }
];

export default function DashboardPage() {
  const { shellProjects, obras } = useObras();
  const { activeProject } = useObraAtiva(shellProjects);
  const { reminders } = useLembretes(activeProject?.id ?? null);
  const { compras } = useMateriais(activeProject?.id ?? null);
  const { pagamentos } = usePagamentos(activeProject?.id ?? null);
  const { entries: diarioEntries } = useDiario(activeProject?.id ?? null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const currentObra = useMemo(
    () => obras.find((o) => o.id === (projectId ?? activeProject?.id)) ?? obras[0],
    [obras, projectId, activeProject?.id]
  );

  const currentProject = useMemo(() => {
    if (!currentObra) return null;
    const remaining = Math.max(0, currentObra.budgetCents - currentObra.spentCents);
    const pct =
      currentObra.budgetCents > 0
        ? Math.round((currentObra.spentCents / currentObra.budgetCents) * 100)
        : 0;
    return {
      id: currentObra.id,
      name: currentObra.name,
      status: currentObra.status === "Ativa" ? "Em andamento" : currentObra.status,
      detail: `${currentObra.city} · ${currentObra.state}`,
      progress: currentObra.progress || pct,
      stats: [
        { label: "Orçamento previsto", value: currentObra.budget, helper: "Compras + equipe" },
        { label: "Valor gasto", value: currentObra.spent, helper: `${pct}% consumido` },
        {
          label: "Saldo restante",
          value: formatCents(remaining),
          helper: remaining > 0 ? "Dentro do previsto" : "Orçamento esgotado"
        },
        {
          label: "Dias restantes",
          value: currentObra.daysLeft,
          helper: `Entrega em ${currentObra.deliveryDate}`
        }
      ]
    };
  }, [currentObra]);

  const materiaisTotalCents = useMemo(
    () => compras.reduce((sum, item) => sum + item.totalCents, 0),
    [compras]
  );

  const equipeTotalCents = useMemo(
    () =>
      pagamentos
        .filter((item) => item.status === "pago")
        .reduce((sum, item) => sum + item.amountCents, 0),
    [pagamentos]
  );

  const costsByCategory = useMemo(() => {
    const total = materiaisTotalCents + equipeTotalCents || 1;
    return [
      {
        label: "Compras",
        value: Math.round((materiaisTotalCents / total) * 100),
        amount: formatCents(materiaisTotalCents)
      },
      {
        label: "Equipe",
        value: Math.round((equipeTotalCents / total) * 100),
        amount: formatCents(equipeTotalCents)
      }
    ].filter((item) => item.value > 0);
  }, [materiaisTotalCents, equipeTotalCents]);

  const pendingPayments = useMemo(
    () => pagamentos.filter((item) => item.status !== "pago").length,
    [pagamentos]
  );

  const registeredToday = useMemo(() => {
    const pendingReminders = reminders.filter((r) => r.status !== "completed").length;
    const items: { text: string; tone: "ok" | "warning" | "reminder" }[] = [
      {
        text: `${compras.length} compra(s) registrada(s)`,
        tone: compras.length ? "ok" : "warning"
      },
      {
        text: `${pagamentos.length} pagamento(s) registrado(s)`,
        tone: pagamentos.length ? "ok" : "warning"
      },
      {
        text: `${diarioEntries.length} registro(s) no diário`,
        tone: diarioEntries.length ? "ok" : "warning"
      }
    ];
    if (pendingPayments > 0) {
      items.push({
        text: `${pendingPayments} pagamento(s) pendente(s)`,
        tone: "warning"
      });
    }
    if (pendingReminders > 0) {
      items.push({
        text: `${pendingReminders} lembrete(s) futuro(s)`,
        tone: "reminder"
      });
    }
    return items;
  }, [compras.length, pagamentos.length, diarioEntries.length, pendingPayments, reminders]);

  const timeline = useMemo(() => {
    const items = [
      ...compras.slice(0, 2).map((item) => ({
        type: "Compras",
        time: item.date,
        text: `Compra em ${item.supplier} — ${item.total}`
      })),
      ...pagamentos.slice(0, 2).map((item) => ({
        type: "Pagamentos",
        time: item.date,
        text: `${item.prestadorName} — ${item.amount}`
      })),
      ...diarioEntries.slice(0, 2).map((item) => ({
        type: "Diário",
        time: item.date,
        text: item.content.slice(0, 80)
      })),
      ...reminders.slice(0, 2).map((item) => ({
        type: "Lembretes",
        time: item.dateLabel,
        text: item.title
      }))
    ];
    return items.slice(0, 5);
  }, [compras, pagamentos, diarioEntries, reminders]);

  const todayItems = useMemo(
    () => [
      {
        icon: Bell,
        label: "Lembretes pendentes",
        value: String(reminders.filter((r) => r.status !== "completed").length),
        text: reminders.find((r) => r.status === "today")?.title ?? "Nenhum para hoje"
      },
      {
        icon: WalletCards,
        label: "Pagamentos pendentes",
        value: String(pendingPayments),
        text:
          pendingPayments > 0
            ? `${pendingPayments} aguardando confirmação`
            : "Nenhum pendente"
      },
      {
        icon: PackageCheck,
        label: "Compras registradas",
        value: String(compras.length),
        text: compras[0]?.supplier ?? "Consulte materiais"
      },
      { icon: CloudRain, label: "Alertas climáticos", value: "1", text: "Evite pintura externa" }
    ],
    [reminders, pendingPayments, compras]
  );

  useEffect(() => {
    const savedProjectId = window.localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY);
    if (savedProjectId) setProjectId(savedProjectId);

    function handleProjectChange(event: Event) {
      const customEvent = event as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id) setProjectId(customEvent.detail.id);
    }

    window.addEventListener("obrio:project-change", handleProjectChange);
    return () => window.removeEventListener("obrio:project-change", handleProjectChange);
  }, []);

  if (!currentProject) {
    return (
      <AppShell title="Dashboard da obra" subtitle="Crie uma obra para começar.">
        <Card>
          <p className="font-semibold text-graphite/70">
            Nenhuma obra cadastrada. Acesse Obras → Nova Obra.
          </p>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dashboard da obra"
      subtitle="O que você precisa saber agora sobre sua obra."
    >
      <section>
        <SectionTitle>Resumo de Hoje</SectionTitle>
        <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {todayItems.map((item) => (
            <Card key={item.label} className="max-w-[calc(100vw-32px)]">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-concrete text-build">
                  <item.icon size={20} />
                </span>
                <strong className="text-2xl font-black text-foundation">{item.value}</strong>
              </div>
              <p className="mt-3 text-xs font-black uppercase text-graphite/50">{item.label}</p>
              <p className="mt-1 text-sm font-bold leading-5 text-foundation">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-[8px] bg-foundation p-5 text-white shadow-soft md:p-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div>
            <p className="text-sm font-black text-build">Status: {currentProject.status}</p>
            <h2 className="mt-1 text-2xl font-black md:text-3xl">{currentProject.name}</h2>
            <p className="mt-2 text-sm font-semibold text-white/72">{currentProject.detail}</p>
            <div className="mt-5 h-3 overflow-hidden rounded-[8px] bg-white/15">
              <div
                className="h-full rounded-[8px] bg-build"
                style={{ width: `${currentProject.progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-bold text-white/65">
              {currentProject.progress}% do orçamento consumido
            </p>
          </div>

          <div className="rounded-[8px] bg-white/8 p-4">
            <p className="text-xs font-black uppercase text-build">Status geral</p>
            <div className="mt-3 grid gap-2">
              <StatusLine tone="green">Dentro do prazo</StatusLine>
              <StatusLine tone="green">Dentro do orçamento</StatusLine>
              <StatusLine tone="orange">Atenção: chuva prevista</StatusLine>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {currentProject.stats.map((stat) => (
          <Metric key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-5">
        <SectionTitle>Evolução da Obra</SectionTitle>
        <div className="mt-3 grid gap-4 xl:grid-cols-3">
          <Card>
            <h3 className="font-black text-foundation">Progresso mensal</h3>
            <div className="mt-5 flex h-44 items-end gap-3">
              {progressByMonth.map((item) => (
                <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
                  <span className="mb-2 text-center text-xs font-black text-build">
                    {item.value}%
                  </span>
                  <div
                    className="min-h-3 rounded-t-[6px] bg-foundation"
                    style={{ height: `${item.value * 2.6}px` }}
                  />
                  <span className="mt-2 text-center text-xs font-bold text-graphite/55">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-foundation">Gastos por categoria</h3>
            <div className="mt-5 grid gap-5">
              {!costsByCategory.length ? (
                <p className="text-sm font-semibold text-graphite/60">
                  Sem gastos registrados nesta obra.
                </p>
              ) : null}
              {costsByCategory.map((item) => (
                <VisualBar
                  key={item.label}
                  label={item.label}
                  value={item.amount}
                  width={item.value}
                />
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-black text-foundation">Orçamento x gasto</h3>
            <div className="mt-5 grid gap-5">
              {currentObra ? (
                <>
                  <BudgetBar
                    label="Orçamento"
                    value={currentObra.budget}
                    width={100}
                    color="bg-foundation"
                  />
                  <BudgetBar
                    label="Gasto"
                    value={currentObra.spent}
                    width={
                      currentObra.budgetCents > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (currentObra.spentCents / currentObra.budgetCents) * 100
                            )
                          )
                        : 0
                    }
                    color="bg-build"
                  />
                  <BudgetBar
                    label="Saldo"
                    value={formatCents(
                      Math.max(0, currentObra.budgetCents - currentObra.spentCents)
                    )}
                    width={
                      currentObra.budgetCents > 0
                        ? Math.max(
                            0,
                            Math.round(
                              ((currentObra.budgetCents - currentObra.spentCents) /
                                currentObra.budgetCents) *
                                100
                            )
                          )
                        : 0
                    }
                    color="bg-moss"
                  />
                </>
              ) : null}
            </div>
          </Card>
        </div>
      </section>

      <section className="mt-5">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-build">Clima da obra</p>
              <h2 className="mt-1 text-xl font-black text-foundation">Previsão para São Paulo</h2>
            </div>
            <CloudRain size={24} className="shrink-0 text-build" />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[230px_1fr]">
            <div className="rounded-[8px] bg-foundation p-5 text-white">
              <p className="text-4xl font-black">24°C</p>
              <p className="mt-2 font-black">Nublado</p>
              <p className="mt-1 text-sm font-semibold text-white/70">Chance de chuva: 20%</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {forecast.map((day) => (
                <div
                  key={day.day}
                  className={`rounded-[8px] p-3 text-center ${
                    day.favorable ? "bg-[#EAF4EF]" : "bg-[#FFF0E5]"
                  }`}
                >
                  <p className="text-xs font-black text-foundation">{day.day}</p>
                  <p className="mt-2 text-lg font-black text-foundation">{day.temperature}</p>
                  <p className="mt-1 text-xs font-bold text-graphite/60">{day.condition}</p>
                  <p className="mt-1 text-xs font-black text-build">{day.rain}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border-l-4 border-build bg-concrete p-4">
            <p className="text-xs font-black uppercase text-build">Análise do Obrio AI</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <Advice tone="warning">Evite pintura externa quinta e sexta.</Advice>
              <Advice tone="warning">Evite concretagem na quinta-feira.</Advice>
              <Advice tone="ok">Instalações internas estão liberadas.</Advice>
              <Advice tone="ok">Sábado e domingo são favoráveis para pintura.</Advice>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="text-xl font-black text-foundation">Obrio AI registrou hoje</h2>
          <div className="mt-4 grid gap-2">
            {registeredToday.map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-[8px] bg-concrete p-3">
                {item.tone === "warning" ? (
                  <TriangleAlert size={18} className="shrink-0 text-build" />
                ) : item.tone === "reminder" ? (
                  <Bell size={18} className="shrink-0 text-build" />
                ) : (
                  <CheckCircle2 size={18} className="shrink-0 text-moss" />
                )}
                <p className="text-sm font-bold text-foundation">{item.text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-foundation">Linha do Tempo Recente</h2>
            <FileText size={21} className="shrink-0 text-build" />
          </div>
          <div className="mt-4 grid gap-2">
            {!timeline.length ? (
              <p className="text-sm font-semibold text-graphite/60">
                Nenhuma atividade recente nesta obra.
              </p>
            ) : null}
            {timeline.map((item) => (
              <div
                key={`${item.time}-${item.text}`}
                className="grid grid-cols-[10px_1fr] gap-3 rounded-[8px] bg-concrete p-3"
              >
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-build" />
                <div>
                  <p className="text-xs font-black uppercase text-graphite/50">
                    {item.type} · {item.time}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-graphite/78">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-black text-foundation">{children}</h2>;
}

function StatusLine({
  children,
  tone
}: {
  children: React.ReactNode;
  tone: "green" | "orange";
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold">
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          tone === "green" ? "bg-[#2FB36D]" : "bg-build"
        }`}
      />
      {children}
    </div>
  );
}

function VisualBar({
  label,
  value,
  width
}: {
  label: string;
  value: string;
  width: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm font-black">
        <span className="text-foundation">{label}</span>
        <span className="text-build">{value}</span>
      </div>
      <div className="mt-2 h-5 overflow-hidden rounded-[6px] bg-concrete">
        <div className="h-full rounded-[6px] bg-build" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function BudgetBar({
  label,
  value,
  width,
  color
}: {
  label: string;
  value: string;
  width: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm font-black text-foundation">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2 h-5 overflow-hidden rounded-[6px] bg-concrete">
        <div className={`h-full rounded-[6px] ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Advice({
  children,
  tone
}: {
  children: React.ReactNode;
  tone: "ok" | "warning";
}) {
  return (
    <div className="flex items-start gap-2 text-sm font-bold leading-5 text-foundation">
      {tone === "ok" ? (
        <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-moss" />
      ) : (
        <TriangleAlert size={17} className="mt-0.5 shrink-0 text-build" />
      )}
      {children}
    </div>
  );
}
