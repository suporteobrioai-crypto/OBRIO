"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  UserCircle
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  formatPhoneBRDisplay,
  isValidPhoneBR,
  normalizePhoneBR
} from "@/lib/auth/normalize-phone";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { getInitials } from "@/lib/obras";
import { createClient } from "@/lib/supabase/client";
import { buildAvatarPath } from "@/lib/storage";

type OnboardingStep = "name" | "whatsapp" | "avatar";

const steps: OnboardingStep[] = ["name", "whatsapp", "avatar"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();

  const [step, setStep] = useState<OnboardingStep>("name");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeStepIndex = steps.indexOf(step);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setWhatsapp(
        profile.whatsapp ? formatPhoneBRDisplay(profile.whatsapp) : ""
      );
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  function handleAvatarSelect(file?: File) {
    if (!file) return;
    if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function finishOnboarding(includeAvatar: boolean) {
    if (!user) return;

    if (!fullName.trim()) {
      setError("Informe seu nome completo.");
      setStep("name");
      return;
    }

    if (!isValidPhoneBR(whatsapp)) {
      setError("Informe um WhatsApp válido com DDD.");
      setStep("whatsapp");
      return;
    }

    const normalizedWhatsapp = normalizePhoneBR(whatsapp);
    if (!normalizedWhatsapp) {
      setError("WhatsApp inválido.");
      setStep("whatsapp");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let avatarPath: string | null = null;

      if (includeAvatar && avatarFile) {
        const supabase = createClient();
        avatarPath = buildAvatarPath(user.id, avatarFile.name);
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(avatarPath, avatarFile, { upsert: true });
        if (uploadError) throw new Error(uploadError.message);
      }

      await updateProfile({
        full_name: fullName.trim(),
        whatsapp: normalizedWhatsapp,
        ...(avatarPath ? { avatar_path: avatarPath } : {})
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível salvar seu perfil."
      );
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || profileLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-concrete text-graphite">
        <p className="text-sm font-semibold text-graphite/60">Carregando…</p>
      </main>
    );
  }

  const initials = getInitials(fullName, user?.email);

  return (
    <main className="min-h-screen bg-concrete px-4 py-6 text-graphite">
      <div className="mx-auto flex min-h-[calc(100svh-48px)] max-w-5xl flex-col">
        <header className="flex items-center justify-between">
          <Brand />
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden lg:block">
            <p className="text-sm font-black uppercase text-build">Seu perfil</p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-normal text-foundation">
              Complete seu perfil para começar
            </h1>
            <p className="mt-4 max-w-md leading-7 text-graphite/70">
              Nome e WhatsApp serão usados para login, avisos da obra, lembretes
              e mensagens futuras. Depois você explora tudo no dashboard.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md rounded-[8px] bg-white p-5 shadow-soft md:p-7">
            <div className="mb-6 flex gap-2">
              {steps.map((item, index) => (
                <span
                  key={item}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= activeStepIndex ? "bg-build" : "bg-concrete"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs font-black uppercase text-build lg:hidden">
              Seu perfil
            </p>
            <h1 className="mt-2 text-2xl font-black text-foundation lg:hidden">
              Complete seu perfil
            </h1>

            {error ? (
              <p className="mt-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            {step === "name" ? (
              <div className="mt-6">
                <h2 className="text-xl font-black text-foundation">Seu nome</h2>
                <p className="mt-2 text-sm font-semibold text-graphite/58">
                  Como devemos te chamar no Obrio AI?
                </p>
                <label className="mt-6 block">
                  <span className="text-sm font-black text-graphite/76">
                    Nome completo
                  </span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <UserCircle size={20} className="text-build" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Seu nome"
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>
                <button
                  type="button"
                  disabled={!fullName.trim()}
                  onClick={() => {
                    setError(null);
                    setStep("whatsapp");
                  }}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
                >
                  Continuar
                  <ArrowRight size={20} />
                </button>
              </div>
            ) : null}

            {step === "whatsapp" ? (
              <div className="mt-6">
                <h2 className="text-xl font-black text-foundation">WhatsApp</h2>
                <p className="mt-2 text-sm font-semibold text-graphite/58">
                  Usado para avisos da obra e lembretes importantes.
                </p>
                <label className="mt-6 block">
                  <span className="text-sm font-black text-graphite/76">
                    WhatsApp
                  </span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <WhatsAppIcon size={22} />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(event) =>
                        setWhatsapp(formatPhoneBRDisplay(event.target.value))
                      }
                      placeholder="(11) 99999-9999"
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("name")}
                    className="inline-flex h-14 flex-1 items-center justify-center rounded-[8px] border border-black/10 text-sm font-black text-foundation"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    disabled={!isValidPhoneBR(whatsapp)}
                    onClick={() => {
                      setError(null);
                      setStep("avatar");
                    }}
                    className="inline-flex h-14 flex-[2] items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
                  >
                    Continuar
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ) : null}

            {step === "avatar" ? (
              <div className="mt-6">
                <h2 className="text-xl font-black text-foundation">
                  Foto de perfil
                </h2>
                <p className="mt-2 text-sm font-semibold text-graphite/58">
                  Opcional — você pode adicionar depois em Perfil.
                </p>

                <div className="mt-6 flex flex-col items-center gap-4">
                  <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-concrete text-2xl font-black text-foundation">
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarPreview}
                        alt="Prévia da foto"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </span>

                  <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-black/10 px-4 text-sm font-black text-foundation">
                    <Camera size={18} />
                    Adicionar foto
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) =>
                        handleAvatarSelect(event.target.files?.[0])
                      }
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void finishOnboarding(Boolean(avatarFile))}
                    className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
                  >
                    {loading ? "Salvando…" : "Concluir e ir ao dashboard"}
                    <CheckCircle2 size={20} />
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void finishOnboarding(false)}
                    className="inline-flex h-14 w-full items-center justify-center rounded-[8px] bg-concrete text-sm font-black text-foundation disabled:opacity-60"
                  >
                    Pular foto e continuar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("whatsapp")}
                    className="text-sm font-semibold text-graphite/58 underline"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
