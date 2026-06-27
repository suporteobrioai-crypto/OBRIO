"use client";

import { useState } from "react";
import {
  CalendarDays,
  FileText,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  WalletCards
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Metric } from "@/components/Ui";

const periods = ["Hoje", "7 dias", "30 dias", "Personalizado"] as const;

const mostPurchased = [
  { label: "Cimento", value: 32 },
  { label: "Areia", value: 21 },
  { label: "Vergalhão", value: 17 },
  { label: "Brita", value: 10 }
];

const categoryCosts = [
  { label: "Materiais", value: 65 },
  { label: "Ferramentas", value: 15 },
  { label: "Locações", value: 10 },
  { label: "Outros", value: 10 }
];

const purchases = [
  {
    date: "Hoje",
    name: "30 sacos de cimento",
    supplier: "Depósito Central",
    value: "R$ 1.200"
  },
  {
    date: "Ontem",
    name: "Areia média",
    supplier: "Areial Norte",
    value: "R$ 850"
  },
  {
    date: "05/06",
    name: "Vergalhão 10mm",
    supplier: "Aço Forte",
    value: "R$ 2.600"
  }
];

const warranties = [
  { name: "Furadeira Bosch", expiration: "Vence em 18 dias", tone: "urgent" },
  { name: "Serra Mármore", expiration: "Vence em 42 dias", tone: "warning" },
  { name: "Betoneira 400L", expiration: "Vence em 67 dias", tone: "ok" }
];

const materials = [
  {
    name: "Cimento CP II",
    quantity: "320 sacos",
    supplier: "Depósito Central",
    value: "R$ 12.800",
    source: "Notas fiscais"
  },
  {
    name: "Areia média",
    quantity: "28 m³",
    supplier: "Areial Norte",
    value: "R$ 4.760",
    source: "Fotos e notas"
  },
  {
    name: "Vergalhão 10mm",
    quantity: "140 barras",
    supplier: "Aço Forte",
    value: "R$ 9.100",
    source: "PDF"
  }
];

export default function MateriaisPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30 dias");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedCustomPeriod, setAppliedCustomPeriod] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");
  const filteredMaterials = materials.filter((item) => {
    const query = materialSearch.trim().toLocaleLowerCase("pt-BR");
    if (!query) return true;

    return [item.name, item.supplier].some((value) =>
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
      subtitle="Consulte gastos, materiais, documentos e garantias organizados pelo Obrio AI."
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total gasto" value="R$ 398.000" helper="Todas as compras" />
        <Metric label="Materiais registrados" value="1.248" helper="Itens identificados" />
        <Metric label="Notas fiscais" value="386" helper="Documentos organizados" />
        <Metric label="Garantias ativas" value="72" helper="Produtos e equipamentos" />
      </section>

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
            {purchases.map((purchase) => (
              <div
                key={`${purchase.date}-${purchase.name}`}
                className="grid gap-2 rounded-[8px] bg-concrete p-3 sm:grid-cols-[90px_1fr_auto] sm:items-center"
              >
                <p className="text-xs font-black uppercase text-build">{purchase.date}</p>
                <div>
                  <p className="text-sm font-black text-foundation">{purchase.name}</p>
                  <p className="mt-1 text-xs font-semibold text-graphite/55">
                    {purchase.supplier}
                  </p>
                </div>
                <strong className="text-sm text-foundation">{purchase.value}</strong>
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
              <div key={item.name} className="rounded-[8px] bg-concrete p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-foundation">{item.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-graphite/60">
                      {item.quantity} · {item.supplier}
                    </p>
                  </div>
                  <strong className="shrink-0 text-sm text-foundation">{item.value}</strong>
                </div>
                <span className="mt-3 inline-flex rounded-[8px] bg-white px-2 py-1 text-xs font-bold text-foundation">
                  {item.source}
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
