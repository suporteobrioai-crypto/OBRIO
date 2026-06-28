"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  FileImage,
  Filter,
  MessageSquareText,
  Paperclip
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, SelectField } from "@/components/Ui";
import { useDiario } from "@/hooks/useDiario";
import { useObraAtiva } from "@/hooks/useObraAtiva";
import { useObras } from "@/hooks/useObras";

const recordTypes = [
  "Todos",
  "Texto",
  "Foto",
  "Compra",
  "Pagamento",
  "Lembrete",
  "Clima"
];

export default function DiarioPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { shellProjects } = useObras();
  const { activeProject } = useObraAtiva(shellProjects);
  const { entries, loading, error } = useDiario(activeProject?.id ?? null);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return entries;
    return entries.filter(
      (entry) =>
        entry.content.toLocaleLowerCase("pt-BR").includes(query) ||
        entry.author.toLocaleLowerCase("pt-BR").includes(query) ||
        entry.tags.some((tag) => tag.toLocaleLowerCase("pt-BR").includes(query))
    );
  }, [entries, search]);

  return (
    <AppShell
      title="Diário da Obra"
      subtitle="Consulte e revise tudo que aconteceu na obra."
    >
      {!activeProject ? (
        <Card>
          <p className="font-semibold text-graphite/70">
            Selecione ou crie uma obra para ver o diário.
          </p>
        </Card>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-[8px] bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <section>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-foundation">Histórico da Obra</h2>
            <p className="mt-1 text-sm font-semibold leading-6 text-graphite/60">
              {activeProject
                ? `Registros de ${activeProject.name}`
                : "Veja tudo que foi registrado na obra em ordem cronológica."}
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
            {loading ? (
              <Card>
                <p className="text-sm font-semibold text-graphite/60">Carregando diário…</p>
              </Card>
            ) : null}
            {!loading && !filteredEntries.length ? (
              <Card>
                <p className="text-sm font-semibold text-graphite/60">
                  Nenhum registro no diário ainda.
                </p>
              </Card>
            ) : null}
            {filteredEntries.map((entry) => (
              <Card
                key={entry.id}
                className="max-w-[calc(100vw-32px)] xl:max-w-none"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-concrete text-build">
                    {entry.attachments.length ? (
                      <FileImage size={19} />
                    ) : (
                      <MessageSquareText size={19} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase text-build">
                          {entry.date}
                        </p>
                        <p className="mt-1 text-xs font-bold text-graphite/50">
                          Diário · {entry.author}
                        </p>
                      </div>
                      <CalendarDays size={17} className="hidden shrink-0 text-build sm:block" />
                    </div>

                    <p className="mt-3 text-sm font-semibold leading-6 text-graphite/78">
                      {entry.content}
                    </p>

                    {entry.weatherNote ? (
                      <p className="mt-2 text-xs font-bold text-graphite/55">
                        Clima: {entry.weatherNote}
                      </p>
                    ) : null}

                    {entry.tags.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-[8px] bg-concrete px-2.5 py-1.5 text-xs font-bold text-foundation"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {entry.attachments.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {entry.attachments.map((attachment) => (
                          <span
                            key={attachment}
                            className="inline-flex items-center gap-1.5 rounded-[8px] bg-concrete px-2.5 py-1.5 text-xs font-bold text-foundation"
                          >
                            <Paperclip size={13} className="text-build" />
                            {attachment.split("/").pop() ?? attachment}
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
                <label className="block">
                  <span className="text-sm font-black text-foundation">
                    Buscar no diário
                  </span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="laje, elétrica, entrega..."
                    className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
                  />
                </label>
                <SelectField label="Tipo de registro" options={recordTypes} />
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
