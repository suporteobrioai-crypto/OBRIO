"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  CreditCard,
  KeyRound,
  LogOut,
  Save,
  ShieldCheck,
  Trash2,
  UserCircle,
  Users
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Card } from "@/components/Ui";

export default function PerfilPage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  function handleAvatar(file?: File) {
    if (!file) return;
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(URL.createObjectURL(file));
    setNotice("Nova foto selecionada. Salve o perfil para confirmar.");
  }

  function removeAvatar() {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(null);
    setNotice("Foto removida. As iniciais serão usadas no perfil.");
  }

  return (
    <AppShell
      title="Meu Perfil"
      subtitle="Dados pessoais, contato, empresa, plano e segurança da sua conta."
      action={
        <button
          type="button"
          onClick={() => setNotice("Perfil salvo com sucesso.")}
          className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-foundation px-4 text-sm font-black text-white transition hover:bg-moss sm:min-h-11"
        >
          <Save size={18} />
          Salvar perfil
        </button>
      }
    >
      {notice ? (
        <div className="mb-4 flex items-center gap-2 rounded-[8px] bg-[#EAF4EF] px-4 py-3 text-sm font-bold text-moss">
          <CheckCircle2 size={18} className="shrink-0" />
          {notice}
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <div className="grid content-start gap-4">
          <Card>
            <h2 className="text-xl font-black text-foundation">Foto de perfil</h2>
            <div className="mt-5 flex flex-col items-center text-center">
              <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-foundation text-2xl font-black text-white">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de Orlando Montes"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "OM"
                )}
              </span>
              <h3 className="mt-4 text-lg font-black text-foundation">
                Orlando Montes
              </h3>
              <p className="mt-1 text-sm font-bold text-graphite/60">
                Plano Premium
              </p>
              <p className="mt-1 text-xs font-semibold text-graphite/50">
                Membro desde junho de 2026
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-concrete px-3 text-sm font-black text-foundation">
                  <Camera size={17} className="text-build" />
                  {avatarUrl ? "Trocar foto" : "Upload foto"}
                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleAvatar(event.target.files?.[0])}
                  />
                </label>
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-red-200 bg-white px-3 text-sm font-bold text-red-600"
                >
                  <Trash2 size={16} />
                  Remover foto
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <CreditCard className="text-build" size={23} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase text-graphite/50">
                  Plano atual
                </p>
                <h2 className="mt-1 text-xl font-black text-foundation">
                  Plano Premium
                </h2>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] bg-[#EAF4EF] px-2.5 py-1.5 text-xs font-black text-moss">
                <span className="h-2 w-2 rounded-full bg-moss" />
                Assinatura ativa
              </span>
            </div>

            <div className="mt-4 grid gap-2">
              <PlanDetail
                icon={<Building2 size={16} />}
                label="Obras cadastradas"
                value="4 de 10"
              />
              <PlanDetail
                icon={<Users size={16} />}
                label="Usuários da equipe"
                value="8"
              />
              <PlanDetail
                icon={<CalendarDays size={16} />}
                label="Próxima cobrança"
                value="15/08/2026"
              />
            </div>

            <Link
              href="/assinatura"
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-[8px] bg-foundation px-4 text-sm font-black text-white"
            >
              Gerenciar assinatura
            </Link>
          </Card>
        </div>

        <Card>
          <div className="flex items-center gap-3">
            <UserCircle className="text-build" size={24} />
            <h2 className="text-xl font-black text-foundation">Dados da conta</h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ProfileField label="Nome" defaultValue="Orlando Montes" />
            <ProfileField
              label="Email"
              defaultValue="orlando@email.com"
              type="email"
            />
            <ProfileField label="Telefone" defaultValue="(11) 99999-9999" />
            <ProfileField
              label="WhatsApp"
              defaultValue="(11) 99999-9999"
              icon={<WhatsAppIcon size={19} />}
              helper="Usado para lembretes e mensagens do Obrio AI."
            />
            <ProfileField
              label="Empresa (opcional)"
              placeholder="Nome da empresa"
              className="md:col-span-2"
            />
            <ProfileField
              label="CNPJ (opcional)"
              placeholder="00.000.000/0001-00"
              className="md:col-span-2"
            />
          </div>

          <div className="mt-6 border-t border-black/5 pt-5">
            <h3 className="text-base font-black text-foundation">
              Notificações do Obrio AI
            </h3>
            <p className="mt-1 text-sm font-semibold text-graphite/55">
              Escolha quais avisos deseja receber sobre suas obras.
            </p>
            <div className="mt-3 grid gap-2">
              {[
                "Receber lembretes por WhatsApp",
                "Receber alertas de vencimento",
                "Receber resumo semanal"
              ].map((notification) => (
                <label
                  key={notification}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] bg-concrete px-3 py-2.5"
                >
                  <span className="text-sm font-bold text-foundation">
                    {notification}
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 shrink-0 accent-[#0E332A]"
                  />
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <KeyRound className="text-build" size={24} />
              <div>
                <h2 className="text-xl font-black text-foundation">
                  Segurança da conta
                </h2>
                <p className="mt-1 text-sm font-semibold text-graphite/60">
                  Última alteração de senha: 05/06/2026
                </p>
                <p className="mt-1 text-sm font-semibold text-graphite/60">
                  Último login: hoje às 14:32
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#EAF4EF] px-3 py-2 text-xs font-black text-moss">
              <ShieldCheck size={16} />
              Conta protegida
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <ProfileField
              label="Senha atual"
              placeholder="Digite sua senha atual"
              type="password"
            />
            <ProfileField
              label="Nova senha"
              placeholder="Digite a nova senha"
              type="password"
            />
            <ProfileField
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              type="password"
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-black text-foundation">
                Sessões em outros dispositivos
              </h3>
              <p className="mt-1 text-xs font-semibold text-graphite/55">
                Encerre acessos em celulares ou computadores que você não utiliza mais.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setNotice("As sessões em outros dispositivos foram encerradas.")
              }
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[8px] border border-black/10 bg-white px-4 text-sm font-bold text-foundation"
            >
              <LogOut size={17} className="text-build" />
              Encerrar outras sessões
            </button>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}

function ProfileField({
  label,
  placeholder,
  defaultValue,
  type = "text",
  icon,
  helper,
  className = ""
}: {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  icon?: React.ReactNode;
  helper?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-black text-foundation">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-2 rounded-[8px] border border-black/10 bg-white px-3 focus-within:border-build">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <input
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-graphite/38"
        />
      </span>
      {helper ? (
        <span className="mt-1.5 block text-xs font-semibold text-graphite/50">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function PlanDetail({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[8px] bg-concrete px-3 py-2.5">
      <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-graphite/65">
        <span className="shrink-0 text-build">{icon}</span>
        {label}
      </span>
      <strong className="shrink-0 text-sm font-black text-foundation">{value}</strong>
    </div>
  );
}
