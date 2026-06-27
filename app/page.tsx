import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Camera,
  ClipboardList,
  CloudSun,
  MessageSquareText,
  Wallet
} from "lucide-react";
import { Brand } from "@/components/Brand";

const pillars = [
  {
    icon: ClipboardList,
    title: "Diário da obra",
    text: "Registre atividades, fotos e observações no fluxo natural do dia."
  },
  {
    icon: Wallet,
    title: "Gastos simples",
    text: "Materiais, mão de obra e extras organizados sem planilha."
  },
  {
    icon: CalendarCheck,
    title: "Lembretes",
    text: "Prazos, compras e pagamentos no mesmo lugar da obra."
  }
];

const modules = [
  "Obras",
  "Diário",
  "Financeiro",
  "Materiais",
  "Mão de obra",
  "Recibos",
  "Clima",
  "Relatórios"
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <section className="hero-bg flex min-h-[88svh] flex-col text-white">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Brand inverse />
          <nav className="hidden items-center gap-7 text-sm font-medium text-white/82 md:flex">
            <a href="#produto">Produto</a>
            <a href="#modulos">Módulos</a>
            <Link href="/login">Entrar</Link>
          </nav>
          <Link
            href="/cadastro"
            className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-build px-4 text-sm font-bold text-white shadow-soft transition hover:bg-[#d96717]"
          >
            Começar
            <ArrowRight size={17} />
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pb-10 pt-8 sm:px-6">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex rounded-[8px] bg-white/12 px-3 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/18">
              Seu Assistente Inteligente de Obras e Reformas
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Obrio AI
            </h1>
            <p className="mt-5 max-w-lg text-xl font-semibold leading-snug text-white">
              Controle sua obra sem planilhas.
            </p>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/82">
              Organize diário, gastos, fotos, lembretes, clima e relatórios em
              uma experiência simples para celular.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-build px-5 text-sm font-bold text-white transition hover:bg-[#d96717]"
              >
                Começar Gratuitamente
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-[8px] border border-white/34 px-5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Ver dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="produto" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((item) => (
            <article
              key={item.title}
              className="rounded-[8px] border border-black/5 bg-white p-5 shadow-soft"
            >
              <item.icon className="text-build" size={25} />
              <h2 className="mt-4 text-lg font-bold text-foundation">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-graphite/72">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="modulos" className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase text-build">MVP V1</p>
            <h2 className="mt-3 text-3xl font-black tracking-normal text-foundation">
              Feito para quem resolve obra no campo.
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-graphite/72">
              O primeiro frontend já separa os módulos essenciais e deixa o
              produto pronto para receber Supabase, storage, IA e WhatsApp.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {modules.map((module) => (
              <div
                key={module}
                className="flex min-h-20 items-center rounded-[8px] bg-concrete px-4 text-sm font-bold text-foundation"
              >
                {module}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <div className="rounded-[8px] bg-foundation p-5 text-white lg:col-span-2">
          <MessageSquareText className="text-build" />
          <h2 className="mt-4 text-2xl font-black tracking-normal">
            Assistente Obrio AI
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-white/80">
            A interface já reserva espaço para o chat que transforma frases do
            dia a dia em financeiro, material, diário ou lembrete.
          </p>
        </div>
        <div className="rounded-[8px] bg-[#EAF4EF] p-5 text-foundation">
          <CloudSun className="text-build" />
          <h2 className="mt-4 text-2xl font-black tracking-normal">
            Clima inteligente
          </h2>
          <p className="mt-3 leading-7 text-graphite/72">
            Avisos práticos para chuva, pintura externa, concretagem e riscos de
            atraso.
          </p>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-graphite/60 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Brand />
        <span>Obrio AI - MVP frontend V1</span>
      </footer>
    </main>
  );
}
