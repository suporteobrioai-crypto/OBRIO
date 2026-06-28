"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Edit3,
  Mail,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Users,
  X
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Card, Metric } from "@/components/Ui";
import { useObras } from "@/hooks/useObras";
import { useResponsaveis } from "@/hooks/useResponsaveis";
import { useSubscription } from "@/hooks/useSubscription";
import type { ResponsavelView } from "@/lib/responsaveis";

type ResponsibleForm = {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  role: string;
  projectId: string;
};

const emptyForm: ResponsibleForm = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  role: "",
  projectId: ""
};

export default function ResponsaveisObrasPage() {
  const { obras } = useObras();
  const { limits } = useSubscription();
  const {
    responsaveis: responsibles,
    loading,
    error,
    createResponsavel,
    updateResponsavel,
    deleteResponsavel
  } = useResponsaveis(obras);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ResponsibleForm>(emptyForm);
  const [notice, setNotice] = useState("");

  const editingResponsible = responsibles.find(
    (responsible) => responsible.id === editingId
  );

  const availableProjects = useMemo(() => {
    const linkedProjects = new Set(
      responsibles
        .filter((responsible) => responsible.id !== editingId)
        .map((responsible) => responsible.projectId)
    );
    return obras.filter((obra) => !linkedProjects.has(obra.id));
  }, [editingId, responsibles, obras]);

  const availableSlots = limits.responsavelLimit - responsibles.length;

  function updateForm(field: keyof ResponsibleForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openNewResponsible() {
    if (responsibles.length >= limits.responsavelLimit) {
      setNotice(
        `O plano ${limits.label} permite até ${limits.responsavelLimit} responsáveis.`
      );
      return;
    }
    setEditingId(null);
    setForm(emptyForm);
    setNotice("");
    setModalOpen(true);
  }

  function openEditResponsible(responsible: ResponsavelView) {
    setEditingId(responsible.id);
    setForm({
      name: responsible.name,
      phone: responsible.phone,
      whatsapp: responsible.whatsapp,
      email: responsible.email,
      role: responsible.role,
      projectId: responsible.projectId
    });
    setNotice("");
    setModalOpen(true);
  }

  async function saveResponsible(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.projectId) {
      setNotice("Preencha nome e obra para continuar.");
      return;
    }

    const projectAlreadyLinked = responsibles.some(
      (responsible) =>
        responsible.projectId === form.projectId && responsible.id !== editingId
    );
    if (projectAlreadyLinked) {
      setNotice("Esta obra já possui um responsável principal.");
      return;
    }

    try {
      if (editingId) {
        await updateResponsavel(editingId, {
          obra_id: form.projectId,
          name: form.name,
          phone: form.phone,
          email: form.email,
          role: form.role,
          status: "Pendente"
        });
        setNotice("Responsável atualizado com sucesso.");
      } else {
        await createResponsavel({
          obra_id: form.projectId,
          name: form.name,
          phone: form.phone || form.whatsapp,
          email: form.email,
          role: form.role,
          status: "Pendente"
        });
        setNotice("Responsável adicionado com sucesso.");
      }
      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }

  async function removeResponsible(responsible: ResponsavelView) {
    if (
      !window.confirm(
        `Remover ${responsible.name} da obra ${responsible.project}?`
      )
    ) {
      return;
    }
    try {
      await deleteResponsavel(responsible.id);
      setNotice(`${responsible.name} foi removido da obra.`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Erro ao remover");
    }
  }

  return (
    <AppShell
      title="Responsáveis pelas Obras"
      subtitle="Cadastre e vincule um responsável principal para cada obra."
      action={
        <button
          type="button"
          onClick={openNewResponsible}
          className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-foundation px-4 text-sm font-black text-white transition hover:bg-moss"
        >
          <Plus size={18} />
          Novo Responsável
        </button>
      }
    >
      {notice ? (
        <div className="mb-4 flex items-center gap-2 rounded-[8px] bg-[#EAF4EF] px-4 py-3 text-sm font-bold text-moss">
          <CheckCircle2 size={18} className="shrink-0" />
          {notice}
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label={`Plano ${limits.label}`}
          value={`${limits.responsavelLimit} responsáveis permitidos`}
          helper="1 responsável por obra"
        />
        <Metric
          label="Responsáveis cadastrados"
          value={`${responsibles.length}/${limits.responsavelLimit}`}
          helper="Principais e ativos"
        />
        <Metric
          label="Obras com responsável"
          value={`${responsibles.length}/${obras.length}`}
          helper={`${responsibles.length} de ${obras.length} obras possuem responsável`}
        />
        <Metric
          label="Vagas disponíveis"
          value={String(availableSlots)}
          helper="No plano atual"
        />
      </section>

      <section className="mt-4">
        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users size={21} className="text-build" />
                <h2 className="text-xl font-black text-foundation">
                  Responsáveis cadastrados
                </h2>
              </div>
              <p className="mt-2 text-sm font-semibold text-graphite/60">
                Cada obra possui apenas um responsável principal.
              </p>
            </div>
            <p className="text-xs font-bold text-graphite/50">
              Gratuito: 1 · Mensal: 3 · Premium: 10
            </p>
          </div>

          <div className="mt-5 hidden overflow-x-auto lg:block">
            <table className="w-full border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-xs font-black uppercase text-graphite/48">
                  <th className="px-3 pb-1">Responsável</th>
                  <th className="px-3 pb-1">Função</th>
                  <th className="px-3 pb-1">Obra vinculada</th>
                  <th className="px-3 pb-1">WhatsApp</th>
                  <th className="px-3 pb-1">Status</th>
                  <th className="px-3 pb-1 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {responsibles.map((responsible) => (
                  <tr key={responsible.id} className="bg-concrete">
                    <td className="rounded-l-[8px] px-3 py-3">
                      <ResponsibleIdentity responsible={responsible} />
                    </td>
                    <td className="px-3 py-3 text-sm font-bold text-foundation">
                      {responsible.role}
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-graphite/70">
                      {responsible.project}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foundation">
                        <WhatsAppIcon size={17} />
                        {responsible.whatsapp}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={responsible.status} />
                    </td>
                    <td className="rounded-r-[8px] px-3 py-3">
                      <Actions
                        onEdit={() => openEditResponsible(responsible)}
                        onRemove={() => removeResponsible(responsible)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 lg:hidden">
            {responsibles.map((responsible) => (
              <article
                key={responsible.id}
                className="rounded-[8px] bg-concrete p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <ResponsibleIdentity responsible={responsible} />
                  <StatusBadge status={responsible.status} />
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  <MobileDetail
                    icon={<BriefcaseBusiness size={15} />}
                    label={responsible.role}
                  />
                  <MobileDetail
                    icon={<Building2 size={15} />}
                    label={responsible.project}
                  />
                  <MobileDetail
                    icon={<WhatsAppIcon size={15} />}
                    label={responsible.whatsapp}
                  />
                </div>
                <div className="mt-3 border-t border-black/5 pt-3">
                  <Actions
                    onEdit={() => openEditResponsible(responsible)}
                    onRemove={() => removeResponsible(responsible)}
                  />
                </div>
              </article>
            ))}
          </div>

          {responsibles.length === 0 ? (
            <div className="mt-5 rounded-[8px] bg-concrete p-6 text-center">
              <UserRound size={28} className="mx-auto text-build" />
              <h3 className="mt-3 font-black text-foundation">
                Nenhum responsável cadastrado
              </h3>
              <p className="mt-1 text-sm font-semibold text-graphite/60">
                Adicione o responsável principal da sua primeira obra.
              </p>
            </div>
          ) : null}
        </Card>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 px-3 py-6">
          <form
            onSubmit={saveResponsible}
            className="w-full max-w-2xl rounded-[8px] bg-white p-4 shadow-soft sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-build">
                  {editingResponsible ? "Editar cadastro" : "Novo cadastro"}
                </p>
                <h2 className="mt-1 text-2xl font-black text-foundation">
                  {editingResponsible
                    ? editingResponsible.name
                    : "Novo Responsável"}
                </h2>
                <p className="mt-2 text-sm font-semibold text-graphite/60">
                  Vincule uma pessoa como responsável principal de uma obra.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-concrete text-foundation"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField
                label="Nome"
                value={form.name}
                onChange={(value) => updateForm("name", value)}
                placeholder="Carlos Mendes"
              />
              <FormField
                label="Telefone"
                value={form.phone}
                onChange={(value) => updateForm("phone", value)}
                placeholder="(11) 99999-9999"
                icon={<Phone size={17} />}
              />
              <FormField
                label="WhatsApp"
                value={form.whatsapp}
                onChange={(value) => updateForm("whatsapp", value)}
                placeholder="(11) 99999-9999"
                icon={<WhatsAppIcon size={18} />}
              />
              <FormField
                label="Email"
                value={form.email}
                onChange={(value) => updateForm("email", value)}
                placeholder="responsavel@email.com"
                type="email"
                icon={<Mail size={17} />}
              />
              <FormField
                label="Função"
                value={form.role}
                onChange={(value) => updateForm("role", value)}
                placeholder="Mestre de Obras"
              />
              <label className="block">
                <span className="text-sm font-black text-foundation">
                  Obra vinculada
                </span>
                <select
                  value={form.projectId}
                  onChange={(event) => updateForm("projectId", event.target.value)}
                  className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm font-semibold outline-none focus:border-build"
                >
                  <option value="">Selecione uma obra</option>
                  {availableProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                  {editingId && editingResponsible ? (
                    <option value={editingResponsible.projectId}>
                      {editingResponsible.project}
                    </option>
                  ) : null}
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                className="h-12 rounded-[8px] bg-foundation px-4 text-sm font-black text-white"
              >
                {editingResponsible
                  ? "Salvar alterações"
                  : "Adicionar responsável"}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-12 rounded-[8px] border border-black/10 bg-white px-4 text-sm font-black text-foundation"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AppShell>
  );
}

function ResponsibleIdentity({
  responsible
}: {
  responsible: ResponsavelView;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foundation text-xs font-black text-white">
        {responsible.name
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-foundation">
          {responsible.name}
        </p>
        <p className="mt-0.5 truncate text-xs font-semibold text-graphite/55">
          {responsible.email}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ResponsavelView["status"] }) {
  const active = status === "Ativo";
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-xs font-black ${
        active
          ? "bg-[#EAF4EF] text-moss"
          : "bg-[#FFF4EA] text-build"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? "bg-moss" : "bg-build"
        }`}
      />
      {status}
    </span>
  );
}

function Actions({
  onEdit,
  onRemove
}: {
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] bg-white px-3 text-xs font-black text-foundation"
      >
        <Edit3 size={15} className="text-build" />
        Editar
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="grid h-9 w-9 place-items-center rounded-[8px] bg-white text-red-600"
        title="Remover responsável"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function MobileDetail({
  icon,
  label
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2 font-semibold text-graphite/68">
      <span className="shrink-0 text-build">{icon}</span>
      {label}
    </span>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-foundation">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-2 rounded-[8px] border border-black/10 bg-white px-3 focus-within:border-build">
        {icon ? <span className="shrink-0 text-build">{icon}</span> : null}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold outline-none placeholder:text-graphite/38"
        />
      </span>
    </label>
  );
}
