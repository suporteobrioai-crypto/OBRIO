"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Archive,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  Edit3,
  FileBarChart,
  FileText,
  Home,
  House,
  LogOut,
  Mic,
  MoreVertical,
  ReceiptText,
  RotateCcw,
  Send,
  Settings,
  Trash2,
  X,
  Users,
  UserCircle,
  UserRoundCheck,
} from "lucide-react";
import { ObrioMark } from "@/components/ObrioMark";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Obras", href: "/obras", icon: Building2 },
  { label: "Diário da Obra", href: "/diario", icon: FileText },
  { label: "Compras, Notas Fiscais e Garantias", href: "/materiais", icon: ReceiptText },
  { label: "Pagamentos da Equipe (Prestadores de Serviços)", href: "/mao-de-obra", icon: Users },
  { label: "Responsáveis pelas Obras", href: "/trocar-obra", icon: UserRoundCheck },
  { label: "Lembretes", href: "/lembretes", icon: Bell },
  { label: "Relatórios", href: "/relatorios", icon: FileBarChart }
];

const assistantNavItem = {
  label: "Assistente Obrio AI",
  href: "/assistente",
  icon: ObrioMark
};

const materialPlaceholders = [
  "Ex: Comprei 30 sacos de cimento por R$ 1.200.",
  "Ex: Quanto gastei este mês?",
  "Ex: Quais garantias vencem nos próximos 30 dias?",
  "Ex: Mostre minhas compras de maio.",
  "Ex: Quanto já gastei com material elétrico?",
  "Ex: Encontre a nota fiscal da betoneira."
];

const teamPaymentPlaceholders = [
  "Ex: Paguei João pedreiro R$ 800 hoje.",
  "Ex: Quanto já paguei para o eletricista?",
  "Ex: Mostre os pagamentos deste mês.",
  "Ex: Quais profissionais ainda precisam receber?",
  "Ex: Quanto já paguei para a Equipe Alfa?",
  "Ex: Mostre todos os pagamentos de maio."
];

const teamPaymentSuggestions = [
  "Quanto gastei com pedreiros este mês?",
  "Quem recebeu mais este ano?",
  "Quais pagamentos estão pendentes?",
  "Mostre os comprovantes do João Silva.",
  "Quanto já paguei para eletricistas?",
  "Quais pagamentos vencem esta semana?"
];

const reminderSuggestions = [
  "Quais lembretes vencem esta semana?",
  "O que está atrasado?",
  "Criar lembrete para sexta às 17h",
  "Mostrar tarefas de amanhã",
  "O que precisa de atenção hoje?"
];

const reportSuggestions = [
  "Resumir obra",
  "Mostrar gastos do mês",
  "Ver pendências",
  "Gerar relatório financeiro",
  "Comparar orçamento e gasto",
  "Existe risco de atraso?"
];

const assistantSuggestions = [
  "Hoje paguei o pedreiro João R$ 800",
  "Comprei 30 sacos de cimento",
  "Gere um relatório financeiro",
  "Quanto já gastei nesta obra?",
  "Existe risco de atraso?",
  "O que preciso fazer amanhã?"
];

const assistantPlaceholders = [
  "Ex: Hoje paguei o pedreiro.",
  "Ex: Comprei 30 sacos de cimento.",
  "Ex: O que preciso fazer amanhã?",
  "Ex: Quanto já gastei nesta obra?",
  "Ex: Gere um relatório para meu contador."
];

type Project = {
  id: string;
  name: string;
  status: string;
  city: string;
  state: string;
  type: string;
  propertyType: string;
  area: string;
  budget: string;
  startDate: string;
  deliveryDate: string;
  address: string;
  archived?: boolean;
  manager?: {
    name: string;
    email: string;
    phone: string;
    role: string;
    status: "Pendente" | "Ativo";
  };
};

const planRules = {
  name: "Premium",
  limit: 10,
  managerLimitPerProject: 1
};

const projects: Project[] = [
  {
    id: "casa-vila-mariana",
    name: "Casa Vila Mariana",
    status: "Em andamento",
    city: "Vila Mariana",
    state: "SP",
    type: "Obra completa",
    propertyType: "Residencial",
    area: "128 m²",
    budget: "R$ 180.000",
    startDate: "01/06/2026",
    deliveryDate: "22/08/2026",
    address: "Rua Vergueiro, Vila Mariana",
    manager: {
      name: "João Pereira",
      email: "joao@obra.com",
      phone: "(11) 98888-1111",
      role: "Mestre de obras",
      status: "Ativo"
    }
  },
  {
    id: "reforma-loja-centro",
    name: "Reforma Loja Centro",
    status: "Pausada",
    city: "Centro",
    state: "SP",
    type: "Reforma",
    propertyType: "Comercial",
    area: "84 m²",
    budget: "R$ 65.000",
    startDate: "12/05/2026",
    deliveryDate: "30/07/2026",
    address: "Rua Boa Vista, Centro"
  },
  {
    id: "apartamento-santos",
    name: "Apartamento Santos",
    status: "Em andamento",
    city: "Santos",
    state: "SP",
    type: "Reforma",
    propertyType: "Residencial",
    area: "72 m²",
    budget: "R$ 92.000",
    startDate: "20/05/2026",
    deliveryDate: "18/08/2026",
    address: "Avenida Ana Costa, Santos"
  },
  {
    id: "condominio-riviera",
    name: "Condomínio Riviera",
    status: "Concluída",
    city: "Bertioga",
    state: "SP",
    type: "Obra completa",
    propertyType: "Residencial",
    area: "240 m²",
    budget: "R$ 410.000",
    startDate: "15/01/2026",
    deliveryDate: "30/05/2026",
    address: "Riviera de São Lourenço"
  },
  {
    id: "casa-arquivada",
    name: "Casa Arquivada",
    status: "Arquivada",
    city: "Atibaia",
    state: "SP",
    type: "Reforma",
    propertyType: "Residencial",
    area: "110 m²",
    budget: "R$ 120.000",
    startDate: "10/01/2025",
    deliveryDate: "20/04/2025",
    address: "Centro, Atibaia",
    archived: true
  }
];

export function AppShell({
  title,
  subtitle,
  children,
  action
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const pathname = usePathname();
  const [permissionModal, setPermissionModal] = useState<null | "camera" | "audio">(
    null
  );
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [diaryConfirmationOpen, setDiaryConfirmationOpen] = useState(false);
  const [materialPlaceholderIndex, setMaterialPlaceholderIndex] = useState(0);
  const [teamPaymentPlaceholderIndex, setTeamPaymentPlaceholderIndex] = useState(0);
  const [assistantPlaceholderIndex, setAssistantPlaceholderIndex] = useState(0);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [assistantNotice, setAssistantNotice] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);
  const [projectActionsOpen, setProjectActionsOpen] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [managerProject, setManagerProject] = useState<Project | null>(null);
  const [managerTab, setManagerTab] = useState<"dados" | "gerente" | "arquivo">("dados");
  const [archivedModalOpen, setArchivedModalOpen] = useState(false);

  const activeProjects = projects.filter((project) => !project.archived);
  const archivedProjects = projects.filter((project) => project.archived);
  const activeProject =
    projects.find((project) => project.id === activeProjectId) || activeProjects[0];
  const showObrioInput = [
    "/dashboard",
    "/diario",
    "/materiais",
    "/mao-de-obra",
    "/lembretes",
    "/relatorios",
    "/assistente"
  ].some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const showWhatsAppButton = [
    "/dashboard",
    "/obras",
    "/diario",
    "/materiais",
    "/mao-de-obra",
    "/lembretes",
    "/relatorios",
    "/assistente"
  ].some((path) => pathname === path || pathname.startsWith(`${path}/`));
  useEffect(() => {
    const savedProjectId = window.localStorage.getItem("obrio-active-project");
    if (savedProjectId && projects.some((project) => project.id === savedProjectId)) {
      setActiveProjectId(savedProjectId);
    }
  }, []);

  useEffect(() => {
    if (pathname !== "/materiais") return;

    const interval = window.setInterval(() => {
      setMaterialPlaceholderIndex(
        (current) => (current + 1) % materialPlaceholders.length
      );
    }, 4000);

    return () => window.clearInterval(interval);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/mao-de-obra") return;

    const interval = window.setInterval(() => {
      setTeamPaymentPlaceholderIndex(
        (current) => (current + 1) % teamPaymentPlaceholders.length
      );
    }, 4000);

    return () => window.clearInterval(interval);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/assistente") return;

    const interval = window.setInterval(() => {
      setAssistantPlaceholderIndex(
        (current) => (current + 1) % assistantPlaceholders.length
      );
    }, 4000);

    return () => window.clearInterval(interval);
  }, [pathname]);

  function selectProject(project: Project) {
    setActiveProjectId(project.id);
    setProjectMenuOpen(false);
    setProjectActionsOpen(null);
    window.localStorage.setItem("obrio-active-project", project.id);
    window.dispatchEvent(new CustomEvent("obrio:project-change", { detail: project }));
  }

  function sendAssistantMessage(message = assistantMessage) {
    const normalizedMessage = message.trim();
    if (!normalizedMessage) return;
    setAssistantNotice(`Pergunta enviada: ${normalizedMessage}`);
    setAssistantMessage("");
  }

  function handleNewProject() {
    if (activeProjects.length >= planRules.limit) {
      setUpgradeModalOpen(true);
      setProjectMenuOpen(false);
      return;
    }

    window.location.href = "/obras/nova";
  }

  function openManageProject(project: Project) {
    setManagerProject(project);
    setManagerTab("dados");
    setProjectActionsOpen(null);
    setProjectMenuOpen(false);
  }

  function openPermission(type: "camera" | "audio") {
    setPermissionDenied(false);
    setPermissionModal(type);
  }

  function ProjectCard({ mobile = false }: { mobile?: boolean }) {
    return (
      <button
        type="button"
        onClick={() => setProjectMenuOpen((value) => !value)}
        className={`flex w-full items-center gap-3 rounded-[8px] bg-concrete p-3 text-left transition hover:bg-[#e9eeeb] ${
          mobile ? "" : ""
        }`}
        aria-expanded={projectMenuOpen}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-foundation text-white">
          <House size={mobile ? 19 : 20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-black text-foundation">
            {activeProject.name}
          </span>
          <span className="block text-xs font-bold text-graphite/55">
            {activeProject.status}
          </span>
          <span className="block truncate text-xs font-bold text-graphite/55">
            {activeProject.city} - {activeProject.state}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-build transition ${
            projectMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    );
  }

  function ProjectSelectorContent({ mobile = false }: { mobile?: boolean }) {
    return (
      <div className={mobile ? "grid gap-2" : "grid gap-1"}>
        {activeProjects.map((project) => (
          <div
            key={project.id}
            className="relative grid grid-cols-[1fr_34px] items-center rounded-[8px] transition hover:bg-concrete"
          >
            <button
              type="button"
              onClick={() => selectProject(project)}
              className="grid min-h-16 w-full min-w-0 grid-cols-[40px_1fr_22px] items-center gap-3 rounded-[8px] px-3 py-3 text-left"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-concrete text-foundation">
                <House size={18} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-foundation">
                  {project.name}
                </span>
                <span className="mt-1 block truncate text-xs font-bold text-graphite/55">
                  {project.status} · {project.city} - {project.state}
                </span>
              </span>
              {project.id === activeProject.id ? (
                <span className="text-center text-lg font-black text-build">✓</span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setProjectActionsOpen((value) => (value === project.id ? null : project.id));
              }}
              className="mr-1 grid h-9 w-9 place-items-center rounded-[8px] text-build hover:bg-white"
              title="Ações da obra"
            >
              <MoreVertical size={17} />
            </button>
            {projectActionsOpen === project.id ? (
              <div className="absolute right-2 top-[calc(100%-4px)] z-50 w-48 rounded-[8px] border border-black/5 bg-white p-2 shadow-soft">
                <button
                  type="button"
                  onClick={() => openManageProject(project)}
                  className="flex h-10 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm font-bold text-foundation hover:bg-concrete"
                >
                  <Edit3 size={16} className="text-build" />
                  Gerenciar obra
                </button>
                <button className="flex h-10 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm font-bold text-foundation hover:bg-concrete">
                  <Archive size={16} className="text-build" />
                  Arquivar obra
                </button>
                <button className="flex h-10 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm font-bold text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                  Excluir obra
                </button>
              </div>
            ) : null}
          </div>
        ))}

        <div className="my-2 border-t border-black/5" />

        <button
          type="button"
          onClick={handleNewProject}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-foundation text-sm font-black text-white"
        >
          <PlusIcon />
          Nova Obra
        </button>
        <button
          type="button"
          onClick={() => {
            setArchivedModalOpen(true);
            setProjectMenuOpen(false);
          }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-concrete text-sm font-black text-foundation"
        >
          <Archive size={16} className="text-build" />
          Ver obras arquivadas
        </button>
      </div>
    );
  }

  function PlusIcon() {
    return <span className="text-lg leading-none">+</span>;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f8f6] text-graphite">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] lg:grid-cols-[286px_minmax(0,1fr)]">
        <aside className="hidden h-screen flex-col border-r border-black/5 bg-white p-5 lg:sticky lg:top-0 lg:flex">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="grid h-9 w-9 place-items-center">
                <ObrioMark size={36} />
              </span>
              <span className="text-lg font-bold tracking-normal text-foundation">
                Obrio AI
              </span>
            </div>
            <p className="mx-auto mt-2 text-xs font-semibold leading-5 text-graphite/55">
              <span className="block whitespace-nowrap">Seu assistente inteligente</span>
              <span className="block whitespace-nowrap">para obras e reformas.</span>
            </p>
          </div>

          <div className="relative mt-6">
            <button
              type="button"
              onClick={() => setUserMenuOpen((value) => !value)}
              className="flex w-full items-center gap-3 rounded-[8px] bg-concrete p-3 text-left transition hover:bg-[#e9eeeb]"
              aria-expanded={userMenuOpen}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-foundation text-sm font-black text-white">
                OM
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black text-foundation">
                  Orlando Montes
                </span>
                <span className="block text-xs font-bold text-graphite/55">
                  Plano Premium
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-build transition ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {userMenuOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-[8px] border border-black/5 bg-white p-2 shadow-soft">
                <Link
                  href="/perfil"
                  className="flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-bold text-foundation hover:bg-concrete"
                >
                  <UserCircle size={16} className="text-build" />
                  Meu Perfil
                </Link>
                <Link
                  href="/assinatura"
                  className="flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-bold text-foundation hover:bg-concrete"
                >
                  <ReceiptText size={16} className="text-build" />
                  Minha Assinatura
                </Link>
                <Link
                  href="/trocar-obra"
                  className="flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-bold text-foundation hover:bg-concrete"
                >
                  <Users size={16} className="text-build" />
                  Responsáveis pelas Obras
                </Link>
                <Link
                  href="/configuracoes"
                  className="flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-bold text-foundation hover:bg-concrete"
                >
                  <Settings size={16} className="text-build" />
                  Configurações
                </Link>
                <button
                  type="button"
                  onClick={() => setLogoutConfirmOpen(true)}
                  className="flex h-10 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm font-bold text-foundation hover:bg-concrete"
                >
                  <LogOut size={16} className="text-build" />
                  Sair
                </button>
              </div>
            ) : null}
          </div>

          <nav className="mt-5 grid gap-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-11 items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-foundation text-white"
                      : "text-foundation hover:bg-concrete"
                  }`}
                >
                  <item.icon size={18} className="shrink-0 text-build" />
                  <span className="leading-5">{item.label}</span>
                </Link>
              );
            })}
            {(() => {
              const active =
                pathname === assistantNavItem.href ||
                pathname.startsWith(`${assistantNavItem.href}/`);
              return (
                <Link
                  href={assistantNavItem.href}
                  className={`flex min-h-11 items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-foundation text-white"
                      : "text-foundation hover:bg-concrete"
                  }`}
                >
                  <assistantNavItem.icon size={18} className="shrink-0 text-build" />
                  <span className="leading-5">{assistantNavItem.label}</span>
                </Link>
              );
            })()}
          </nav>
        </aside>

        <section className="min-w-0 max-w-full overflow-x-hidden pb-6">
          <header className="sticky top-0 z-20 border-b border-black/5 bg-white/94 px-4 py-4 backdrop-blur md:px-6 md:py-5 lg:px-8 lg:py-6">
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-4 lg:hidden">
                  <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 shrink-0 place-items-center">
                          <ObrioMark size={32} />
                        </span>
                        <span className="truncate text-base font-bold tracking-normal text-foundation">
                          Obrio AI
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] font-semibold leading-4 text-graphite/55 sm:text-[11px]">
                        <span className="block">Seu assistente inteligente</span>
                        <span className="block">para obras e reformas.</span>
                      </p>
                    </div>

                    <div className="relative min-w-0">
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen((value) => !value)}
                        className="flex min-h-14 w-full items-center gap-2 rounded-[8px] bg-concrete p-2 text-left"
                        aria-expanded={userMenuOpen}
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foundation text-[10px] font-black text-white">
                          OM
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-black text-foundation sm:text-sm">
                            Orlando Montes
                          </span>
                          <span className="block truncate text-[10px] font-semibold text-graphite/55 sm:text-xs">
                            Plano Premium
                          </span>
                        </span>
                        <ChevronDown
                          size={16}
                          className={`shrink-0 text-build transition ${
                            userMenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {userMenuOpen ? (
                        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-[min(280px,calc(100vw-32px))] rounded-[8px] border border-black/5 bg-white p-2 shadow-soft">
                          <Link href="/perfil" className="flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-bold text-foundation hover:bg-concrete">
                            <UserCircle size={16} className="text-build" />
                            Meu Perfil
                          </Link>
                          <Link href="/assinatura" className="flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-bold text-foundation hover:bg-concrete">
                            <ReceiptText size={16} className="text-build" />
                            Minha Assinatura
                          </Link>
                          <Link href="/trocar-obra" className="flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-bold text-foundation hover:bg-concrete">
                            <Users size={16} className="text-build" />
                            Responsáveis pelas Obras
                          </Link>
                          <Link href="/configuracoes" className="flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-bold text-foundation hover:bg-concrete">
                            <Settings size={16} className="text-build" />
                            Configurações
                          </Link>
                          <button type="button" onClick={() => setLogoutConfirmOpen(true)} className="flex h-10 w-full items-center gap-2 rounded-[8px] px-3 text-left text-sm font-bold text-foundation hover:bg-concrete">
                            <LogOut size={16} className="text-build" />
                            Sair
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="hidden items-center gap-2 lg:flex">
                  <ObrioMark size={30} />
                  <span className="text-base font-black text-foundation">Obrio AI</span>
                </div>
                <h1 className="mt-2 max-w-[950px] text-[22px] font-black leading-[1.14] tracking-normal text-build min-[380px]:text-[24px] md:text-[28px] xl:text-[32px]">
                  {title}
                </h1>
                <p className="mt-2 max-w-[900px] text-sm font-semibold leading-6 text-graphite/60 sm:text-base">
                  {subtitle}
                </p>
              </div>
              {action ? <div className="shrink-0">{action}</div> : null}
            </div>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-[8px] px-3 text-xs font-black ${
                      active
                        ? "bg-foundation text-white"
                        : "bg-concrete text-foundation"
                    }`}
                  >
                    <item.icon size={16} className="text-build" />
                    {item.label}
                  </Link>
                );
              })}
              {(() => {
                const active =
                  pathname === assistantNavItem.href ||
                  pathname.startsWith(`${assistantNavItem.href}/`);
                return (
                  <Link
                    href={assistantNavItem.href}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-[8px] px-3 text-xs font-black ${
                      active
                        ? "bg-foundation text-white"
                        : "bg-concrete text-foundation"
                    }`}
                  >
                    <assistantNavItem.icon size={16} className="text-build" />
                    {assistantNavItem.label}
                  </Link>
                );
              })()}
            </nav>
          </header>

          <div
            className={`min-w-0 max-w-full px-4 py-5 md:px-6 lg:px-8 ${
              pathname === "/mao-de-obra" ||
              pathname === "/lembretes" ||
              pathname === "/relatorios" ||
              pathname === "/assistente"
                ? "pb-64 sm:pb-56"
                : pathname === "/diario" ||
                  pathname === "/materiais"
                ? "pb-44"
                : ""
            }`}
          >
            {children}

            {showObrioInput ? (
              <section
                className={`mt-4 rounded-[8px] border border-black/5 bg-white shadow-soft ${
                  pathname === "/mao-de-obra" ||
                  pathname === "/lembretes" ||
                  pathname === "/relatorios" ||
                  pathname === "/assistente"
                    ? "p-3 sm:p-4"
                    : "p-4"
                } ${
                  pathname === "/diario"
                    ? "fixed inset-x-2 bottom-2 z-40 w-auto max-w-[calc(100vw-16px)] overflow-hidden lg:static lg:max-h-none lg:max-w-none lg:overflow-visible"
                    : pathname === "/materiais"
                      ? "obrio-materials-dock obrio-materials-dock-raised"
                    : pathname === "/mao-de-obra"
                      ? "obrio-materials-dock obrio-payment-dock"
                    : pathname === "/lembretes"
                      ? "obrio-materials-dock obrio-materials-dock-raised"
                    : pathname === "/relatorios"
                      ? "obrio-materials-dock obrio-materials-dock-raised"
                    : pathname === "/assistente"
                      ? "obrio-materials-dock obrio-materials-dock-raised"
                    : ""
                }`}
              >
                {pathname === "/diario" && diaryConfirmationOpen ? (
                  <div className="mb-4 rounded-[8px] bg-concrete p-3">
                    <p className="text-xs font-black uppercase text-build">
                      Confirmação do Obrio AI
                    </p>
                    <p className="mt-2 text-sm font-bold leading-5 text-foundation">
                      Entendi que isso é um registro do Diário da Obra:
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-graphite/70">
                      Concluímos a laje e chegaram 30 sacos de cimento. Deseja salvar?
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setDiaryConfirmationOpen(false)}
                        className="h-10 rounded-[8px] bg-foundation px-4 text-sm font-black text-white"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiaryConfirmationOpen(false)}
                        className="h-10 rounded-[8px] bg-white px-4 text-sm font-black text-foundation"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiaryConfirmationOpen(false)}
                        className="h-10 rounded-[8px] bg-white px-4 text-sm font-black text-red-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : null}
                {pathname === "/mao-de-obra" ||
                pathname === "/lembretes" ||
                pathname === "/relatorios" ||
                pathname === "/assistente" ? (
                  <div className="mb-2 border-b border-black/5 pb-2 sm:mb-4 sm:pb-4">
                    {pathname === "/assistente" ? (
                      <p className="mb-2 text-[11px] font-black uppercase text-graphite/45">
                        Exemplos prontos
                      </p>
                    ) : null}
                    <div className="flex gap-2 overflow-x-auto">
                      {(pathname === "/lembretes"
                        ? reminderSuggestions
                        : pathname === "/relatorios"
                          ? reportSuggestions
                          : pathname === "/assistente"
                            ? assistantSuggestions
                          : teamPaymentSuggestions
                      ).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            if (
                              pathname === "/relatorios" ||
                              pathname === "/assistente"
                            ) {
                              sendAssistantMessage(suggestion);
                            } else {
                              setAssistantMessage(suggestion);
                            }
                          }}
                          className="shrink-0 rounded-[8px] bg-concrete px-3 py-1.5 text-left text-[11px] font-bold text-foundation sm:py-2 sm:text-xs"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {(pathname === "/relatorios" || pathname === "/assistente") &&
                assistantNotice ? (
                  <div className="mb-2 flex items-center gap-2 rounded-[8px] bg-[#EAF4EF] px-3 py-2 text-xs font-bold text-moss">
                    <CheckCircle2 size={15} className="shrink-0" />
                    <span className="truncate">{assistantNotice}</span>
                  </div>
                ) : null}
                <div
                  className={`flex flex-col xl:flex-row xl:items-center ${
                    pathname === "/mao-de-obra" ||
                    pathname === "/lembretes" ||
                    pathname === "/relatorios" ||
                    pathname === "/assistente"
                      ? "gap-2 sm:gap-4"
                      : "gap-4"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      className={`grid shrink-0 place-items-center rounded-[8px] bg-foundation ${
                        pathname === "/mao-de-obra" ||
                        pathname === "/lembretes" ||
                        pathname === "/relatorios" ||
                        pathname === "/assistente"
                          ? "h-9 w-9 sm:h-11 sm:w-11"
                          : "h-11 w-11"
                      }`}
                    >
                      <ObrioMark
                        size={
                          pathname === "/mao-de-obra" ||
                          pathname === "/lembretes" ||
                          pathname === "/relatorios" ||
                          pathname === "/assistente"
                            ? 36
                            : 44
                        }
                      />
                    </span>
                    <div className="min-w-0">
                      <h2
                        className={`font-black text-foundation ${
                          pathname === "/mao-de-obra" ||
                          pathname === "/lembretes" ||
                          pathname === "/relatorios" ||
                          pathname === "/assistente"
                            ? "text-base sm:text-lg"
                            : "text-lg"
                        }`}
                      >
                        {pathname === "/assistente"
                          ? "Fale naturalmente com o Obrio AI"
                          : pathname === "/relatorios"
                          ? "Fale com seu assistente Obrio AI"
                          : pathname === "/lembretes"
                          ? "Fale com seu assistente Obrio AI"
                          : pathname === "/dashboard" ||
                              pathname === "/diario" ||
                              pathname === "/materiais" ||
                              pathname === "/mao-de-obra"
                            ? "Fale com o Obrio AI"
                            : "Obrio AI"}
                      </h2>
                      <p
                        className={`mt-1 font-semibold text-graphite/62 ${
                          pathname === "/mao-de-obra" ||
                          pathname === "/lembretes" ||
                          pathname === "/relatorios" ||
                          pathname === "/assistente"
                            ? "text-xs leading-4 sm:text-sm sm:leading-6"
                            : "text-sm leading-6"
                        }`}
                      >
                        {pathname === "/dashboard"
                          ? "Envie foto, áudio ou texto. O Obrio AI entende e registra tudo automaticamente."
                          : pathname === "/diario"
                            ? "Envie foto, áudio ou texto. O Obrio AI entende, registra e organiza tudo no Diário da Obra."
                          : pathname === "/materiais"
                            ? "Fale com o seu assistente Obrio AI. Pergunte, registre ou consulte qualquer informação sobre compras, gastos, notas fiscais e garantias."
                          : pathname === "/mao-de-obra"
                            ? "Fale com seu assistente Obrio AI. Registre pagamentos, consulte profissionais, encontre comprovantes e acompanhe os gastos da equipe."
                          : pathname === "/lembretes"
                            ? "Crie lembretes por texto, áudio ou foto. O Obrio AI entende datas, horários e tarefas automaticamente."
                          : pathname === "/relatorios"
                            ? "Pergunte sobre gastos, prazo, pagamentos, materiais, relatórios e andamento da obra."
                          : pathname === "/assistente"
                            ? "Envie texto, foto, áudio, nota fiscal, recibo ou documento. O Obrio AI entende, classifica, registra e responde automaticamente."
                          : "Mande áudio, foto ou escreva. Eu entendo e organizo no lugar certo."}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`grid gap-2 xl:w-[620px] ${
                      pathname === "/mao-de-obra" ||
                      pathname === "/lembretes" ||
                      pathname === "/relatorios" ||
                      pathname === "/assistente"
                        ? "grid-cols-[minmax(0,1fr)_44px_44px_44px]"
                        : "grid-cols-3 sm:grid-cols-[1fr_44px_44px_44px]"
                    }`}
                  >
                    <input
                      value={assistantMessage}
                      onChange={(event) => setAssistantMessage(event.target.value)}
                      placeholder={
                        pathname === "/diario"
                          ? "Ex: Hoje concluímos a laje e chegaram 30 sacos de cimento..."
                          : pathname === "/materiais"
                            ? materialPlaceholders[materialPlaceholderIndex]
                          : pathname === "/mao-de-obra"
                            ? teamPaymentPlaceholders[teamPaymentPlaceholderIndex]
                          : pathname === "/lembretes"
                            ? "Ex: Comprar cimento amanhã às 8h..."
                          : pathname === "/relatorios"
                            ? "Ex: Quanto gastei este mês?"
                          : pathname === "/assistente"
                            ? assistantPlaceholders[assistantPlaceholderIndex]
                          : "Ex: amanhã comprar cimento às 8h..."
                      }
                      className={`h-12 min-w-0 rounded-[8px] border border-black/10 bg-white px-3 text-sm font-semibold outline-none placeholder:text-graphite/35 focus:border-build sm:h-11 ${
                        pathname === "/mao-de-obra" ||
                        pathname === "/lembretes" ||
                        pathname === "/relatorios" ||
                        pathname === "/assistente"
                          ? "col-span-1"
                          : "col-span-3 sm:col-span-1"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => openPermission("camera")}
                      className="grid h-12 place-items-center rounded-[8px] bg-concrete text-build sm:h-11"
                      title="Enviar foto"
                    >
                      <Camera size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openPermission("audio")}
                      className="grid h-12 place-items-center rounded-[8px] bg-concrete text-build sm:h-11"
                      title="Gravar áudio"
                    >
                      <Mic size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (pathname === "/diario") {
                          setDiaryConfirmationOpen(true);
                        }
                        if (pathname === "/relatorios") {
                          sendAssistantMessage();
                        }
                        if (pathname === "/assistente") {
                          sendAssistantMessage();
                        }
                      }}
                      className="grid h-12 place-items-center rounded-[8px] bg-build text-white sm:h-11"
                      title="Enviar"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </div>
      {showWhatsAppButton ? (
        <a
          href="/configuracoes"
          className={`fixed right-4 z-50 inline-flex max-w-[calc(100vw-32px)] items-center gap-2 rounded-full bg-[#22C55E] px-3 py-1.5 text-xs font-normal text-white shadow-[0_14px_32px_rgba(34,197,94,0.24)] transition hover:-translate-y-0.5 hover:bg-[#16A34A] sm:right-5 sm:px-3.5 sm:py-1.5 ${
            pathname === "/diario"
                ? "bottom-[190px] lg:bottom-4"
                : "bottom-4"
          }`}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center">
            <WhatsAppIcon size={24} />
          </span>
          <span className="min-w-0 pr-0.5 text-left leading-[14px]">
            <span className="block whitespace-nowrap">Fale com Obrio AI</span>
            <span className="block whitespace-nowrap">no seu WhatsApp</span>
          </span>
        </a>
      ) : null}

      {projectMenuOpen ? (
        <div className="fixed inset-0 z-40 bg-black/35 px-3 pt-16 lg:hidden">
          <div className="ml-auto flex h-full max-h-[calc(100vh-64px)] w-full flex-col rounded-t-[16px] bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-build">Obra ativa</p>
                <h2 className="text-xl font-black text-foundation">Selecionar obra</h2>
              </div>
              <button
                type="button"
                onClick={() => setProjectMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-[8px] bg-concrete text-foundation"
              >
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto pb-4">
              <ProjectSelectorContent mobile />
            </div>
          </div>
        </div>
      ) : null}

      {upgradeModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
          <div className="w-full max-w-md rounded-[8px] bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-foundation">Limite de obras atingido</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-graphite/65">
              Seu plano atual permite até {planRules.limit} obra(s). Faça upgrade
              para cadastrar mais obras.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/assinatura"
                className="inline-flex h-12 items-center justify-center rounded-[8px] bg-foundation text-sm font-black text-white"
              >
                Ver planos
              </Link>
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                className="h-12 rounded-[8px] border border-black/10 bg-white text-sm font-black text-foundation"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {archivedModalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
          <div className="w-full max-w-xl rounded-[8px] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-black text-foundation">Obras arquivadas</h2>
              <button
                type="button"
                onClick={() => setArchivedModalOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-[8px] bg-concrete text-foundation"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {archivedProjects.map((project) => (
                <div key={project.id} className="rounded-[8px] bg-concrete p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-black text-foundation">{project.name}</h3>
                      <p className="mt-1 text-sm font-bold text-graphite/55">
                        {project.city} - {project.state}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-white px-3 text-sm font-black text-foundation">
                        <RotateCcw size={16} className="text-build" />
                        Restaurar
                      </button>
                      <button className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-white px-3 text-sm font-black text-red-600">
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {managerProject ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35 px-4 py-6">
          <div className="mx-auto w-full max-w-3xl rounded-[8px] bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-build">Gerenciar obra</p>
                <h2 className="mt-1 text-2xl font-black text-foundation">
                  {managerProject.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setManagerProject(null)}
                className="grid h-10 w-10 place-items-center rounded-[8px] bg-concrete text-foundation"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto rounded-[8px] bg-concrete p-1">
              {[
                ["dados", "Dados da Obra"],
                ["gerente", "Gerente da Obra"],
                ["arquivo", "Arquivar/Excluir"]
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setManagerTab(id as "dados" | "gerente" | "arquivo")}
                  className={`h-10 shrink-0 rounded-[8px] px-3 text-sm font-black ${
                    managerTab === id ? "bg-foundation text-white" : "text-foundation"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {managerTab === "dados" ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  ["Nome da obra", managerProject.name],
                  ["Tipo de projeto", managerProject.type],
                  ["Tipo de imóvel", managerProject.propertyType],
                  ["Status", managerProject.status],
                  ["Cidade", managerProject.city],
                  ["Estado", managerProject.state],
                  ["Endereço", managerProject.address],
                  ["Área aproximada", managerProject.area],
                  ["Orçamento previsto", managerProject.budget],
                  ["Data de início", managerProject.startDate],
                  ["Data prevista de entrega", managerProject.deliveryDate]
                ].map(([label, value]) => (
                  <label key={label} className="block">
                    <span className="text-sm font-black text-foundation">{label}</span>
                    <input
                      defaultValue={value}
                      className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
                    />
                  </label>
                ))}
                <label className="block md:col-span-2">
                  <span className="text-sm font-black text-foundation">Foto/capa da obra opcional</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 w-full rounded-[8px] border border-black/10 bg-white p-3 text-sm"
                  />
                </label>
                <button className="h-12 rounded-[8px] bg-foundation text-sm font-black text-white md:col-span-2">
                  Salvar alterações
                </button>
              </div>
            ) : null}

            {managerTab === "gerente" ? (
              <div className="mt-5 grid gap-4">
                {managerProject.manager ? (
                  <div className="rounded-[8px] bg-concrete p-4">
                    <h3 className="text-lg font-black text-foundation">
                      {managerProject.manager.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-graphite/60">
                      {managerProject.manager.email} · {managerProject.manager.phone}
                    </p>
                    <p className="mt-1 text-sm font-bold text-graphite/60">
                      {managerProject.manager.role} · Convite {managerProject.manager.status}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="h-10 rounded-[8px] bg-white px-3 text-sm font-black text-foundation">
                        Reenviar convite
                      </button>
                      <button className="h-10 rounded-[8px] bg-white px-3 text-sm font-black text-red-600">
                        Remover gerente
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {["Nome", "Email", "Telefone", "Cargo/função"].map((label) => (
                      <label key={label} className="block">
                        <span className="text-sm font-black text-foundation">{label}</span>
                        <input className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build" />
                      </label>
                    ))}
                    <button className="h-12 rounded-[8px] bg-foundation text-sm font-black text-white md:col-span-2">
                      Convidar gerente
                    </button>
                  </div>
                )}

                <div className="rounded-[8px] bg-[#EAF4EF] p-4">
                  <h3 className="font-black text-foundation">Permissões do gerente</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-graphite/70">
                    Pode ver Dashboard, registrar Diário, enviar Fotos, registrar Compras/Notas,
                    registrar Pagamentos da Equipe, criar Lembretes e ver Relatórios.
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-graphite/70">
                    Não pode excluir obra, arquivar obra, alterar assinatura, alterar proprietário
                    ou excluir conta.
                  </p>
                </div>
              </div>
            ) : null}

            {managerTab === "arquivo" ? (
              <div className="mt-5 grid gap-4">
                <div className="rounded-[8px] bg-concrete p-4">
                  <h3 className="text-lg font-black text-foundation">Arquivar obra</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-graphite/65">
                    A obra sai da lista principal, mas todos os dados continuam salvos.
                  </p>
                  <button className="mt-4 h-11 rounded-[8px] bg-foundation px-4 text-sm font-black text-white">
                    Arquivar obra
                  </button>
                </div>
                <div className="rounded-[8px] border border-red-200 bg-red-50 p-4">
                  <h3 className="text-lg font-black text-red-700">Excluir obra</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-red-700/75">
                    Apenas o proprietário pode excluir. Para confirmar, digite exatamente:
                    <strong> {managerProject.name}</strong>
                  </p>
                  <input
                    placeholder={managerProject.name}
                    className="mt-4 h-12 w-full rounded-[8px] border border-red-200 bg-white px-3 text-sm outline-none"
                  />
                  <button className="mt-3 h-11 rounded-[8px] bg-red-600 px-4 text-sm font-black text-white">
                    Excluir definitivamente
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {permissionModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
          <div className="w-full max-w-md rounded-[8px] bg-white p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-foundation text-build">
                <ObrioMark size={42} />
              </span>
              <div>
                <p className="text-xs font-black uppercase text-build">
                  Obrio AI
                </p>
                <h2 className="mt-1 text-xl font-black text-foundation">
                  Permitir acesso a {permissionModal === "camera" ? "câmera" : "áudio"}?
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/65">
                  O Obrio AI usa {permissionModal === "camera" ? "fotos" : "áudio"} para receber dados da obra,
                  entender a informação e organizar no lugar certo.
                </p>
              </div>
            </div>

            {permissionDenied ? (
              <div className="mt-4 rounded-[8px] bg-concrete p-4 text-sm font-bold leading-6 text-foundation">
                Acesso recusado. Você ainda pode preencher os campos manualmente
                ou escrever sua mensagem para o Obrio AI.
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPermissionDenied(true)}
                className="h-12 rounded-[8px] border border-black/10 bg-white text-sm font-black text-foundation"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => setPermissionModal(null)}
                className="h-12 rounded-[8px] bg-foundation text-sm font-black text-white"
              >
                Permitir
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {logoutConfirmOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
          <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-foundation">Sair da conta?</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-graphite/65">
              Você será desconectado do Obrio AI neste dispositivo.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="h-12 rounded-[8px] border border-black/10 bg-white text-sm font-black text-foundation"
              >
                Cancelar
              </button>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-[8px] bg-foundation text-sm font-black text-white"
              >
                Sair
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

