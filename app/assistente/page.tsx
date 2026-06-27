import {
  BookOpenText,
  CalendarRange,
  Camera,
  HardHat,
  Mic,
  Bot,
  ReceiptText,
  ShoppingCart,
  WalletCards
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/Ui";

const capabilities = [
  {
    title: "Financeiro",
    icon: WalletCards,
    examples: [
      "Quanto já gastei nesta obra?",
      "Quais pagamentos estão pendentes?",
      "Compare o orçamento com o valor gasto."
    ]
  },
  {
    title: "Diário da Obra",
    icon: BookOpenText,
    examples: [
      "O que foi feito esta semana?",
      "Mostre as últimas fotos da obra.",
      "Registre que concluímos a laje."
    ]
  },
  {
    title: "Compras",
    icon: ShoppingCart,
    examples: [
      "Quanto gastei com cimento?",
      "Quais garantias vencem este mês?",
      "Encontre a nota fiscal da betoneira."
    ]
  },
  {
    title: "Planejamento",
    icon: CalendarRange,
    examples: [
      "Existe risco de atraso?",
      "O que preciso fazer hoje?",
      "Qual a previsão de conclusão?"
    ]
  }
];

export default function AssistentePage() {
  return (
    <AppShell
      title="Assistente Obrio AI"
      subtitle="Registre informações, consulte gastos, acompanhe sua obra e converse com o Obrio AI em linguagem natural."
    >
      <section>
        <div className="mb-2 flex items-center gap-2">
          <Bot size={19} className="text-build" />
          <h2 className="text-lg font-black text-foundation">
            O que o Obrio AI consegue fazer
          </h2>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          <CapabilityMetric
            icon={<Camera size={19} />}
            label="Fotos analisadas"
            value="124"
          />
          <CapabilityMetric
            icon={<ReceiptText size={19} />}
            label="Documentos lidos"
            value="386"
          />
          <CapabilityMetric
            icon={<Mic size={19} />}
            label="Áudios processados"
            value="82"
          />
          <CapabilityMetric
            icon={<Bot size={19} />}
            label="Registros organizados"
            value="1.248"
          />
        </div>
      </section>

      <section>
        <div className="mb-2 mt-3 flex items-center gap-2">
          <HardHat size={19} className="text-build" />
          <h2 className="text-lg font-black text-foundation">
            O que você pode pedir ao Obrio AI
          </h2>
        </div>
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((capability) => (
            <Card key={capability.title} className="p-2.5 md:p-3">
              <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-foundation text-build">
                <capability.icon size={16} />
              </span>
              <h3 className="mt-1.5 text-sm font-black text-foundation">
                {capability.title}
              </h3>
              <div className="mt-1.5 grid gap-1">
                {capability.examples.map((example) => (
                  <p
                    key={example}
                    className="rounded-[8px] bg-concrete px-2 py-1 text-[11px] font-semibold leading-4 text-graphite/70"
                  >
                    {example}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

    </AppShell>
  );
}

function CapabilityMetric({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-2.5 md:p-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-concrete text-build">
          {icon}
        </span>
        <div>
          <p className="text-[10px] font-black uppercase text-graphite/50">{label}</p>
          <strong className="mt-0.5 block text-lg font-black text-foundation">{value}</strong>
        </div>
      </div>
    </Card>
  );
}
