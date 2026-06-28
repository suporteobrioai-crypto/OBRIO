"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  FileText,
  PackageCheck,
  ReceiptText,
  TriangleAlert,
  Users,
  WalletCards
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ObraWeatherCard } from "@/components/ObraWeatherCard";
import { Card, Metric } from "@/components/Ui";
import { useLembretes } from "@/hooks/useLembretes";
import { useDiario } from "@/hooks/useDiario";
import { useMateriais } from "@/hooks/useMateriais";
import { useObraAtiva } from "@/hooks/useObraAtiva";
import { useObras } from "@/hooks/useObras";
import { usePagamentos } from "@/hooks/usePagamentos";
import { useProfile } from "@/hooks/useProfile";
import { formatCents } from "@/lib/format";
import { ACTIVE_PROJECT_STORAGE_KEY } from "@/lib/obras";

export default function DashboardPage() {
  const { profile } = useProfile();
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
      {
        icon: FileText,
        label: "Registros no diário",
        value: String(diarioEntries.length),
        text: diarioEntries[0]?.content.slice(0, 60) ?? "Nenhum registro ainda"
      }
    ],
    [reminders, pendingPayments, compras, diarioEntries]
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
    const displayName = profile?.full_name?.trim() || "bem-vindo";
    const moduleLinks = [
      { label: "Obras", href: "/obras", icon: Building2 },
      { label: "Diário da Obra", href: "/diario", icon: FileText },
      { label: "Materiais e NF", href: "/materiais", icon: ReceiptText },
      { label: "Mão de obra", href: "/mao-de-obra", icon: Users },
      { label: "Lembretes", href: "/lembretes", icon: Bell }
    ];

    return (
      <AppShell
        title="Dashboard"
        subtitle="Visão geral do Obrio AI — crie uma obra quando quiser começar."
      >
        <Card className="border-build/20 bg-[#FFFBF7]">
          <p className="text-sm font-black uppercase text-build">Olá, {displayName}</p>
          <h2 className="mt-2 text-2xl font-black text-foundation">
            Seu painel está pronto
          </h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-graphite/70">
            Explore os módulos abaixo. Quando quiser acompanhar uma reforma ou
            obra, crie sua primeira obra — isso não é obrigatório agora.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/obras/nova"
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white"
            >
              Criar primeira obra
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/obras"
              className="inline-flex h-14 flex-1 items-center justify-center rounded-[8px] border border-black/10 bg-white px-5 text-base font-black text-foundation"
            >
              Ver todas as obras
            </Link>
          </div>
        </Card>

        <section className="mt-6">
          <h3 className="text-sm font-black uppercase text-graphite/50">
            Funcionalidades
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {moduleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-[8px] border border-black/8 bg-white p-4 shadow-soft transition hover:border-build/30"
              >
                <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-concrete text-build">
                  <item.icon size={20} />
                </span>
                <span className="text-sm font-black text-foundation">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>
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
            <p className="text-xs font-black uppercase text-build">Resumo rápido</p>
            <div className="mt-3 grid gap-2">
              <StatusLine tone="green">
                {compras.length} compra(s) · {pagamentos.length} pagamento(s)
              </StatusLine>
              <StatusLine tone="green">
                {diarioEntries.length} registro(s) no diário
              </StatusLine>
              <StatusLine tone="orange">
                {reminders.filter((r) => r.status !== "completed").length} lembrete(s) pendente(s)
              </StatusLine>
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
        <SectionTitle>Financeiro da obra</SectionTitle>
        <div className="mt-3 grid gap-4 xl:grid-cols-2">
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

      {currentObra?.city ? (
        <section className="mt-5">
          <ObraWeatherCard city={currentObra.city} state={currentObra.state} />
        </section>
      ) : null}

      <section className="mt-5 grid gap-4 xl:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="text-xl font-black text-foundation">Resumo de hoje</h2>
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
