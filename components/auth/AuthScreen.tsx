"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Brand } from "@/components/Brand";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { formatPhoneBRDisplay } from "@/lib/auth/normalize-phone";
import { isSignupEnabled } from "@/lib/auth/signup-enabled";
import { resolvePostLoginRedirect } from "@/lib/auth/post-login-path";
import { createClient } from "@/lib/supabase/client";

type AuthTab = "entrar" | "cadastro";

const SALES_PAGE_URL =
  process.env.NEXT_PUBLIC_SALES_PAGE_URL ?? "https://obrioai.app";

const signupEnabled = isSignupEnabled();

function resolveInitialTab(searchParams: URLSearchParams): AuthTab {
  if (!signupEnabled) return "entrar";

  const mode = searchParams.get("mode");
  const token = searchParams.get("token");
  if (mode === "cadastro" || token) return "cadastro";
  if (searchParams.get("cadastro") === "ok") return "entrar";
  return "entrar";
}

export default function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [tab, setTab] = useState<AuthTab>(() => resolveInitialTab(searchParams));

  const [loginEmail, setLoginEmail] = useState(
    searchParams.get("cadastro") === "ok"
      ? (searchParams.get("email") ?? "")
      : ""
  );
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(
    searchParams.get("error") === "auth_callback_failed"
      ? "Não foi possível confirmar o login. Tente novamente."
      : null
  );
  const [signupSuccess, setSignupSuccess] = useState(
    searchParams.get("cadastro") === "ok"
  );

  const [signupEmail, setSignupEmail] = useState(searchParams.get("email") ?? "");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupWhatsapp, setSignupWhatsapp] = useState("");
  const [signupToken, setSignupToken] = useState(searchParams.get("token") ?? "");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [inviteReason, setInviteReason] = useState<string | null>(null);
  const [emailLocked, setEmailLocked] = useState(false);

  const validateInvite = useCallback(async () => {
    const email = signupEmail.trim().toLowerCase();
    const token = signupToken;

    if (!token) {
      try {
        const response = await fetch("/api/auth/validate-invite");
        const data = (await response.json()) as {
          ok: boolean;
          open?: boolean;
          reason?: string;
        };
        if (data.ok && data.open) {
          setInviteValid(true);
          setInviteReason(null);
          setEmailLocked(false);
          return;
        }
      } catch {
        // fall through
      }

      if (!email) {
        setInviteValid(false);
        setInviteReason("Use o link enviado após a compra para criar sua conta.");
        return;
      }

      setInviteValid(false);
      setInviteReason("Use o link enviado após a compra para criar sua conta.");
      return;
    }

    if (!email) {
      setInviteValid(null);
      return;
    }

    try {
      const params = new URLSearchParams({ email, token });
      const response = await fetch(`/api/auth/validate-invite?${params}`);
      const data = (await response.json()) as {
        ok: boolean;
        reason?: string;
        open?: boolean;
      };

      if (data.ok) {
        setInviteValid(true);
        setInviteReason(null);
        setEmailLocked(!data.open);
      } else {
        setInviteValid(false);
        setInviteReason(data.reason ?? "Link inválido ou expirado.");
      }
    } catch {
      setInviteValid(false);
      setInviteReason("Não foi possível validar o link. Tente novamente.");
    }
  }, [signupEmail, signupToken]);

  useEffect(() => {
    if (tab === "cadastro") {
      void validateInvite();
    }
  }, [tab, validateInvite]);

  useEffect(() => {
    if (!signupEnabled) {
      setTab("entrar");
      return;
    }

    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");
    if (emailParam) setSignupEmail(emailParam);
    if (tokenParam) setSignupToken(tokenParam);
    if (searchParams.get("mode") === "cadastro" || tokenParam) {
      setTab("cadastro");
    }
    if (searchParams.get("cadastro") === "ok") {
      setTab("entrar");
      setSignupSuccess(true);
      if (emailParam) setLoginEmail(emailParam);
    }
  }, [searchParams]);

  function switchTab(next: AuthTab) {
    setTab(next);
    setLoginError(null);
    setSignupError(null);
    if (next === "entrar") setSignupSuccess(false);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    setSignupSuccess(false);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });

      if (signInError) {
        setLoginError(signInError.message);
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setLoginError("Não foi possível confirmar a sessão. Tente novamente.");
        return;
      }

      const destination = await resolvePostLoginRedirect(
        supabase,
        user.id,
        redirectParam
      );

      router.push(destination);
      router.refresh();
    } catch {
      setLoginError("Configure as variáveis do Supabase em .env.local");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupLoading(true);
    setSignupError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail.trim().toLowerCase(),
          password: signupPassword,
          whatsapp: signupWhatsapp,
          token: signupToken || undefined
        })
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        setSignupError(data.error ?? "Não foi possível criar a conta.");
        return;
      }

      const createdEmail = signupEmail.trim().toLowerCase();
      setLoginEmail(createdEmail);
      setLoginPassword("");
      setSignupPassword("");
      setSignupWhatsapp("");
      setSignupSuccess(true);
      setTab("entrar");

      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("cadastro", "ok");
      nextUrl.searchParams.set("email", createdEmail);
      nextUrl.searchParams.delete("mode");
      nextUrl.searchParams.delete("token");
      router.replace(`${nextUrl.pathname}?${nextUrl.searchParams.toString()}`);
    } catch {
      setSignupError("Erro de conexão. Tente novamente.");
    } finally {
      setSignupLoading(false);
    }
  }

  const canSubmitSignup = inviteValid === true;

  return (
    <main className="min-h-screen bg-concrete px-4 py-6 text-graphite">
      <div className="mx-auto flex min-h-[calc(100svh-48px)] max-w-5xl flex-col">
        <header className="flex items-center justify-between">
          <Brand />
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden lg:block">
            {tab === "cadastro" ? (
              <>
                <p className="text-sm font-black uppercase text-build">Criar conta</p>
                <h1 className="mt-3 text-4xl font-black leading-tight tracking-normal text-foundation">
                  Crie sua conta e comece sua primeira obra
                </h1>
                <p className="mt-4 max-w-md leading-7 text-graphite/70">
                  Email, senha e WhatsApp serão usados para login, avisos da obra,
                  lembretes e mensagens futuras via WhatsApp.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-black uppercase text-build">Obrio AI</p>
                <h1 className="mt-3 text-4xl font-black leading-tight tracking-normal text-foundation">
                  Bem-vindo ao Obrio AI
                </h1>
                <p className="mt-4 max-w-md text-xl font-black leading-7 text-foundation">
                  Acesse suas obras e reformas em poucos segundos
                </p>
                <p className="mt-4 max-w-md leading-7 text-graphite/70">
                  Gastos, equipe, fotos, documentos, lembretes e clima organizados
                  em um único lugar.
                </p>
              </>
            )}
          </div>

          <div className="mx-auto w-full max-w-md rounded-[8px] bg-white p-5 shadow-soft md:p-7">
            {signupEnabled ? (
              <div className="flex gap-2 rounded-[8px] bg-concrete p-1">
                <button
                  type="button"
                  onClick={() => switchTab("entrar")}
                  className={`flex-1 rounded-[6px] py-3 text-sm font-black transition-colors ${
                    tab === "entrar"
                      ? "bg-white text-foundation shadow-sm"
                      : "text-graphite/58"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => switchTab("cadastro")}
                  className={`flex-1 rounded-[6px] py-3 text-sm font-black transition-colors ${
                    tab === "cadastro"
                      ? "bg-white text-foundation shadow-sm"
                      : "text-graphite/58"
                  }`}
                >
                  Criar conta
                </button>
              </div>
            ) : null}

            {tab === "entrar" ? (
              <form onSubmit={handleLogin} className={signupEnabled ? "mt-6" : ""}>
                {!signupEnabled ? (
                  <>
                    <p className="text-xs font-black uppercase text-build lg:hidden">
                      Obrio AI
                    </p>
                    <h1 className="mt-2 text-3xl font-black leading-tight tracking-normal text-foundation lg:hidden">
                      Bem-vindo ao Obrio AI
                    </h1>
                    <p className="mt-3 text-base font-black leading-6 text-foundation lg:hidden">
                      Acesse suas obras e reformas em poucos segundos
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-graphite/58 lg:hidden">
                      Gastos, equipe, fotos, documentos, lembretes e clima organizados
                      em um único lugar.
                    </p>
                    <div className="mt-6 border-t border-black/10 pt-6 lg:border-0 lg:pt-0">
                      <h2 className="text-2xl font-black tracking-normal text-foundation">
                        Entrar
                      </h2>
                      <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                        Digite seu email e senha para acessar.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-black tracking-normal text-foundation">
                      Entrar
                    </h2>
                    <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                      Digite seu email e senha para acessar.
                    </p>
                  </>
                )}

                {signupSuccess ? (
                  <p className="mt-4 rounded-[8px] bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">
                    Conta criada com sucesso! Faça login com o email e a senha que
                    você escolheu.
                  </p>
                ) : null}

                {loginError ? (
                  <p className="mt-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                    {loginError}
                  </p>
                ) : null}

                <label className="mt-6 block">
                  <span className="text-sm font-black text-graphite/76">Email</span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <Mail size={19} className="text-build" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                      placeholder="voce@email.com"
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-black text-graphite/76">Senha</span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <LockKeyhole size={19} className="text-build" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      placeholder="Sua senha"
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
                >
                  {loginLoading ? "Entrando..." : "Entrar no Obrio AI"}
                  <ArrowRight size={20} />
                </button>
              </form>
            ) : signupEnabled ? (
              <form onSubmit={handleSignup} className="mt-6">
                <h2 className="text-2xl font-black tracking-normal text-foundation">
                  Criar conta
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                  Preencha email, senha e WhatsApp para criar sua conta.
                </p>

                {inviteValid === false ? (
                  <div className="mt-4 rounded-[8px] bg-amber-50 px-3 py-3 text-sm font-semibold text-amber-900">
                    <p>{inviteReason ?? "Use o link enviado após a compra."}</p>
                    <a
                      href={SALES_PAGE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-black text-foundation underline"
                    >
                      Ir para a página de vendas
                    </a>
                  </div>
                ) : null}

                {signupError ? (
                  <p className="mt-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                    {signupError}
                  </p>
                ) : null}

                <label className="mt-6 block">
                  <span className="text-sm font-black text-graphite/76">Email</span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <Mail size={19} className="text-build" />
                    <input
                      type="email"
                      required
                      readOnly={emailLocked}
                      value={signupEmail}
                      onChange={(event) => setSignupEmail(event.target.value)}
                      placeholder="voce@email.com"
                      className={`w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38 ${
                        emailLocked ? "text-graphite/62" : ""
                      }`}
                    />
                  </span>
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-black text-graphite/76">Senha</span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <LockKeyhole size={19} className="text-build" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={signupPassword}
                      onChange={(event) => setSignupPassword(event.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-black text-graphite/76">WhatsApp</span>
                  <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                    <WhatsAppIcon size={22} />
                    <input
                      type="tel"
                      required
                      value={signupWhatsapp}
                      onChange={(event) =>
                        setSignupWhatsapp(formatPhoneBRDisplay(event.target.value))
                      }
                      placeholder="(11) 99999-9999"
                      className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                    />
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={signupLoading || !canSubmitSignup}
                  className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-build px-5 text-base font-black text-white disabled:opacity-60"
                >
                  {signupLoading ? "Criando conta..." : "Criar minha conta"}
                  <ArrowRight size={20} />
                </button>

                <p className="mt-4 text-sm font-semibold leading-6 text-graphite/62">
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("entrar")}
                    className="font-black text-foundation underline"
                  >
                    Faça login
                  </button>
                </p>
              </form>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
