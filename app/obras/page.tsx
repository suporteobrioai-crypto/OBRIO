"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarDays,
  CheckCircle2,
  FilePenLine,
  Plus,
  Send,
  Settings,
  Trash2,
  UserRound,
  WalletCards,
  X
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, Field, Metric, SelectField } from "@/components/Ui";
import { createClient } from "@/lib/supabase/client";
import { mapObraRow, type ObraView } from "@/lib/obras";
import type { ObraRow, ObraStatus } from "@/lib/types/database";
const filters = ["Todas", "Ativas", "Pausadas", "Concluídas", "Arquivadas"] as const;

export default function ObrasPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todas");
  const [projects, setProjects] = useState<ObraView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configuredProject, setConfiguredProject] = useState<ObraView | null>(
    null
  );
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("obras")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setProjects([]);
        return;
      }

      setProjects((data as ObraRow[]).map(mapObraRow));
    } catch {
      setError("Configure as variáveis do Supabase em .env.local");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects.filter((project) => {
    if (filter === "Todas") return true;
    if (filter === "Ativas") return project.status === "Ativa";
    if (filter === "Pausadas") return project.status === "Pausada";
    if (filter === "Concluídas") return project.status === "Concluída";
    return project.status === "Arquivada";
  });

  const metrics = useMemo(() => {
    const active = projects.filter((p) => p.status === "Ativa").length;
    const totalSpent = projects.reduce((sum, p) => {
      const match = p.spent.match(/[\d.]+/);
      return sum + (match ? Number.parseFloat(match[0]) : 0);
    }, 0);
    const totalBudget = projects.reduce((sum, p) => {
      const match = p.budget.match(/[\d.]+/);
      return sum + (match ? Number.parseFloat(match[0]) : 0);
    }, 0);
    return {
      active: String(active),
      spent: totalSpent > 0 ? `R$ ${Math.round(totalSpent)}k` : "R$ 0",
      budget: totalBudget > 0 ? `R$ ${Math.round(totalBudget)}k` : "R$ 0"
    };
  }, [projects]);

  return (
    <AppShell
      title="Obras"
      subtitle="Visualize, acesse, crie e configure suas obras."
      action={
        <button
          type="button"
          onClick={() => setNewProjectOpen(true)}
          className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-foundation px-4 text-sm font-black text-white transition hover:bg-moss"
        >
          <Plus size={18} />
          Nova Obra
        </button>
      }
    >
      {error ? (
        <p className="mb-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Obras ativas"
          value={metrics.active}
          helper="Em andamento agora"
        />
        <Metric
          label="Investimento atual"
          value={metrics.spent}
          helper="Gastos de todas as obras"
        />
        <Metric
          label="Orçamento total"
          value={metrics.budget}
          helper="Orçamentos cadastrados"
        />
        <Metric label="Pendências" value="—" helper="Em breve" />
      </section>

      <section className="mt-4 flex gap-2 overflow-x-auto rounded-[8px] bg-concrete p-1">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`h-10 shrink-0 rounded-[8px] px-4 text-sm font-black ${
              filter === item ? "bg-foundation text-white" : "text-foundation"
            }`}
          >
            {item}
          </button>
        ))}
      </section>

      {loading ? (
        <p className="mt-6 text-sm font-semibold text-graphite/60">
          Carregando obras...
        </p>
      ) : null}

      {!loading && filteredProjects.length === 0 ? (
        <div className="mt-6 rounded-[8px] bg-concrete p-6 text-center">
          <p className="text-lg font-black text-foundation">
            Nenhuma obra encontrada
          </p>
          <Link
            href="/obras/nova"
            className="mt-4 inline-flex h-12 items-center justify-center rounded-[8px] bg-foundation px-5 text-sm font-black text-white"
          >
            Criar primeira obra
          </Link>
        </div>
      ) : null}

      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-concrete text-foundation">
                <Building2 size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-black text-foundation md:text-xl">
                      {project.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-graphite/60">
                      {project.type} · {project.city}/{project.state}
                    </p>
                  </div>
                  <span className="w-fit shrink-0 rounded-[8px] bg-concrete px-3 py-1.5 text-xs font-black text-foundation">
                    {project.status}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3 text-xs font-black">
                    <span className="text-graphite/55">Avanço da obra</span>
                    <span className="text-build">{project.progress}%</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-[6px] bg-concrete">
                    <div
                      className="h-full rounded-[6px] bg-build"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Info label="Gasto atual" value={project.spent} />
              <Info label="Orçamento" value={project.budget} />
              <Info label="Dias restantes" value={project.daysLeft} />
              <Info
                label="Responsável"
                value={project.responsible || "Sem responsável"}
                wide
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-foundation px-4 text-sm font-black text-white"
              >
                Entrar na obra
                <ArrowRight size={17} />
              </Link>
              <button
                type="button"
                onClick={() => setConfiguredProject(project)}
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-concrete px-4 text-sm font-black text-foundation"
              >
                <Settings size={17} className="text-build" />
                Configurações
              </button>
            </div>
          </Card>
        ))}
      </section>

      {newProjectOpen ? (
        <NewProjectModal onClose={() => setNewProjectOpen(false)} />
      ) : null}

      {configuredProject ? (
        <ProjectSettings
          project={configuredProject}
          onClose={() => setConfiguredProject(null)}
          onSaved={() => {
            setConfiguredProject(null);
            void loadProjects();
          }}
        />
      ) : null}
    </AppShell>
  );
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35 px-4 py-6">
      <div className="mx-auto w-full max-w-2xl rounded-[8px] bg-white p-5 shadow-soft md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-build">Nova obra</p>
            <h2 className="mt-1 text-2xl font-black text-foundation">
              Como deseja criar sua obra?
            </h2>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Link
            href="/obras/nova"
            className="group rounded-[8px] border border-black/8 bg-white p-5 transition hover:border-build"
          >
            <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-concrete text-build">
              <FilePenLine size={22} />
            </span>
            <h3 className="mt-4 text-lg font-black text-foundation">
              Cadastrar manualmente
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-graphite/60">
              Preencha as informações da obra passo a passo.
            </p>
          </Link>

          <div className="rounded-[8px] border border-build/35 bg-[#fffdf7] p-5">
            <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-foundation text-white">
              <Bot size={22} />
            </span>
            <h3 className="mt-4 text-lg font-black text-foundation">
              Criar com Obrio AI
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-graphite/60">
              Conte o que deseja e o Obrio prepara o cadastro.
            </p>
            <textarea
              className="mt-4 min-h-32 w-full resize-none rounded-[8px] border border-black/10 bg-white p-3 text-sm font-semibold outline-none placeholder:text-graphite/35 focus:border-build"
              placeholder="Ex: Quero criar uma reforma em um apartamento em Santos com orçamento de R$ 35.000 e prazo de 60 dias."
            />
            <button
              type="button"
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-4 text-sm font-black text-white"
            >
              Criar com Obrio AI
              <Send size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectSettings({
  project,
  onClose,
  onSaved
}: {
  project: ObraView;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState<ObraStatus>(project.status);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("obras")
        .update({ status })
        .eq("id", project.id);

      if (error) {
        setSaveError(error.message);
        return;
      }
      onSaved();
    } catch {
      setSaveError("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35 px-4 py-6">
      <div className="mx-auto w-full max-w-3xl rounded-[8px] bg-white p-5 shadow-soft md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-build">
              Configurações da obra
            </p>
            <h2 className="mt-1 text-2xl font-black text-foundation">
              {project.name}
            </h2>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        {saveError ? (
          <p className="mt-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm text-red-700">
            {saveError}
          </p>
        ) : null}

        <SettingsSection icon={<Building2 size={20} />} title="Dados da obra">
          <Field label="Nome da obra" placeholder={project.name} />
          <SelectField
            label="Tipo"
            options={[project.type, "Obra completa", "Reforma"]}
          />
          <Field label="Endereço" placeholder={project.address} />
          <Field label="Cidade" placeholder={project.city} />
          <Field label="Estado" placeholder={project.state} />
        </SettingsSection>

        <SettingsSection icon={<WalletCards size={20} />} title="Financeiro">
          <Field label="Orçamento previsto" placeholder={project.budget} />
        </SettingsSection>

        <SettingsSection icon={<CalendarDays size={20} />} title="Prazo">
          <Field label="Data de início" placeholder={project.startDate} />
          <Field
            label="Data prevista de entrega"
            placeholder={project.deliveryDate}
          />
        </SettingsSection>

        <SettingsSection icon={<UserRound size={20} />} title="Responsável">
          <SelectField
            label="Selecionar responsável"
            options={[
              project.responsible || "Sem responsável",
              "João Pereira",
              "Marcos Lima",
              "Carlos Mendes"
            ]}
          />
        </SettingsSection>

        <SettingsSection icon={<CheckCircle2 size={20} />} title="Status">
          <SelectField
            label="Status da obra"
            options={["Ativa", "Pausada", "Concluída", "Arquivada"]}
            value={status}
            onChange={(value) => setStatus(value as ObraStatus)}
          />
        </SettingsSection>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-[8px] bg-concrete px-5 text-sm font-black text-foundation"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="h-12 rounded-[8px] bg-foundation px-5 text-sm font-black text-white disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar configurações"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 border-t border-black/6 pt-5">
      <div className="flex items-center gap-2 text-build">
        {icon}
        <h3 className="text-sm font-black uppercase text-foundation">{title}</h3>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-concrete text-foundation"
      title="Fechar"
    >
      <X size={18} />
    </button>
  );
}

function Info({
  label,
  value,
  wide = false
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-[8px] bg-concrete p-3 ${
        wide ? "sm:col-span-3" : ""
      }`}
    >
      <p className="text-xs font-black uppercase text-graphite/50">{label}</p>
      <strong className="mt-1 block break-words text-sm font-black text-foundation">
        {value}
      </strong>
    </div>
  );
}
