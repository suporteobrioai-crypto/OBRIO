"use client";

import { useMemo } from "react";
import { Calculator, Plus, ReceiptText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Field, Metric, PrimaryButton, SelectField, SmartCaptureBox } from "@/components/Ui";
import { useMateriais } from "@/hooks/useMateriais";
import { useObraAtiva } from "@/hooks/useObraAtiva";
import { useObras } from "@/hooks/useObras";
import { usePagamentos } from "@/hooks/usePagamentos";
import { formatCents } from "@/lib/format";

type ExpenseRow = {
  id: string;
  date: string;
  desc: string;
  category: string;
  value: string;
  source: string;
};

export default function FinanceiroPage() {
  const { shellProjects, obras } = useObras();
  const { activeProject } = useObraAtiva(shellProjects);
  const obraId = activeProject?.id ?? null;
  const { compras, loading: loadingMateriais, error: materiaisError } = useMateriais(obraId);
  const { pagamentos, loading: loadingPagamentos, error: pagamentosError } = usePagamentos(obraId);

  const currentObra = obras.find((o) => o.id === obraId);

  const materiaisTotalCents = useMemo(
    () => compras.reduce((sum, item) => sum + item.totalCents, 0),
    [compras]
  );

  const maoDeObraTotalCents = useMemo(
    () =>
      pagamentos
        .filter((item) => item.status === "pago")
        .reduce((sum, item) => sum + item.amountCents, 0),
    [pagamentos]
  );

  const totalSpentCents = materiaisTotalCents + maoDeObraTotalCents;
  const budgetCents = currentObra?.budgetCents ?? 0;
  const pctConsumed =
    budgetCents > 0 ? Math.round((totalSpentCents / budgetCents) * 100) : 0;

  const expenses = useMemo(() => {
    const rows: ExpenseRow[] = [
      ...compras.map((compra) => ({
        id: `compra-${compra.id}`,
        date: compra.date,
        desc: compra.supplier,
        category: "Materiais",
        value: compra.total,
        source: compra.nfPath ? "Nota fiscal" : "Compra"
      })),
      ...pagamentos.map((pagamento) => ({
        id: `pagamento-${pagamento.id}`,
        date: pagamento.date,
        desc: pagamento.prestadorName,
        category: "Mão de obra",
        value: pagamento.amount,
        source: pagamento.receiptPath ? "Comprovante" : "Pagamento"
      }))
    ];
    return rows.slice(0, 20);
  }, [compras, pagamentos]);

  const loading = loadingMateriais || loadingPagamentos;
  const error = materiaisError ?? pagamentosError;

  return (
    <AppShell
      title="Financeiro"
      subtitle="Envie nota, foto, texto ou áudio. A IA classifica e contabiliza."
      action={
        <PrimaryButton>
          <Plus size={18} />
          Despesa
        </PrimaryButton>
      }
    >
      {!activeProject ? (
        <Card className="mb-4">
          <p className="font-semibold text-graphite/70">
            Selecione uma obra para ver o resumo financeiro.
          </p>
        </Card>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-[8px] bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric
          label="Total gasto"
          value={formatCents(totalSpentCents)}
          helper={
            budgetCents > 0 ? `${pctConsumed}% do orçamento` : "Compras + equipe"
          }
        />
        <Metric
          label="Materiais"
          value={formatCents(materiaisTotalCents)}
          helper="Compras registradas"
        />
        <Metric
          label="Mão de obra"
          value={formatCents(maoDeObraTotalCents)}
          helper="Pagamentos confirmados"
        />
        <Metric
          label="Pendências"
          value={String(pagamentos.filter((p) => p.status !== "pago").length)}
          helper="Pagamentos em aberto"
        />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[440px_1fr]">
        <Card>
          <h2 className="text-xl font-black text-foundation">Enviar despesa</h2>
          <div className="mt-4">
            <SmartCaptureBox
              title="Suba comprovantes, notas ou fale o gasto"
              description="No app final, OCR e IA vão ler a nota, identificar valor, fornecedor, categoria e salvar automaticamente."
              textPlaceholder="Ex: Paguei R$ 800 para o pedreiro João hoje."
            />
          </div>
          <div className="mt-5 grid gap-4">
            <p className="text-sm font-black text-foundation">Ajuste manual opcional</p>
            <Field label="Valor" placeholder="R$ 800" />
            <Field label="Descrição" placeholder="Pagamento pedreiro João" />
            <SelectField
              label="Categoria"
              options={["Materiais", "Mão de obra", "Gastos extras"]}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Calculator className="text-build" size={24} />
            <h2 className="text-xl font-black text-foundation">Últimos lançamentos</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-[8px] border border-black/5">
            {loading ? (
              <p className="p-3 text-sm font-semibold text-graphite/60">Carregando…</p>
            ) : null}
            {!loading && !expenses.length ? (
              <p className="p-3 text-sm font-semibold text-graphite/60">
                Nenhum lançamento registrado nesta obra.
              </p>
            ) : null}
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="grid gap-2 border-b border-black/5 p-3 text-sm last:border-b-0 md:grid-cols-[80px_1fr_140px_100px_90px]"
              >
                <strong className="text-foundation">{expense.date}</strong>
                <span className="font-semibold text-graphite/75">{expense.desc}</span>
                <span className="font-bold text-graphite/55">{expense.category}</span>
                <strong className="text-foundation md:text-right">{expense.value}</strong>
                <span className="inline-flex items-center gap-1 rounded-[8px] bg-concrete px-2 py-1 text-xs font-black text-foundation">
                  <ReceiptText size={13} className="text-build" />
                  {expense.source}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
