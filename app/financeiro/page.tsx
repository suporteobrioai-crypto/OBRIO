import { Calculator, Plus, ReceiptText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Field, Metric, PrimaryButton, SelectField, SmartCaptureBox } from "@/components/Ui";

const expenses = [
  { date: "07/06", desc: "Pedreiro João", category: "Mão de obra", value: "R$ 800", source: "Áudio" },
  { date: "06/06", desc: "30 sacos de cimento", category: "Materiais", value: "R$ 1.200", source: "Nota fiscal" },
  { date: "04/06", desc: "Frete de material", category: "Gastos extras", value: "R$ 250", source: "Texto" }
];

export default function FinanceiroPage() {
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
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Total gasto" value="R$ 74k" helper="41% do orçamento" />
        <Metric label="Materiais" value="R$ 39k" helper="Lido de notas" />
        <Metric label="Mão de obra" value="R$ 28k" helper="Texto e áudio" />
        <Metric label="Extras" value="R$ 7k" helper="Fretes e ajustes" />
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
            <SelectField label="Categoria" options={["Materiais", "Mão de obra", "Gastos extras"]} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Calculator className="text-build" size={24} />
            <h2 className="text-xl font-black text-foundation">Últimos lançamentos</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-[8px] border border-black/5">
            {expenses.map((expense) => (
              <div
                key={`${expense.date}-${expense.desc}`}
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
