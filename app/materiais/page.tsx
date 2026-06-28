"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  FileText,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  WalletCards
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CreateRecordPanel } from "@/components/CreateRecordPanel";
import { Card, Metric, PrimaryButton } from "@/components/Ui";
import { useMateriais } from "@/hooks/useMateriais";
import { useObraAtiva } from "@/hooks/useObraAtiva";
import { useObras } from "@/hooks/useObras";
import { formatCents, parseBudgetToCents } from "@/lib/format";

const periods = ["Hoje", "7 dias", "30 dias", "Personalizado"] as const;

export default function MateriaisPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30 dias");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedCustomPeriod, setAppliedCustomPeriod] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");
  const { shellProjects } = useObras();
  const { activeProject } = useObraAtiva(shellProjects);
  const { compras, materiais, loading, error, createCompra } = useMateriais(
    activeProject?.id ?? null
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  const totalSpentCents = useMemo(
    () => compras.reduce((sum, item) => sum + item.totalCents, 0),
    [compras]
  );

  const nfCount = useMemo(
    () => compras.filter((item) => item.nfPath).length,
    [compras]
  );

  const warranties = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return materiais
      .filter((item) => item.warrantyUntil !== "—")
      .map((item) => {
        const [day, month, year] = item.warrantyUntil.split("/");
        const expiry = new Date(Number(year), Number(month) - 1, Number(day));
        const daysLeft = Math.ceil(
          (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        let tone: "urgent" | "warning" | "ok" = "ok";
        if (daysLeft <= 30) tone = "urgent";
        else if (daysLeft <= 60) tone = "warning";
        return {
          name: item.name,
          expiration:
            daysLeft < 0
              ? "Vencida"
              : daysLeft === 0
                ? "Vence hoje"
                : `Vence em ${daysLeft} dias`,
          tone
        };
      })
      .slice(0, 5);
  }, [materiais]);

  const mostPurchased = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of materiais) {
      counts.set(item.name, (counts.get(item.name) ?? 0) + 1);
    }
    const max = Math.max(1, ...Array.from(counts.values()));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([label, value]) => ({
        label,
        value: Math.round((value / max) * 100)
      }));
  }, [materiais]);

  const categoryCosts = useMemo(() => {
    const totals = new Map<string, number>();
    for (const item of materiais) {
      totals.set(item.category, (totals.get(item.category) ?? 0) + 1);
    }
    const sum = Array.from(totals.values()).reduce((acc, value) => acc + value, 0) || 1;
    return Array.from(totals.entries())
      .slice(0, 4)
      .map(([label, value]) => ({
        label,
        value: Math.round((value / sum) * 100)
      }));
  }, [materiais]);

  const filteredMaterials = materiais.filter((item) => {
    const query = materialSearch.trim().toLocaleLowerCase("pt-BR");
    if (!query) return true;
    return [item.name, item.category].some((value) =>
      value.toLocaleLowerCase("pt-BR").includes(query)
    );
  });

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

  function clearFilter() {
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
      title="Compras, Notas Fiscais e Garantias"
      subtitle="Registre compras e acompanhe materiais da obra ativa."
      action={
        activeProject ? (
          <PrimaryButton type="button" onClick={() => setShowCreateForm((v) => !v)}>
            + Compra
          </PrimaryButton>
        ) : undefined
      }
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total gasto"
          value={formatCents(totalSpentCents)}
          helper="Compras da obra ativa"
        />
        <Metric
          label="Materiais registrados"
          value={String(materiais.length)}
          helper="Itens identificados"
        />
        <Metric
          label="Notas fiscais"
          value={String(nfCount)}
          helper="Documentos organizados"
        />
        <Metric
          label="Garantias ativas"
          value={String(warranties.length)}
          helper="Produtos e equipamentos"
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
            Selecione uma obra para ver compras e materiais.
          </p>
        </Card>
      ) : null}

      {showCreateForm && activeProject ? (
        <section className="mt-4">
          <CreateRecordPanel
            title="Nova compra"
            description="Registre fornecedor e valor total da compra."
            submitLabel="Salvar compra"
            onCancel={() => setShowCreateForm(false)}
            fields={[
              { name: "supplier", label: "Fornecedor", placeholder: "Ex: Materiais Silva" },
              {
                name: "total",
                label: "Valor total (R$)",
                required: true,
                placeholder: "Ex: 1200"
              },
              {
                name: "purchase_date",
                label: "Data da compra",
                type: "date",
                defaultValue: new Date().toISOString().slice(0, 10)
              },
              { name: "notes", label: "Observações", type: "textarea" }
            ]}
            onSubmit={async (values) => {
              const total_cents = parseBudgetToCents(values.total);
              if (total_cents <= 0) throw new Error("Informe um valor válido.");
              await createCompra({
                supplier: values.supplier.trim() || undefined,
                total_cents,
                purchase_date: values.purchase_date || undefined,
                notes: values.notes.trim() || undefined
              });
              setShowCreateForm(false);
            }}
          />
        </section>
      ) : null}

      {!loading && activeProject && !compras.length && !showCreateForm ? (
        <Card className="mt-4">
          <p className="text-sm font-semibold text-graphite/65">
            Nenhuma compra registrada. Lance a primeira para acompanhar gastos.
          </p>
          <PrimaryButton type="button" className="mt-3" onClick={() => setShowCreateForm(true)}>
            + Registrar compra
          </PrimaryButton>
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
                <label className="block">
                  <span className="text-sm font-black text-foundation">Data inicial</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-black text-foundation">Data final</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
                  />
                </label>
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
                  onClick={clearFilter}
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

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Materiais mais comprados"
          icon={<PackageCheck size={21} />}
          data={mostPurchased}
          color="bg-foundation"
        />
        <ChartCard
          title="Gastos por categoria"
          icon={<WalletCards size={21} />}
          data={categoryCosts}
          color="bg-build"
        />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="flex items-center gap-2">
            <ReceiptText size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">Últimas compras</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {loading ? (
              <p className="text-sm font-semibold text-graphite/60">Carregando compras…</p>
            ) : null}
            {!loading && !compras.length ? (
              <p className="text-sm font-semibold text-graphite/60">
                Nenhuma compra registrada.
              </p>
            ) : null}
            {compras.slice(0, 5).map((purchase) => (
              <div
                key={purchase.id}
                className="grid gap-2 rounded-[8px] bg-concrete p-3 sm:grid-cols-[90px_1fr_auto] sm:items-center"
              >
                <p className="text-xs font-black uppercase text-build">{purchase.date}</p>
                <div>
                  <p className="text-sm font-black text-foundation">
                    {purchase.supplier}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-graphite/55">
                    {purchase.notes ?? "Compra registrada"}
                  </p>
                </div>
                <strong className="text-sm text-foundation">{purchase.total}</strong>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <ShieldCheck size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">
              Garantias próximas do vencimento
            </h2>
          </div>
          <div className="mt-4 grid gap-2">
            {!warranties.length ? (
              <p className="text-sm font-semibold text-graphite/60">
                Nenhuma garantia próxima do vencimento.
              </p>
            ) : null}
            {warranties.map((warranty) => (
              <div key={warranty.name} className="rounded-[8px] bg-concrete p-3">
                <p className="text-sm font-black text-foundation">{warranty.name}</p>
                <p
                  className={`mt-1 text-xs font-black ${
                    warranty.tone === "urgent"
                      ? "text-red-600"
                      : warranty.tone === "warning"
                        ? "text-build"
                        : "text-moss"
                  }`}
                >
                  {warranty.expiration}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-4">
        <Card>
          <div className="flex items-center gap-2">
            <FileText size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">
              Materiais identificados
            </h2>
          </div>
          <label className="mt-4 block max-w-md">
            <span className="text-sm font-black text-foundation">
              Buscar material
            </span>
            <input
              type="search"
              value={materialSearch}
              onChange={(event) => setMaterialSearch(event.target.value)}
              placeholder="Nome ou fornecedor"
              className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none placeholder:text-graphite/35 focus:border-build"
            />
          </label>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredMaterials.map((item) => (
              <div key={item.id} className="rounded-[8px] bg-concrete p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-foundation">{item.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-graphite/60">
                      {item.qty} {item.unit} · {item.category}
                    </p>
                  </div>
                  <strong className="shrink-0 text-sm text-foundation">{item.amount}</strong>
                </div>
                <span className="mt-3 inline-flex rounded-[8px] bg-white px-2 py-1 text-xs font-bold text-foundation">
                  Garantia: {item.warrantyUntil}
                </span>
              </div>
            ))}
            {!filteredMaterials.length ? (
              <p className="text-sm font-semibold text-graphite/60">
                Nenhum material encontrado.
              </p>
            ) : null}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

function ChartCard({
  title,
  icon,
  data,
  color
}: {
  title: string;
  icon: React.ReactNode;
  data: { label: string; value: number }[];
  color: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-2 text-build">
        {icon}
        <h2 className="text-xl font-black text-foundation">{title}</h2>
      </div>
      <div className="mt-5 grid gap-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-3 text-sm font-black">
              <span className="text-foundation">{item.label}</span>
              <span className="text-build">{item.value}%</span>
            </div>
            <div className="mt-2 h-5 overflow-hidden rounded-[6px] bg-concrete">
              <div
                className={`h-full rounded-[6px] ${color}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
