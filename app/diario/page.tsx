"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  FileAudio,
  FileImage,
  Filter,
  MessageSquareText,
  Paperclip
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Field, SelectField } from "@/components/Ui";

const entries = [
  {
    date: "Hoje",
    time: "16:20",
    type: "Diário",
    origin: "Obrio AI",
    text: "Concluímos a laje e registramos 12 fotos.",
    attachments: ["12 fotos", "Texto"],
    icon: FileImage
  },
  {
    date: "Hoje",
    time: "14:10",
    type: "Compra",
    origin: "WhatsApp",
    text: "Chegaram 30 sacos de cimento e 5 m³ de areia.",
    attachments: ["Nota fiscal", "Foto"],
    icon: FileImage
  },
  {
    date: "Ontem",
    time: "18:05",
    type: "Áudio",
    origin: "Obrio AI",
    text: "Início da instalação elétrica nos quartos.",
    attachments: ["Áudio de 0:42"],
    icon: FileAudio
  },
  {
    date: "05/06/2026",
    time: "09:30",
    type: "Pagamento",
    origin: "Manual",
    text: "Pagamento de R$ 800 confirmado para João Pereira.",
    attachments: ["Comprovante"],
    icon: Paperclip
  },
  {
    date: "04/06/2026",
    time: "08:00",
    type: "Lembrete",
    origin: "Obrio AI",
    text: "Comprar tinta para a área externa na sexta-feira.",
    attachments: [],
    icon: MessageSquareText
  }
];

const recordTypes = [
  "Todos",
  "Texto",
  "Foto",
  "Áudio",
  "Compra",
  "Pagamento",
  "Lembrete",
  "Clima",
  "Alteração da obra"
];

export default function DiarioPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <AppShell
      title="Diário da Obra"
      subtitle="Consulte e revise tudo que aconteceu na obra."
    >
      <section>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-foundation">Histórico da Obra</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-graphite/60">
              Veja tudo que foi registrado na obra em ordem cronológica.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-[8px] bg-concrete px-4 text-sm font-black text-foundation sm:w-auto xl:hidden"
            aria-expanded={filtersOpen}
          >
            <Filter size={17} className="text-build" />
            Filtrar
            <ChevronDown
              size={16}
              className={`transition ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="order-2 grid min-w-0 gap-3 xl:order-1">
            {entries.map((entry) => (
              <Card
                key={`${entry.date}-${entry.time}-${entry.text}`}
                className="max-w-[calc(100vw-32px)] xl:max-w-none"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-concrete text-build">
                    <entry.icon size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase text-build">
                          {entry.date}, {entry.time}
                        </p>
                        <p className="mt-1 text-xs font-bold text-graphite/50">
                          {entry.type} · {entry.origin}
                        </p>
                      </div>
                      <CalendarDays size={17} className="hidden shrink-0 text-build sm:block" />
                    </div>

                    <p className="mt-3 text-sm font-semibold leading-6 text-graphite/78">
                      {entry.text}
                    </p>

                    {entry.attachments.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.attachments.map((attachment) => (
                          <span
                            key={attachment}
                            className="inline-flex items-center gap-1.5 rounded-[8px] bg-concrete px-2.5 py-1.5 text-xs font-bold text-foundation"
                          >
                            <Paperclip size={13} className="text-build" />
                            {attachment}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <aside
            className={`order-1 ${filtersOpen ? "block" : "hidden"} xl:order-2 xl:block`}
          >
            <Card className="xl:sticky xl:top-36">
              <div className="flex items-center gap-2">
                <Filter size={19} className="text-build" />
                <h2 className="text-lg font-black text-foundation">Filtros</h2>
              </div>
              <div className="mt-4 grid gap-4">
                <Field
                  label="Buscar no diário"
                  placeholder="laje, elétrica, entrega..."
                />
                <Field label="Data inicial" placeholder="" type="date" />
                <Field label="Data final" placeholder="" type="date" />
                <SelectField label="Tipo de registro" options={recordTypes} />
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
