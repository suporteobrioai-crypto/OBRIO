"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Brand } from "@/components/Brand";
import { resolvePostLoginRedirect } from "@/lib/auth/post-login-path";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_callback_failed"
      ? "Não foi possível confirmar o login. Tente novamente."
      : null
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Não foi possível confirmar a sessão. Tente novamente.");
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
          <Link href="/cadastro" className="text-sm font-black text-foundation">
            Criar conta
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden lg:block">
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
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-md rounded-[8px] bg-white p-5 shadow-soft md:p-7"
          >
            <p className="text-xs font-black uppercase text-build lg:hidden">
              Obrio AI
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-normal text-foundation">
              Bem-vindo ao Obrio AI
            </h1>
            <p className="mt-3 text-base font-black leading-6 text-foundation">
              Acesse suas obras e reformas em poucos segundos
            </p>
            <p className="mt-3 text-sm font-semibold leading-6 text-graphite/58">
              Gastos, equipe, fotos, documentos, lembretes e clima organizados
              em um único lugar.
            </p>

            <div className="mt-6 border-t border-black/10 pt-6">
              <h2 className="text-2xl font-black tracking-normal text-foundation">
                Entrar
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                Se já tem conta, digite seu email e senha para acessar.
              </p>
            </div>

            {error ? (
              <p className="mt-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            <label className="mt-6 block">
              <span className="text-sm font-black text-graphite/76">Email</span>
              <span className="mt-2 flex h-14 items-center gap-3 rounded-[8px] border border-black/10 px-3">
                <Mail size={19} className="text-build" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Sua senha"
                  className="w-full border-0 bg-transparent text-base font-semibold outline-none placeholder:text-graphite/38"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation px-5 text-base font-black text-white disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar no Obrio AI"}
              <ArrowRight size={20} />
            </button>

            <div className="mt-5 rounded-[8px] bg-concrete p-5 text-foundation">
              <p className="text-lg font-black leading-6">
                Não possui uma conta?
              </p>
              <Link
                href="/cadastro"
                className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-build px-5 text-base font-black text-white"
              >
                Clique Aqui e Faça sua Conta
                <ArrowRight size={22} />
              </Link>
              <p className="mt-4 text-sm font-semibold leading-6 text-graphite/62">
                Depois do cadastro, enviaremos um código para confirmar seu
                email antes de definir a senha.
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
