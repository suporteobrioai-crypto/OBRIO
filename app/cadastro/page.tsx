"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { createClient } from "@/lib/supabase/client";

type SignupStep = "email" | "code" | "password" | "whatsapp" | "done";

export default function CadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps: SignupStep[] = ["email", "code", "password", "whatsapp"];
  const activeStepIndex =
    step === "done" ? steps.length - 1 : steps.indexOf(step);

  async function sendCode() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true }
      });
      if (otpError) {
        setError(otpError.message);
        return;
      }
      setStep("code");
    } catch {
      setError("Configure as variáveis do Supabase em .env.local");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email"
      });
      if (verifyError) {
        setError(verifyError.message);
        return;
      }
      setStep("password");
    } catch {
      setError("Configure as variáveis do Supabase em .env.local");
    } finally {
      setLoading(false);
    }
  }

  async function setPasswordAndContinue() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password
      });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setStep("whatsapp");
    } catch {
      setError("Configure as variáveis do Supabase em .env.local");
    } finally {
      setLoading(false);
    }
  }

  async function finishSignup() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ whatsapp })
          .eq("id", user.id);

        if (profileError) {
          setError(profileError.message);
          return;
        }
      }

      setStep("done");
      router.refresh();
    } catch {
      setError("Configure as variáveis do Supabase em .env.local");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-concrete px-4 py-6 text-graphite">
      <div className="mx-auto flex min-h-[calc(100svh-48px)] max-w-5xl flex-col">
        <header className="flex items-center justify-between">
          <Brand />
          <Link href="/login" className="text-sm font-black text-foundation">
            Entrar
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden lg:block">
            <p className="text-sm font-black uppercase text-build">
              Criar conta
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-normal text-foundation">
              Primeiro confirme seu email, depois criamos sua primeira obra.
            </h1>
            <p className="mt-4 max-w-md leading-7 text-graphite/70">
              Email, senha e WhatsApp serão usados para login, avisos da obra,
              lembretes e mensagens futuras via WhatsApp.
            </p>
          </div>

          <form
            className="mx-auto w-full max-w-md rounded-[8px] bg-white p-5 shadow-soft md:p-7"
            onSubmit={(event) => event.preventDefault()}
          >
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

            {error ? (
              <p className="mb-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            {step === "email" ? (
              <>
                <p className="text-xs font-black uppercase text-build lg:hidden">
                  Criar conta
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-normal text-foundation">
                  Criar conta
                </h2>
                <p className="mt-3 text-base font-black leading-6 text-foundation">
                  Primeiro confirme seu email, depois criamos sua primeira obra.
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                  Digite seu email para receber um código de confirmação.
                </p>
                <label className="mt-6 block">
                  <span className="text-sm font-black text-graphite/76">
                    Email
                  </span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <Mail size={19} className="text-build" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="voce@email.com"
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>
                <button
                  type="button"
                  disabled={loading || !email}
                  onClick={sendCode}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
                >
                  {loading ? "Enviando..." : "Enviar código"}
                  <ArrowRight size={20} />
                </button>
              </>
            ) : null}

            {step === "code" ? (
              <>
                <h2 className="text-3xl font-black tracking-normal text-foundation">
                  Confirmar email
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                  Enviamos um código para{" "}
                  <strong className="text-foundation">
                    {email || "seu email"}
                  </strong>
                  . Digite o código abaixo.
                </p>
                <label className="mt-6 block">
                  <span className="text-sm font-black text-graphite/76">
                    Código
                  </span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <ShieldCheck size={19} className="text-build" />
                    <input
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full border-0 bg-transparent text-base font-semibold tracking-[0.2em] outline-none placeholder:text-graphite/28"
                    />
                  </span>
                </label>
                <button
                  type="button"
                  disabled={loading || code.length < 6}
                  onClick={verifyCode}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
                >
                  {loading ? "Validando..." : "Validar código"}
                  <ArrowRight size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="mt-3 h-12 w-full rounded-[8px] border border-black/10 text-sm font-black text-foundation"
                >
                  Alterar email
                </button>
              </>
            ) : null}

            {step === "password" ? (
              <>
                <h2 className="text-3xl font-black tracking-normal text-foundation">
                  Definir senha
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                  Crie uma senha para proteger sua conta antes de cadastrar a
                  primeira obra.
                </p>
                <label className="mt-6 block">
                  <span className="text-sm font-black text-graphite/76">
                    Senha
                  </span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <LockKeyhole size={19} className="text-build" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Crie sua senha"
                      minLength={6}
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>
                <button
                  type="button"
                  disabled={loading || password.length < 6}
                  onClick={setPasswordAndContinue}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
                >
                  {loading ? "Salvando..." : "Continuar"}
                  <ArrowRight size={20} />
                </button>
              </>
            ) : null}

            {step === "whatsapp" ? (
              <>
                <h2 className="text-3xl font-black tracking-normal text-foundation">
                  WhatsApp
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                  Este número receberá lembretes, previsão diária da obra e
                  mensagens futuras do Obrio AI.
                </p>
                <label className="mt-6 block">
                  <span className="text-sm font-black text-graphite/76">
                    Número do WhatsApp
                  </span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <WhatsAppIcon size={22} />
                    <input
                      value={whatsapp}
                      onChange={(event) => setWhatsapp(event.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>
                <button
                  type="button"
                  disabled={loading}
                  onClick={finishSignup}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
                >
                  {loading ? "Criando conta..." : "Criar conta"}
                  <ArrowRight size={20} />
                </button>
              </>
            ) : null}

            {step === "done" ? (
              <>
                <div className="grid h-16 w-16 place-items-center rounded-[8px] bg-[#EAF4EF] text-moss">
                  <CheckCircle2 size={34} />
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-normal text-foundation">
                  Conta criada com sucesso
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                  Agora vamos colocar as mãos na massa e criar sua primeira obra
                  ou reforma.
                </p>
                <Link
                  href="/obras/nova"
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white"
                >
                  Começar
                  <ArrowRight size={20} />
                </Link>
              </>
            ) : null}

            {step !== "done" ? (
              <div className="mt-5 rounded-[8px] bg-concrete p-5 text-foundation">
                <p className="text-lg font-black leading-6">Já tem conta?</p>
                <Link
                  href="/login"
                  className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-build px-5 text-base font-black text-white"
                >
                  Clique Aqui
                  <ArrowRight size={22} />
                </Link>
              </div>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
