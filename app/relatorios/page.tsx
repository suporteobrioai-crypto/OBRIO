"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileBarChart, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Metric } from "@/components/Ui";
import { useDiario } from "@/hooks/useDiario";
import { useLembretes } from "@/hooks/useLembretes";
import { useMateriais } from "@/hooks/useMateriais";
import { useObraAtiva } from "@/hooks/useObraAtiva";
import { useObras } from "@/hooks/useObras";
import { usePagamentos } from "@/hooks/usePagamentos";
import { formatCents } from "@/lib/format";

export default function RelatoriosPage() {
  const { shellProjects, obras } = useObras();
  const { activeProject } = useObraAtiva(shellProjects);
  const obraId = activeProject?.id ?? null;
  const { compras } = useMateriais(obraId);
  const { pagamentos } = usePagamentos(obraId);
  const { reminders } = useLembretes(obraId);
  const { entries: diarioEntries } = useDiario(obraId);
  const [exporting, setExporting] = useState(false);

  const currentObra = useMemo(
    () => obras.find((o) => o.id === obraId) ?? null,
    [obras, obraId]
  );

  const comprasTotalCents = useMemo(
    () => compras.reduce((sum, item) => sum + item.totalCents, 0),
    [compras]
  );

  const pagamentosTotalCents = useMemo(
    () =>
      pagamentos
        .filter((item) => item.status === "pago")
        .reduce((sum, item) => sum + item.amountCents, 0),
    [pagamentos]
  );

  const pendingReminders = useMemo(
    () => reminders.filter((item) => item.status !== "completed").length,
    [reminders]
  );

  const pendingPayments = useMemo(
    () => pagamentos.filter((item) => item.status !== "pago").length,
    [pagamentos]
  );

  const budgetPct = useMemo(() => {
    if (!currentObra || currentObra.budgetCents <= 0) return 0;
    return Math.min(
      100,
      Math.round((currentObra.spentCents / currentObra.budgetCents) * 100)
    );
  }, [currentObra]);

  const alerts = useMemo(() => {
    const items: { tone: "warning" | "ok" | "danger"; text: string; detail: string }[] = [];
    if (pendingPayments > 0) {
      items.push({
        tone: "warning",
        text: `${pendingPayments} pagamento(s) pendente(s)`,
        detail: "Confira em Pagamentos"
      });
    }
    if (pendingReminders > 0) {
      items.push({
        tone: "warning",
        text: `${pendingReminders} lembrete(s) em aberto`,
        detail: "Confira em Lembretes"
      });
    }
    const comprasSemNf = compras.filter((item) => !item.nfPath).length;
    if (comprasSemNf > 0) {
      items.push({
        tone: "danger",
        text: `${comprasSemNf} compra(s) sem NF`,
        detail: "Anexe documentos em Compras"
      });
    }
    if (!items.length) {
      items.push({
        tone: "ok",
        text: "Nenhum alerta crítico",
        detail: "Dados atualizados da obra ativa"
      });
    }
    return items;
  }, [pendingPayments, pendingReminders, compras]);

  async function handleExport() {
    if (!currentObra) return;
    setExporting(true);
    try {
      const response = await fetch("/api/export/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          obraName: currentObra.name,
          city: `${currentObra.city} · ${currentObra.state}`,
          budgetCents: currentObra.budgetCents,
          spentCents: currentObra.spentCents,
          progress: currentObra.progress,
          comprasTotalCents,
          pagamentosTotalCents,
          comprasCount: compras.length,
          pagamentosCount: pagamentos.length,
          lembretesPendentes: pendingReminders,
          diarioCount: diarioEntries.length,
          generatedAt: new Date().toLocaleString("pt-BR")
        })
      });
      if (!response.ok) throw new Error("Falha na exportação");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `relatorio-${currentObra.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <AppShell
      title="Relatórios"
      subtitle="Resumo da obra ativa com dados reais de compras, pagamentos e pendências."
    >
      {!activeProject ? (
        <Card>
          <p className="font-semibold text-graphite/70">
            Selecione uma obra no menu superior para ver relatórios.
          </p>
          <Link
            href="/obras"
            className="mt-3 inline-flex text-sm font-black text-build underline"
          >
            Ir para Obras
          </Link>
        </Card>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Avanço informado"
              value={`${currentObra?.progress ?? 0}%`}
              helper="Progresso cadastrado na obra"
            />
            <Metric
              label="Prazo"
              value={currentObra?.daysLeft ?? "—"}
              helper={`Entrega ${currentObra?.deliveryDate ?? "—"}`}
            />
            <Metric
              label="Orçamento"
              value={`${budgetPct}%`}
              helper={`${formatCents(currentObra?.spentCents ?? 0)} de ${currentObra?.budget ?? "—"}`}
            />
            <Metric
              label="Pendências"
              value={String(pendingPayments + pendingReminders)}
              helper="Pagamentos + lembretes"
            />
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-2">
            <Card>
              <h2 className="text-xl font-black text-foundation">Financeiro</h2>
              <div className="mt-4 grid gap-3">
                <SummaryRow label="Compras" value={formatCents(comprasTotalCents)} />
                <SummaryRow label="Pagamentos confirmados" value={formatCents(pagamentosTotalCents)} />
                <SummaryRow
                  label="Saldo do orçamento"
                  value={formatCents(
                    Math.max(0, (currentObra?.budgetCents ?? 0) - (currentObra?.spentCents ?? 0))
                  )}
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-black text-foundation">Operacional</h2>
              <div className="mt-4 grid gap-3">
                <SummaryRow label="Registros no diário" value={String(diarioEntries.length)} />
                <SummaryRow label="Lembretes pendentes" value={String(pendingReminders)} />
                <SummaryRow label="Compras registradas" value={String(compras.length)} />
              </div>
            </Card>
          </section>

          <section className="mt-4">
            <Card>
              <div className="flex items-center gap-2">
                <TriangleAlert size={20} className="text-build" />
                <h2 className="text-xl font-black text-foundation">Alertas</h2>
              </div>
              <div className="mt-4 grid gap-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.text}
                    className={`rounded-[8px] border px-4 py-3 ${
                      alert.tone === "danger"
                        ? "border-red-200 bg-red-50"
                        : alert.tone === "warning"
                          ? "border-amber-200 bg-amber-50"
                          : "border-moss/20 bg-[#EAF4EF]"
                    }`}
                  >
                    <p className="text-sm font-black text-foundation">{alert.text}</p>
                    <p className="mt-1 text-xs font-semibold text-graphite/60">{alert.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="mt-4">
            <Card>
              <div className="flex items-center gap-2">
                <Download size={21} className="text-build" />
                <h2 className="text-xl font-black text-foundation">Exportação</h2>
              </div>
              <p className="mt-2 text-sm font-semibold text-graphite/65">
                Baixe um resumo textual da obra ativa. Exportação Excel em breve.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void handleExport()}
                  disabled={exporting || !currentObra}
                  className="flex min-h-20 items-center gap-3 rounded-[8px] bg-foundation p-4 text-left text-white disabled:opacity-50"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-white/10 text-build">
                    <Download size={18} />
                  </span>
                  <span>
                    <strong className="block text-sm font-black">
                      {exporting ? "Gerando…" : "Exportar relatório (.txt)"}
                    </strong>
                    <span className="mt-1 block text-xs font-semibold text-white/70">
                      Resumo financeiro e operacional da obra.
                    </span>
                  </span>
                </button>
                <ExportButtonDisabled
                  icon={<FileBarChart size={18} />}
                  title="Exportar Excel (.xlsx)"
                  description="Em breve — prestação de contas detalhada."
                />
              </div>
            </Card>
          </section>
        </>
      )}
    </AppShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] bg-concrete px-4 py-3">
      <span className="text-sm font-semibold text-graphite/65">{label}</span>
      <strong className="text-sm font-black text-foundation">{value}</strong>
    </div>
  );
}

function ExportButtonDisabled({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      disabled
      title="Em breve"
      aria-disabled="true"
      className="flex min-h-20 cursor-not-allowed items-center gap-3 rounded-[8px] bg-concrete p-4 text-left text-foundation opacity-60"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-white text-build">
        {icon}
      </span>
      <span>
        <strong className="block text-sm font-black">{title}</strong>
        <span className="mt-1 block text-xs font-semibold text-graphite/60">{description}</span>
      </span>
    </button>
  );
}
