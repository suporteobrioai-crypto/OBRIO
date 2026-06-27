"use client";

import { Download, FileText, PenLine, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, Field, PrimaryButton } from "@/components/Ui";

const services = [
  "Pedreiro",
  "Servente",
  "Eletricista",
  "Pintor",
  "Empreiteiro",
  "Encanador",
  "Gesseiro",
  "Azulejista",
  "Carpinteiro",
  "Marceneiro",
  "Serralheiro",
  "Marmorista",
  "Telhadista",
  "Jardineiro",
  "Arquiteto",
  "Engenheiro",
  "Outros"
];

export default function RecibosPage() {
  const [service, setService] = useState("Pedreiro");
  const [customService, setCustomService] = useState("");
  const [receiptText, setReceiptText] = useState("");

  const serviceName = service === "Outros" ? customService || "profissional" : service;

  const professionalText = useMemo(
    () =>
      `Eu, __________________________________________, inscrito(a) no CPF sob o número ______________________, declaro para os devidos fins que recebi de Casa Vila Mariana a quantia de R$ 800,00 referente à prestação de serviços de ${serviceName}, executados na obra indicada. Declaro ainda que o valor acima foi recebido integralmente nesta data, dando plena e irrevogável quitação referente ao serviço descrito.`,
    [serviceName]
  );

  const previewText = receiptText || professionalText;

  return (
    <AppShell
      title="Gerar Recibos"
      subtitle="Revise os dados, edite o texto profissional e gere o PDF para assinatura."
    >
      <section className="grid gap-4 xl:grid-cols-[440px_1fr]">
        <Card>
          <h2 className="text-xl font-black text-foundation">
            Dados para gerar recibo
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-graphite/62">
            As despesas entram em Financeiro por foto, áudio ou texto. Aqui você
            revisa os dados, escolhe a profissão e ajusta o recibo.
          </p>

          <div className="mt-4 grid gap-4">
            <Field label="Nome" placeholder="João Silva" />
            <Field label="CPF" placeholder="000.000.000-00" />

            <label className="block">
              <span className="text-sm font-black text-foundation">Serviço</span>
              <select
                value={service}
                onChange={(event) => setService(event.target.value)}
                className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
              >
                {services.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            {service === "Outros" ? (
              <label className="block">
                <span className="text-sm font-black text-foundation">
                  Digite a profissão
                </span>
                <input
                  value={customService}
                  onChange={(event) => setCustomService(event.target.value)}
                  placeholder="Ex: Instalador de esquadrias"
                  className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
                />
                <p className="mt-2 text-xs font-bold text-graphite/55">
                  Digite a profissão.
                </p>
              </label>
            ) : null}

            <Field label="Valor" placeholder="R$ 800" />
            <Field label="Data" placeholder="Hoje" type="date" />
            <Field label="Observação" placeholder="Serviço realizado na laje" />

            <label className="block">
              <span className="text-sm font-black text-foundation">
                Texto do recibo
              </span>
              <textarea
                value={receiptText}
                onChange={(event) => setReceiptText(event.target.value)}
                placeholder={professionalText}
                className="mt-2 min-h-40 w-full resize-none rounded-[8px] border border-black/10 bg-white p-3 text-sm font-semibold leading-6 outline-none placeholder:text-graphite/45 focus:border-build"
              />
              <p className="mt-2 text-xs font-bold text-graphite/55">
                Você pode editar o texto antes de gerar o PDF.
              </p>
            </label>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-build" />
            <h2 className="text-xl font-black text-foundation">
              Prévia do recibo
            </h2>
          </div>
          <div className="mt-5 rounded-[8px] border border-black/10 bg-[#FBFCFB] p-5">
            <p className="text-center text-lg font-black text-foundation">
              RECIBO DE PRESTAÇÃO DE SERVIÇOS
            </p>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-graphite/75">
              {previewText}
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="border-t border-black/30 pt-3 text-center text-sm font-bold text-graphite/60">
                Assinatura do prestador
              </div>
              <div className="border-t border-black/30 pt-3 text-center text-sm font-bold text-graphite/60">
                Local e data
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation text-sm font-black text-white">
              <Download size={18} />
              Baixar PDF
            </button>
            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-concrete text-sm font-black text-foundation">
              <Printer size={18} className="text-build" />
              Imprimir
            </button>
          </div>
          <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-black/10 bg-white text-sm font-black text-foundation">
            <PenLine size={18} className="text-build" />
            Coletar assinatura no app
          </button>
        </Card>
      </section>
    </AppShell>
  );
}
