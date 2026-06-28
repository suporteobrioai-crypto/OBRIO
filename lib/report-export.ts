import { formatCents } from "@/lib/format";

export type ReportPayload = {
  obraName: string;
  city: string;
  budgetCents: number;
  spentCents: number;
  progress: number;
  comprasTotalCents: number;
  pagamentosTotalCents: number;
  comprasCount: number;
  pagamentosCount: number;
  lembretesPendentes: number;
  diarioCount: number;
  generatedAt: string;
};

export function buildReportText(data: ReportPayload): string {
  const saldo = Math.max(0, data.budgetCents - data.spentCents);
  return [
    "RELATÓRIO OBRIo AI",
    "==================",
    "",
    `Obra: ${data.obraName}`,
    `Local: ${data.city}`,
    `Gerado em: ${data.generatedAt}`,
    "",
    "RESUMO FINANCEIRO",
    `- Orçamento: ${formatCents(data.budgetCents)}`,
    `- Gasto registrado: ${formatCents(data.spentCents)}`,
    `- Saldo: ${formatCents(saldo)}`,
    `- Compras (${data.comprasCount}): ${formatCents(data.comprasTotalCents)}`,
    `- Pagamentos (${data.pagamentosCount}): ${formatCents(data.pagamentosTotalCents)}`,
    "",
    "OPERACIONAL",
    `- Avanço informado: ${data.progress}%`,
    `- Lembretes pendentes: ${data.lembretesPendentes}`,
    `- Registros no diário: ${data.diarioCount}`,
    "",
    "— Gerado automaticamente pelo Obrio AI"
  ].join("\n");
}
