import { CalendarClock, CreditCard, Crown, ShieldCheck, TrendingUp, XCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Metric, PrimaryButton } from "@/components/Ui";

const plans = [
  { name: "Gratuito", limit: "1 obra", helper: "Teste por 30 dias" },
  { name: "Mensal", limit: "3 obras", helper: "Até 3 obras simultâneas" },
  { name: "Premium", limit: "10 obras", helper: "Até 10 obras simultâneas" }
];

export default function AssinaturaPage() {
  return (
    <AppShell
      title="Minha Assinatura"
      subtitle="Plano atual, limites, cobrança e status da assinatura."
      action={
        <PrimaryButton>
          <TrendingUp size={18} />
          Upgrade
        </PrimaryButton>
      }
    >
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Plano atual" value="Premium" helper="Ativo" />
        <Metric label="Obras permitidas" value="10" helper="2 em uso" />
        <Metric label="Colaboradores" value="10" helper="1 por obra" />
        <Metric label="Próxima cobrança" value="08/07" helper="2026" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="flex items-center gap-3">
            <Crown className="text-build" size={25} />
            <h2 className="text-xl font-black text-foundation">Limites do plano</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[8px] border p-4 ${
                  plan.name === "Premium"
                    ? "border-build bg-[#fffdf7]"
                    : "border-black/5 bg-concrete"
                }`}
              >
                <h3 className="text-lg font-black text-foundation">{plan.name}</h3>
                <p className="mt-2 text-2xl font-black text-foundation">{plan.limit}</p>
                <p className="mt-2 text-sm font-semibold text-graphite/60">{plan.helper}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-build" size={25} />
            <h2 className="text-xl font-black text-foundation">Status</h2>
          </div>
          <div className="mt-5 grid gap-3">
            <div className="rounded-[8px] bg-concrete p-4">
              <p className="text-xs font-black uppercase text-graphite/50">Assinatura</p>
              <strong className="mt-1 block text-xl font-black text-foundation">Ativa</strong>
            </div>
            <div className="rounded-[8px] bg-concrete p-4">
              <p className="text-xs font-black uppercase text-graphite/50">Próxima cobrança</p>
              <strong className="mt-1 block text-xl font-black text-foundation">08/07/2026</strong>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <h2 className="text-xl font-black text-foundation">Gerenciar pagamento</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-foundation px-4 text-sm font-black text-white">
              <TrendingUp size={18} />
              Upgrade
            </button>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-concrete px-4 text-sm font-black text-foundation">
              <CreditCard size={18} className="text-build" />
              Alterar Pagamento
            </button>
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-red-200 bg-white px-4 text-sm font-black text-red-600">
              <XCircle size={18} />
              Cancelar Assinatura
            </button>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
