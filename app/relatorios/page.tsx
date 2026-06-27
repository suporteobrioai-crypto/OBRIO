"use client";

import { useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Download,
  FileBarChart,
  Gauge,
  Lightbulb,
  Sparkles,
  TrendingUp,
  TriangleAlert
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Metric } from "@/components/Ui";

const periods = ["Hoje", "7 dias", "30 dias", "Personalizado"] as const;
const reportTypes = ["Completo", "Financeiro", "Compras", "Pagamentos", "Diário", "Prazo"];

const physicalBars = [
  { label: "Jan", month: "Janeiro", value: 18, spent: "R$ 42.000" },
  { label: "Fev", month: "Fevereiro", value: 32, spent: "R$ 96.000" },
  { label: "Mar", month: "Março", value: 45, spent: "R$ 178.000" },
  { label: "Abr", month: "Abril", value: 57, spent: "R$ 232.000" },
  { label: "Mai", month: "Maio", value: 68, spent: "R$ 310.000" },
  { label: "Jun", month: "Junho", value: 74, spent: "R$ 398.000" }
];

const financialBars = [
  { label: "Jan", month: "Janeiro", value: 12, spent: "R$ 42.000" },
  { label: "Fev", month: "Fevereiro", value: 19, spent: "R$ 96.000" },
  { label: "Mar", month: "Março", value: 27, spent: "R$ 178.000" },
  { label: "Abr", month: "Abril", value: 33, spent: "R$ 232.000" },
  { label: "Mai", month: "Maio", value: 38, spent: "R$ 310.000" },
  { label: "Jun", month: "Junho", value: 41, spent: "R$ 398.000" }
];

const intelligenceItems = [
  { tone: "ok", text: "Obra dentro do prazo." },
  { tone: "ok", text: "Consumo financeiro compatível com o avanço físico." },
  { tone: "warning", text: "Foram identificados 3 pagamentos sem comprovante." },
  { tone: "warning", text: "Compra de cimento acima da média do período anterior." },
  { tone: "ok", text: "Nenhum atraso crítico previsto para os próximos 7 dias." },
  { tone: "ok", text: "Previsão de conclusão mantida." }
] as const;

const alerts = [
  { tone: "warning", text: "Pagamentos aguardando confirmação (2)", detail: "Equipe Alfa e João Silva" },
  { tone: "warning", text: "Garantias vencendo (1)", detail: "Furadeira Bosch vence em 15 dias" },
  { tone: "danger", text: "Compras sem nota fiscal (1)", detail: "R$ 1.280 aguardando documento" },
  { tone: "warning", text: "Aumento de preço identificado (1)", detail: "Cimento subiu 8% no período" },
  { tone: "ok", text: "Nenhum atraso crítico", detail: "Cronograma permanece saudável" }
] as const;

export default function RelatoriosPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30 dias");
  const [reportType, setReportType] = useState("Completo");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedCustomPeriod, setAppliedCustomPeriod] = useState("");
  const [chartMode, setChartMode] = useState<"physical" | "financial">("physical");

  const chartData = chartMode === "physical" ? physicalBars : financialBars;
  const periodSummary =
    period === "Hoje"
      ? "Analisando os dados de hoje"
      : period === "7 dias"
        ? "Analisando os últimos 7 dias"
        : period === "30 dias"
          ? "Analisando os últimos 30 dias"
          : appliedCustomPeriod || "Selecione as datas para analisar o período";

  function selectPeriod(item: (typeof periods)[number]) {
    setPeriod(item);
    if (item !== "Personalizado") setAppliedCustomPeriod("");
  }

  function applyCustomFilter() {
    if (!startDate || !endDate) return;
    const formatDate = (value: string) => {
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    };
    setAppliedCustomPeriod(
      `Analisando de ${formatDate(startDate)} até ${formatDate(endDate)}`
    );
  }

  function clearFilter() {
    setPeriod("30 dias");
    setStartDate("");
    setEndDate("");
    setAppliedCustomPeriod("");
  }

  return (
    <AppShell
      title="Relatórios"
      subtitle="Pergunte ao Obrio AI sobre sua obra ou gere relatórios completos em segundos."
    >
      <div className="flex flex-col">
        <section className="order-2 mt-4 hidden gap-3 xl:order-1 xl:mt-0 xl:grid xl:grid-cols-4">
          <Metric label="Avanço físico" value="74%" helper="Evolução da obra" />
          <Metric label="Prazo" value="No prazo" helper="48 dias restantes" />
          <Metric label="Orçamento" value="41%" helper="Consumido até agora" />
          <Metric label="Pendências" value="7" helper="Itens em aberto" />
        </section>

        <section className="order-1 xl:order-2 xl:mt-4">
          <Card className="overflow-hidden border-foundation/10 bg-[#F7FAF8]">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-foundation text-white">
              <Sparkles size={25} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-build">Obrio AI</p>
              <h2 className="mt-1 break-words text-xl font-black leading-tight text-foundation sm:text-2xl">
                Análise Inteligente do Obrio AI
              </h2>
              <p className="mt-1 text-sm font-semibold text-graphite/60">
                Leitura automática do período selecionado com base nos dados da obra.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-0 overflow-hidden rounded-[8px] border border-black/5 bg-white md:grid-cols-2">
            {intelligenceItems.map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-3 border-b border-black/5 p-4 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:[&:nth-child(odd)]:border-r"
              >
                {item.tone === "ok" ? (
                  <CheckCircle2 size={21} className="mt-0.5 shrink-0 text-moss" />
                ) : (
                  <TriangleAlert size={21} className="mt-0.5 shrink-0 text-build" />
                )}
                <p className="min-w-0 break-words text-sm font-bold leading-5 text-foundation">{item.text}</p>
              </div>
            ))}
          </div>
          </Card>
        </section>
      </div>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="order-2 md:order-1">
          <div className="flex items-center gap-2">
            <AlertCircle size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">Alertas da Obra</h2>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {alerts.map((alert) => (
              <div
                key={alert.text}
                className={`rounded-[8px] border-l-4 p-3 ${
                  alert.tone === "danger"
                    ? "border-red-600 bg-red-50"
                    : alert.tone === "warning"
                      ? "border-build bg-[#FFF4EA]"
                      : "border-moss bg-[#EAF4EF]"
                }`}
              >
                <div className="flex items-start gap-2">
                  {alert.tone === "ok" ? (
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-moss" />
                  ) : alert.tone === "danger" ? (
                    <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-600" />
                  ) : (
                    <TriangleAlert size={17} className="mt-0.5 shrink-0 text-build" />
                  )}
                  <div>
                    <p className="text-sm font-black text-foundation">{alert.text}</p>
                    <p className="mt-1 text-xs font-semibold text-graphite/55">{alert.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="order-1 !bg-foundation text-white md:order-2">
          <div className="flex items-center gap-2">
            <Gauge size={21} className="text-build" />
            <h2 className="text-xl font-black">Previsão da Obra</h2>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-[150px_1fr] sm:items-center xl:grid-cols-1 2xl:grid-cols-[150px_1fr]">
            <div className="mx-auto grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(#F17B22_0deg,#F17B22_331deg,rgba(255,255,255,0.14)_331deg)]">
              <div className="grid h-28 w-28 place-items-center rounded-full bg-foundation text-center">
                <div>
                  <strong className="block text-3xl font-black text-white">92%</strong>
                  <span className="mt-1 block text-[11px] font-bold leading-4 text-white/65">
                    chance de concluir no prazo
                  </span>
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              <ForecastItem label="Data prevista" value="15/08/2026" />
              <ForecastItem label="Custo estimado final" value="R$ 418.000" />
              <ForecastItem label="Desvio previsto" value="+2,1%" />
              <ForecastItem label="Tendência" value="Estável" highlight />
            </div>
          </div>
          <div className="mt-5 flex items-start gap-2 rounded-[8px] bg-white/10 p-3">
            <Lightbulb size={17} className="mt-0.5 shrink-0 text-build" />
            <p className="text-xs font-semibold leading-5 text-white/80">
              Mantido o ritmo atual, a obra deve terminar dentro do prazo e próxima do orçamento.
            </p>
          </div>
        </Card>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:hidden">
        <Metric label="Avanço físico" value="74%" helper="Evolução da obra" />
        <Metric label="Prazo" value="No prazo" helper="48 dias restantes" />
        <Metric label="Orçamento" value="41%" helper="Consumido até agora" />
        <Metric label="Pendências" value="7" helper="Itens em aberto" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[330px_1fr]">
        <Card className="md:p-4">
          <div className="flex items-center gap-2">
            <CalendarDays size={20} className="text-build" />
            <h2 className="text-lg font-black text-foundation">Período da análise</h2>
          </div>

          <label className="mt-3 block">
            <span className="text-sm font-black text-foundation">Tipo de relatório</span>
            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
            >
              {reportTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 xl:grid xl:grid-cols-2">
            {periods.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectPeriod(item)}
                className={`h-9 shrink-0 rounded-[8px] px-3 text-xs font-black ${
                  period === item ? "bg-foundation text-white" : "bg-concrete text-foundation"
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
              <DateInput label="Data inicial" value={startDate} onChange={setStartDate} />
              <div className="mt-3">
                <DateInput label="Data final" value={endDate} onChange={setEndDate} />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                <button
                  type="button"
                  onClick={applyCustomFilter}
                  className="h-11 rounded-[8px] bg-foundation px-4 text-sm font-black text-white"
                >
                  Aplicar filtro
                </button>
                <button
                  type="button"
                  onClick={clearFilter}
                  className="h-11 rounded-[8px] bg-concrete px-4 text-sm font-black text-foundation"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs font-bold leading-5 text-graphite/60">
            <CalendarDays size={15} className="mt-0.5 shrink-0 text-build" />
            {periodSummary}
          </p>
        </Card>

        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={21} className="text-build" />
              <h2 className="text-xl font-black text-foundation">Evolução da Obra</h2>
            </div>
            <div className="inline-flex w-full rounded-[8px] bg-concrete p-1 sm:w-auto">
              <ChartToggle
                active={chartMode === "physical"}
                label="Avanço Físico"
                onClick={() => setChartMode("physical")}
              />
              <ChartToggle
                active={chartMode === "financial"}
                label="Financeiro"
                onClick={() => setChartMode("financial")}
              />
            </div>
          </div>

          <div className="mt-5 flex h-64 w-full items-end gap-2 rounded-[8px] bg-concrete p-4 sm:gap-3">
            {chartData.map((bar, index) => (
              <div key={`${chartMode}-${bar.label}`} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
                <div className="relative flex flex-1 items-end">
                  <div
                    title={`${bar.label}: ${bar.value}%`}
                    className={`report-chart-bar w-full cursor-default rounded-t-[6px] transition-colors duration-200 ${
                      chartMode === "physical"
                        ? "bg-foundation group-hover:bg-moss"
                        : "bg-build group-hover:bg-[#D96512]"
                    }`}
                    style={{
                      height: `${bar.value}%`,
                      animationDelay: `${index * 80}ms`
                    }}
                  />
                  <span className="pointer-events-none absolute left-1/2 top-0 z-10 w-40 -translate-x-1/2 -translate-y-8 rounded-[6px] bg-foundation p-2 text-left text-[10px] font-bold leading-4 text-white opacity-0 shadow-soft transition group-hover:-translate-y-10 group-hover:opacity-100">
                    <strong className="block text-xs">{bar.month}</strong>
                    <span className="block">Avanço físico: {physicalBars[index].value}%</span>
                    <span className="block">Gasto acumulado: {bar.spent}</span>
                  </span>
                </div>
                <span className="text-center text-[11px] font-black text-graphite/58 sm:text-xs">
                  {bar.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-graphite/60">
            {chartMode === "physical"
              ? "Avanço físico acumulado da obra por mês."
              : "Percentual do orçamento consumido por mês."}
          </p>
        </Card>
      </section>

      <section className="mt-4">
        <Card>
          <div className="flex items-center gap-2">
            <Download size={21} className="text-build" />
            <h2 className="text-xl font-black text-foundation">Exportação</h2>
          </div>
          <p className="mt-2 text-sm font-black text-foundation">
            Compartilhe com clientes, engenheiros e contador
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ExportButton
              icon={<Download size={18} />}
              title="Exportar PDF"
              description="Relatório executivo da obra."
              primary
            />
            <ExportButton
              icon={<FileBarChart size={18} />}
              title="Exportar Excel (.xlsx)"
              description="Prestação de contas e organização contábil."
            />
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

function ForecastItem({
  label,
  value,
  highlight = false
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-xs font-semibold text-white/65">{label}</span>
      <strong className={`text-right text-lg font-black ${highlight ? "text-build" : "text-white"}`}>
        {value}
      </strong>
    </div>
  );
}

function DateInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-foundation">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
      />
    </label>
  );
}

function ChartToggle({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 flex-1 whitespace-nowrap rounded-[6px] px-3 text-xs font-black sm:flex-none ${
        active ? "bg-foundation text-white" : "text-foundation"
      }`}
    >
      {label}
    </button>
  );
}

function ExportButton({
  icon,
  title,
  description,
  primary = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex min-h-20 items-center gap-3 rounded-[8px] p-4 text-left ${
        primary ? "bg-foundation text-white" : "bg-concrete text-foundation"
      }`}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ${
        primary ? "bg-white/10 text-build" : "bg-white text-build"
      }`}>
        {icon}
      </span>
      <span>
        <strong className="block text-sm font-black">{title}</strong>
        <span className={`mt-1 block text-xs font-semibold leading-5 ${
          primary ? "text-white/70" : "text-graphite/58"
        }`}>
          {description}
        </span>
      </span>
    </button>
  );
}
