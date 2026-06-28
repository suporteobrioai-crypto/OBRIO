"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CreditCard, Crown, ExternalLink, ShieldCheck, XCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Metric } from "@/components/Ui";
import { useObras } from "@/hooks/useObras";
import { useSubscription } from "@/hooks/useSubscription";
import { formatDateBr } from "@/lib/format";
import { PLAN_LIMITS, type SubscriptionPlan } from "@/lib/types/database";

const SALES_PAGE_URL =
  process.env.NEXT_PUBLIC_SALES_PAGE_URL ?? "https://pay.hotmart.com";

const planCards: { key: SubscriptionPlan; limit: string; helper: string }[] = [
  { key: "gratuito", limit: "1 obra", helper: "Para começar" },
  { key: "mensal", limit: "5 obras", helper: "Pequenas equipes" },
  { key: "premium", limit: "10 obras", helper: "Múltiplas obras" }
];

export default function AssinaturaPage() {
  const { limits, plan, subscription, loading, error } = useSubscription();
  const { obras } = useObras();

  const obrasEmUso = useMemo(
    () => obras.filter((item) => item.status !== "Arquivada").length,
    [obras]
  );

  const nextBilling = subscription?.current_period_end
    ? formatDateBr(subscription.current_period_end.slice(0, 10))
    : "—";

  const statusLabel =
    subscription?.status === "active" ? "Ativa" : subscription?.status ?? "Sem cobrança";

  return (
    <AppShell
      title="Minha Assinatura"
      subtitle="Plano atual e limites sincronizados com seu perfil. Compras via Hotmart."
    >
      {loading ? (
        <p className="mb-4 text-sm font-semibold text-graphite/60">Carregando assinatura…</p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Plano atual" value={limits.label} helper={statusLabel} />
        <Metric
          label="Obras permitidas"
          value={String(limits.obraLimit)}
          helper={`${obrasEmUso} em uso`}
        />
        <Metric
          label="Responsáveis"
          value={String(limits.responsavelLimit)}
          helper="Por plano"
        />
        <Metric label="Próxima cobrança" value={nextBilling} helper="Período atual" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="flex items-center gap-3">
            <Crown className="text-build" size={25} />
            <h2 className="text-xl font-black text-foundation">Limites do plano</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {planCards.map((item) => (
              <div
                key={item.key}
                className={`rounded-[8px] border p-4 ${
                  item.key === plan
                    ? "border-build bg-[#fffdf7]"
                    : "border-black/5 bg-concrete"
                }`}
              >
                <h3 className="text-lg font-black text-foundation">
                  {PLAN_LIMITS[item.key].label}
                </h3>
                <p className="mt-2 text-2xl font-black text-foundation">{item.limit}</p>
                <p className="mt-2 text-sm font-semibold text-graphite/60">{item.helper}</p>
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
              <strong className="mt-1 block text-xl font-black text-foundation">
                {statusLabel}
              </strong>
            </div>
            <div className="rounded-[8px] bg-concrete p-4">
              <p className="text-xs font-black uppercase text-graphite/50">Próxima cobrança</p>
              <strong className="mt-1 block text-xl font-black text-foundation">
                {nextBilling}
              </strong>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <h2 className="text-xl font-black text-foundation">Gerenciar plano</h2>
          <p className="mt-2 text-sm font-semibold text-graphite/65">
            A compra e renovação do Obrio AI são feitas pela Hotmart. Após a compra, você
            recebe um e-mail com link para criar sua conta. Upgrade, alteração e cancelamento
            in-app serão disponibilizados após a conclusão do núcleo do produto.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Link
              href={SALES_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-foundation px-4 text-sm font-black text-white"
            >
              <ExternalLink size={18} />
              Ver planos na Hotmart
            </Link>
            <button
              type="button"
              disabled
              title="Disponível após conclusão do sistema"
              className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-[8px] bg-concrete px-4 text-sm font-black text-foundation opacity-60"
            >
              <CreditCard size={18} className="text-build" />
              Alterar pagamento
            </button>
            <button
              type="button"
              disabled
              title="Disponível após conclusão do sistema"
              className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-[8px] border border-red-200 bg-white px-4 text-sm font-black text-red-600 opacity-60"
            >
              <XCircle size={18} />
              Cancelar assinatura
            </button>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
