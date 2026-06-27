"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Camera,
  CheckCircle2,
  CloudRain,
  FileText,
  PackageCheck,
  TriangleAlert,
  WalletCards
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Metric } from "@/components/Ui";

const projectDashboards = [
  {
    id: "casa-vila-mariana",
    name: "Casa Vila Mariana",
    status: "Em andamento",
    detail: "128 m² · Residencial · São Paulo/SP",
    progress: 41,
    stats: [
      { label: "Orçamento previsto", value: "R$ 180k", helper: "Compras + equipe" },
      { label: "Valor gasto", value: "R$ 74k", helper: "41% consumido" },
      { label: "Saldo restante", value: "R$ 106k", helper: "Dentro do previsto" },
      { label: "Dias restantes", value: "48", helper: "Entrega em 22/08/2026" }
    ]
  },
  {
    id: "reforma-loja-centro",
    name: "Reforma Loja Centro",
    status: "Pausada",
    detail: "84 m² · Comercial · São Paulo/SP",
    progress: 28,
    stats: [
      { label: "Orçamento previsto", value: "R$ 65k", helper: "Compras + equipe" },
      { label: "Valor gasto", value: "R$ 18k", helper: "28% consumido" },
      { label: "Saldo restante", value: "R$ 47k", helper: "Dentro do previsto" },
      { label: "Dias restantes", value: "21", helper: "Entrega em 30/07/2026" }
    ]
  },
  {
    id: "apartamento-santos",
    name: "Apartamento Santos",
    status: "Em andamento",
    detail: "72 m² · Residencial · Santos/SP",
    progress: 34,
    stats: [
      { label: "Orçamento previsto", value: "R$ 92k", helper: "Compras + equipe" },
      { label: "Valor gasto", value: "R$ 31k", helper: "34% consumido" },
      { label: "Saldo restante", value: "R$ 61k", helper: "Dentro do previsto" },
      { label: "Dias restantes", value: "40", helper: "Entrega em 18/08/2026" }
    ]
  },
  {
    id: "condominio-riviera",
    name: "Condomínio Riviera",
    status: "Concluída",
    detail: "240 m² · Residencial · Bertioga/SP",
    progress: 100,
    stats: [
      { label: "Orçamento previsto", value: "R$ 410k", helper: "Compras + equipe" },
      { label: "Valor gasto", value: "R$ 398k", helper: "97% consumido" },
      { label: "Saldo restante", value: "R$ 12k", helper: "Finalizada abaixo do orçamento" },
      { label: "Dias restantes", value: "0", helper: "Entregue em 30/05/2026" }
    ]
  }
];

const todayItems = [
  { icon: Bell, label: "Lembretes pendentes", value: "2", text: "Comprar cimento às 8h" },
  { icon: WalletCards, label: "Pagamentos previstos", value: "1", text: "Pagar pedreiro João" },
  { icon: PackageCheck, label: "Compras programadas", value: "3", text: "Receber areia à tarde" },
  { icon: CloudRain, label: "Alertas climáticos", value: "1", text: "Evite pintura externa" }
];

const progressByMonth = [
  { label: "Jan", value: 10 },
  { label: "Fev", value: 22 },
  { label: "Mar", value: 35 },
  { label: "Abr", value: 41 }
];

const costsByCategory = [
  { label: "Compras", value: 46, amount: "R$ 34k" },
  { label: "Equipe", value: 42, amount: "R$ 31k" },
  { label: "Extras", value: 12, amount: "R$ 9k" }
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

const registeredToday = [
  { text: "3 compras registradas", tone: "ok" },
  { text: "2 pagamentos registrados", tone: "ok" },
  { text: "12 fotos adicionadas", tone: "ok" },
  { text: "1 pendência aberta", tone: "warning" },
  { text: "4 lembretes futuros", tone: "reminder" }
];

const timeline = [
  { type: "Diário", time: "Hoje, 16:20", text: "Laje concluída" },
  { type: "Compras", time: "Hoje, 14:10", text: "30 sacos de cimento registrados" },
  { type: "Pagamentos", time: "Ontem, 17:00", text: "Pagamento do pedreiro João confirmado" },
  { type: "Fotos", time: "Ontem, 11:30", text: "12 fotos adicionadas ao diário" },
  { type: "Lembretes", time: "Segunda, 08:00", text: "Comprar cimento marcado como pendente" }
];

export default function DashboardPage() {
  const [projectId, setProjectId] = useState("casa-vila-mariana");
  const currentProject =
    projectDashboards.find((project) => project.id === projectId) || projectDashboards[0];

  useEffect(() => {
    const savedProjectId = window.localStorage.getItem("obrio-active-project");
    if (savedProjectId) setProjectId(savedProjectId);

    function handleProjectChange(event: Event) {
      const customEvent = event as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id) setProjectId(customEvent.detail.id);
    }

    window.addEventListener("obrio:project-change", handleProjectChange);
    return () => window.removeEventListener("obrio:project-change", handleProjectChange);
  }, []);

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
              <BudgetBar label="Orçamento" value="R$ 180k" width={100} color="bg-foundation" />
              <BudgetBar label="Gasto" value="R$ 74k" width={41} color="bg-build" />
              <BudgetBar label="Saldo" value="R$ 106k" width={59} color="bg-moss" />
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
