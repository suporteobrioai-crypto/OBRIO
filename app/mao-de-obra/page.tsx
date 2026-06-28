"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  History,
  Search,
  TriangleAlert,
  UserRoundCheck,
  WalletCards
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Metric } from "@/components/Ui";
import { useObraAtiva } from "@/hooks/useObraAtiva";
import { useObras } from "@/hooks/useObras";
import { usePagamentos } from "@/hooks/usePagamentos";
import { formatCents } from "@/lib/format";

const periods = ["Hoje", "7 dias", "30 dias", "Personalizado"] as const;
const sortOptions = ["Mais recentes", "Maior valor", "Menor valor", "Nome", "Função"];

export default function MaoDeObraPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30 dias");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedCustomPeriod, setAppliedCustomPeriod] = useState("");
  const [professionalSearch, setProfessionalSearch] = useState("");
  const [sortBy, setSortBy] = useState("Mais recentes");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const { shellProjects } = useObras();
  const { activeProject } = useObraAtiva(shellProjects);
  const { pagamentos, prestadores, loading, error } = usePagamentos(
    activeProject?.id ?? null
  );

  const roleOptions = useMemo(() => {
    const roles = new Set(prestadores.map((item) => item.role).filter(Boolean));
    return ["Todos", ...Array.from(roles)];
  }, [prestadores]);

  const totalPaidCents = useMemo(
    () =>
      pagamentos
        .filter((item) => item.status === "pago")
        .reduce((sum, item) => sum + item.amountCents, 0),
    [pagamentos]
  );

  const pendingCount = useMemo(
    () => pagamentos.filter((item) => item.status === "pendente").length,
    [pagamentos]
  );

  const filteredPayments = useMemo(() => {
    const query = professionalSearch.trim().toLocaleLowerCase("pt-BR");
    const result = pagamentos.filter((payment) => {
      const matchesSearch =
        !query ||
        [payment.prestadorName, payment.role].some((value) =>
          value.toLocaleLowerCase("pt-BR").includes(query)
        );
      const matchesRole = roleFilter === "Todos" || payment.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "Maior valor") return b.amountCents - a.amountCents;
      if (sortBy === "Menor valor") return a.amountCents - b.amountCents;
      if (sortBy === "Nome")
        return a.prestadorName.localeCompare(b.prestadorName, "pt-BR");
      if (sortBy === "Função") return a.role.localeCompare(b.role, "pt-BR");
      return 0;
    });
  }, [professionalSearch, roleFilter, sortBy, pagamentos]);

  const upcomingPayments = useMemo(
    () =>
      pagamentos
        .filter((item) => item.status === "pendente")
        .slice(0, 3)
        .map((item) => ({
          date: item.date,
          name: item.prestadorName,
          role: item.role,
          value: item.amount
        })),
    [pagamentos]
  );

  const recentHistory = useMemo(
    () =>
      pagamentos
        .filter((item) => item.status === "pago")
        .slice(0, 3)
        .map((item) => ({
          date: item.date,
          name: item.prestadorName,
          role: item.role,
          value: item.amount,
          status: "Pagamento confirmado"
        })),
    [pagamentos]
  );

  const roleCosts = useMemo(() => {
    const totals = new Map<string, number>();
    for (const item of pagamentos) {
      totals.set(item.role, (totals.get(item.role) ?? 0) + item.amountCents);
    }
    const sum = Array.from(totals.values()).reduce((acc, value) => acc + value, 0) || 1;
    return Array.from(totals.entries())
      .slice(0, 5)
      .map(([label, cents]) => ({
        label,
        value: Math.round((cents / sum) * 100)
      }));
  }, [pagamentos]);

  const financialAlerts = useMemo(() => {
    const alerts: { text: string; date: string; tone: "urgent" | "warning" | "ok" }[] = [];
    for (const item of pagamentos.filter((p) => p.status === "pendente").slice(0, 2)) {
      alerts.push({
        text: `${item.prestadorName} aguardando pagamento`,
        date: item.date,
        tone: "warning"
      });
    }
    for (const item of pagamentos.filter((p) => p.status === "atrasado").slice(0, 2)) {
      alerts.push({
        text: `${item.prestadorName} com pagamento atrasado`,
        date: item.date,
        tone: "urgent"
      });
    }
    if (!alerts.length) {
      alerts.push({
        text: "Nenhum alerta financeiro pendente",
        date: "Hoje",
        tone: "ok"
      });
    }
    return alerts;
  }, [pagamentos]);

  function selectPeriod(item: (typeof periods)[number]) {
    setPeriod(item);
    if (item !== "Personalizado") {
      setAppliedCustomPeriod("");
    }
  }

  function applyCustomFilter() {
    if (!startDate || !endDate) return;

    const formatDate = (value: string) => {
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    };

    setAppliedCustomPeriod(
      `Exibindo dados de ${formatDate(startDate)} até ${formatDate(endDate)}`
    );
  }

  function clearDateFilter() {
    setPeriod("30 dias");
    setStartDate("");
    setEndDate("");
    setAppliedCustomPeriod("");
  }

  const periodSummary =
    period === "Hoje"
      ? "Exibindo dados de hoje"
      : period === "7 dias"
        ? "Exibindo dados dos últimos 7 dias"
        : period === "30 dias"
          ? "Exibindo dados dos últimos 30 dias"
          : appliedCustomPeriod || "Selecione as datas e aplique o filtro";

  return (
    <AppShell
      title="Pagamentos da Equipe (Prestadores de Serviços)"
      subtitle="Consulte pagamentos, profissionais, recibos e histórico da equipe organizados pelo Obrio AI."
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total pago"
          value={formatCents(totalPaidCents)}
          helper="Pagamentos confirmados"
        />
        <Metric
          label="Profissionais"
          value={String(prestadores.length)}
          helper="Prestadores cadastrados"
        />
        <Metric
          label="Pagamentos registrados"
          value={String(pagamentos.length)}
          helper="Na obra ativa"
        />
        <Metric
          label="Pagamentos pendentes"
          value={String(pendingCount)}
          helper="Aguardando pagamento"
        />
      </section>

      {error ? (
        <div className="mt-4 rounded-[8px] bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      {!activeProject ? (
        <Card className="mt-4">
          <p className="font-semibold text-graphite/70">
            Selecione uma obra para ver pagamentos da equipe.
          </p>
        </Card>
      ) : null}

      <section className="mt-4">
        <Card>
          <div className="flex items-center gap-2">
            <CalendarDays size={19} className="text-build" />
            <h2 className="text-lg font-black text-foundation">Filtros</h2>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {periods.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectPeriod(item)}
                className={`h-10 shrink-0 rounded-[8px] px-4 text-sm font-black ${
                  period === item
                    ? "bg-foundation text-white"
                    : "bg-concrete text-foundation"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div
            className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ${
              period === "Personalizado"
                ? "mt-4 grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="grid gap-4 sm:grid-cols-2">
                <DateInput label="Data inicial" value={startDate} onChange={setStartDate} />
                <DateInput label="Data final" value={endDate} onChange={setEndDate} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={applyCustomFilter}
                  className="inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-foundation px-5 text-sm font-black text-white sm:w-auto"
                >
                  Aplicar filtro
                </button>
                <button
                  type="button"
                  onClick={clearDateFilter}
                  className="inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-concrete px-5 text-sm font-black text-foundation sm:w-auto"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm font-bold text-graphite/60">
            <CalendarDays size={16} className="shrink-0 text-build" />
            {periodSummary}
          </p>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_390px]">
        <Card>
          <div className="flex items-center gap-2">
            <UserRoundCheck size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">Pagamentos identificados</h2>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label>
              <span className="text-sm font-black text-foundation">Buscar profissional</span>
              <div className="relative mt-2">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-build" />
                <input
                  type="search"
                  value={professionalSearch}
                  onChange={(event) => setProfessionalSearch(event.target.value)}
                  placeholder="Nome ou função"
                  className="h-12 w-full rounded-[8px] border border-black/10 bg-white pl-10 pr-3 text-sm outline-none focus:border-build"
                />
              </div>
            </label>
            <SelectInput label="Ordenar por" value={sortBy} options={sortOptions} onChange={setSortBy} />
            <SelectInput label="Filtrar função" value={roleFilter} options={roleOptions} onChange={setRoleFilter} />
          </div>

          <div className="mt-4 grid gap-2">
            {loading ? (
              <p className="text-sm font-semibold text-graphite/60">Carregando pagamentos…</p>
            ) : null}
            {!loading && !filteredPayments.length ? (
              <p className="text-sm font-semibold text-graphite/60">
                Nenhum pagamento registrado.
              </p>
            ) : null}
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="grid gap-2 rounded-[8px] bg-concrete p-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-sm font-black text-foundation">
                    {payment.prestadorName}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-graphite/55">
                    {payment.role} · {payment.date} · {payment.status}
                  </p>
                </div>
                <strong className="text-sm text-foundation">{payment.amount}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <AlertCircle size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">Alertas Financeiros</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {financialAlerts.map((alert) => (
              <div
                key={`${alert.text}-${alert.date}`}
                className={`flex items-start gap-3 rounded-[8px] border-l-4 p-3 ${
                  alert.tone === "urgent"
                    ? "border-red-600 bg-red-50"
                    : alert.tone === "warning"
                      ? "border-build bg-[#FFF4EA]"
                      : "border-moss bg-[#EAF4EF]"
                }`}
              >
                {alert.tone === "urgent" ? (
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                ) : alert.tone === "warning" ? (
                  <TriangleAlert size={18} className="mt-0.5 shrink-0 text-build" />
                ) : (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-moss" />
                )}
                <div>
                  <p className="text-sm font-black text-foundation">{alert.text}</p>
                  <p className="mt-1 text-xs font-bold text-graphite/55">{alert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2">
            <Clock3 size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">Próximos pagamentos</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {!upcomingPayments.length ? (
              <p className="text-sm font-semibold text-graphite/60">
                Nenhum pagamento pendente.
              </p>
            ) : null}
            {upcomingPayments.map((payment) => (
              <div key={`${payment.date}-${payment.name}`} className="grid gap-2 rounded-[8px] bg-concrete p-3 sm:grid-cols-[100px_1fr_auto] sm:items-center">
                <p className="text-xs font-black uppercase text-build">{payment.date}</p>
                <div>
                  <p className="text-sm font-black text-foundation">{payment.name}</p>
                  <p className="mt-1 text-xs font-semibold text-graphite/55">{payment.role}</p>
                </div>
                <strong className="text-sm text-foundation">{payment.value}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <WalletCards size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">Gastos por função</h2>
          </div>
          <div className="mt-5 grid gap-4">
            {!roleCosts.length ? (
              <p className="text-sm font-semibold text-graphite/60">
                Sem dados de gastos por função.
              </p>
            ) : null}
            {roleCosts.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between gap-3 text-sm font-black">
                  <span className="text-foundation">{item.label}</span>
                  <span className="text-build">{item.value}%</span>
                </div>
                <div className="mt-2 h-5 overflow-hidden rounded-[6px] bg-concrete">
                  <div className="h-full rounded-[6px] bg-build" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-4">
        <Card>
          <div className="flex items-center gap-2">
            <History size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">Histórico recente</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {!recentHistory.length ? (
              <p className="text-sm font-semibold text-graphite/60">
                Nenhum pagamento confirmado recentemente.
              </p>
            ) : null}
            {recentHistory.map((item) => (
              <div key={`${item.date}-${item.name}`} className="grid gap-3 rounded-[8px] bg-concrete p-3 sm:grid-cols-[90px_1fr_auto] sm:items-center">
                <p className="text-xs font-black uppercase text-build">{item.date}</p>
                <div>
                  <p className="text-sm font-black text-foundation">{item.name}</p>
                  <p className="mt-1 text-xs font-semibold text-graphite/55">{item.role}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-moss">
                    <CheckCircle2 size={14} />
                    {item.status}
                  </p>
                </div>
                <strong className="text-base text-foundation">{item.value}</strong>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-sm font-black text-foundation">{label}</span>
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build" />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-sm font-black text-foundation">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
