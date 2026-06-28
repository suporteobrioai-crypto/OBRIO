"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildCreateObraPayload } from "@/lib/obras";
import { normalizeObraType, parseBudgetToCents } from "@/lib/format";
import { CheckCircle2, ChevronLeft, Keyboard, Mic, Send, Upload, X } from "lucide-react";
import { Brand } from "@/components/Brand";
import { ObrioMark } from "@/components/ObrioMark";

type FormState = {
  name: string;
  projectType: string;
  propertyType: string;
  city: string;
  state: string;
  useWeatherLocation: boolean;
  role: string;
  area: string;
  doesNotKnowArea: boolean;
  projectFile: string;
  currentPhotos: string;
  hasBudget: string;
  budgetTotal: string;
  budgetMaterials: string;
  budgetLabor: string;
  deliveryDate: string;
  doesNotKnowDelivery: boolean;
  teamSize: string;
  goals: string[];
};

const initialForm: FormState = {
  name: "",
  projectType: "Reforma",
  propertyType: "Residencial",
  city: "",
  state: "",
  useWeatherLocation: false,
  role: "Proprietário",
  area: "",
  doesNotKnowArea: false,
  projectFile: "Sim, enviar depois",
  currentPhotos: "Sim, enviar depois",
  hasBudget: "Ainda não sei",
  budgetTotal: "",
  budgetMaterials: "",
  budgetLabor: "",
  deliveryDate: "",
  doesNotKnowDelivery: false,
  teamSize: "1 a 3",
  goals: ["Gastos e materiais", "Lembretes"]
};

const roles = [
  "Proprietário",
  "Construtor",
  "Mestre de Obras",
  "Empreiteiro",
  "Investidor de Imóveis",
  "Corretor de Imóveis",
  "Arquiteto",
  "Engenheiro"
];

const goals = [
  "Gastos e materiais",
  "Pagamentos da equipe (mão de obra)",
  "Fotos da obra",
  "Documentos e garantias",
  "Lembretes",
  "Clima",
  "Relatórios para clientes",
  "Tudo isso"
];

const totalSteps = 11;

const aiStepExamples: Record<number, { helper: string; placeholder: string }> = {
  1: {
    helper: "Diga o nome da obra ou reforma.",
    placeholder: "Ex: Reforma Apartamento 402"
  },
  2: {
    helper: "Diga se é uma obra completa começando do zero ou uma reforma em imóvel existente.",
    placeholder: "Ex: É uma reforma em um imóvel que já existe"
  },
  3: {
    helper: "Diga se o imóvel é residencial ou comercial.",
    placeholder: "Ex: É residencial, uma casa"
  },
  4: {
    helper: "Diga a cidade e o estado onde fica a obra. O clima será calculado por esse local.",
    placeholder: "Ex: A obra fica em São Paulo, SP"
  },
  5: {
    helper: "Diga qual é o seu papel: proprietário, construtor, mestre de obras, empreiteiro, corretor, arquiteto ou engenheiro.",
    placeholder: "Ex: Sou o proprietário da obra"
  },
  6: {
    helper: "Diga a área aproximada em metros quadrados. Se não souber, diga que não sabe informar agora.",
    placeholder: "Ex: Tem aproximadamente 120 m²"
  },
  7: {
    helper: "Diga se possui planta ou projeto: enviar agora, enviar depois ou não possui.",
    placeholder: "Ex: Tenho projeto e envio depois"
  },
  8: {
    helper: "Diga se já sabe quanto pretende gastar. Se souber, fale valor total, materiais e mão de obra.",
    placeholder: "Ex: Pretendo gastar até R$ 80 mil"
  },
  9: {
    helper: "Diga a data prevista de entrega. Se ainda não souber, diga que ainda não sabe.",
    placeholder: "Ex: Entrega prevista para dezembro de 2026"
  },
  10: {
    helper: "Diga quantas pessoas trabalham em média: apenas você, 1 a 3, 4 a 10, 11 a 20 ou mais de 20.",
    placeholder: "Ex: De 1 a 3 pessoas"
  },
  11: {
    helper: "Diga o que quer organizar: gastos, materiais, equipe, fotos, documentos, lembretes, clima, relatórios ou tudo isso.",
    placeholder: "Ex: Quero organizar gastos, materiais e equipe"
  }
};

const stepTopHints: Record<number, string> = {
  1: "Exemplo: Reforma Ap 402 ou Casa Recanto Verde",
  2: "Diga se é uma reforma ou uma obra nova do zero",
  3: "Diga se é residencial ou comercial",
  4: "Informe a cidade e o estado onde fica a obra",
  5: "Diga seu papel na obra. Exemplo: proprietário",
  6: "Diga a área aproximada ou que não sabe informar agora",
  7: "Diga se vai enviar projeto agora, depois ou se não possui",
  8: "Diga se já sabe o orçamento ou se ainda não sabe",
  9: "Diga a data prevista ou que ainda não sabe",
  10: "Diga a quantidade média de pessoas trabalhando",
  11: "Diga o que quer organizar nesta obra"
};

function StepHint({ step }: { step: number }) {
  return (
    <p className="mt-2 text-sm font-semibold text-graphite/52">
      {stepTopHints[step]}
    </p>
  );
}

function TextInput({
  label,
  value,
  placeholder,
  type = "text",
  disabled = false,
  onChange
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-sm font-semibold text-graphite/45">
          {label}
        </span>
      ) : null}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-[8px] border border-graphite/24 bg-white px-4 text-base font-bold text-foundation outline-none transition placeholder:text-graphite/22 focus:border-build focus:ring-2 focus:ring-build/20 disabled:bg-concrete disabled:text-graphite/38"
      />
    </label>
  );
}

function OptionCard({
  title,
  subtitle,
  selected,
  badge,
  icon,
  brandIcon = false,
  voiceIcon = false,
  onClick
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  badge?: string;
  icon?: string;
  brandIcon?: boolean;
  voiceIcon?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[8px] border p-4 text-left transition ${
        selected
          ? "border-build bg-[#fffdf7] shadow-[0_0_0_1px_rgba(241,123,34,0.34)]"
          : "border-transparent bg-white hover:bg-concrete"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3 text-lg font-black text-foundation">
          {brandIcon ? (
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-foundation">
              <ObrioMark size={40} />
            </span>
          ) : icon ? (
            <span>{icon}</span>
          ) : null}
          <span>{title}</span>
        </span>
        {voiceIcon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-build text-white">
            <Mic size={19} />
          </span>
        ) : false && badge ? (
          <span className="rounded-full bg-build/12 px-3 py-1 text-xs font-black text-build">
            {badge}
          </span>
        ) : null}
      </span>
      {subtitle ? (
        <span className="mt-2 block text-sm font-semibold leading-5 text-graphite/48">
          {subtitle}
        </span>
      ) : null}
    </button>
  );
}

function RadioRow({
  label,
  selected,
  onClick
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-14 w-full items-center justify-between border-b border-graphite/20 text-left text-base font-bold text-graphite last:border-b-0"
    >
      <span className={selected ? "font-black text-foundation" : ""}>{label}</span>
      <span
        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
          selected ? "border-build" : "border-graphite/18"
        }`}
      >
        {selected ? <span className="h-2.5 w-2.5 rounded-full bg-build" /> : null}
      </span>
    </button>
  );
}

function CheckRow({
  label,
  checked,
  onClick
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center gap-3 rounded-[8px] bg-concrete px-3 text-left text-sm font-black text-foundation"
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-[6px] border ${
          checked ? "border-build bg-build text-white" : "border-graphite/20 bg-white"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}

export default function NovaObraPage() {
  const router = useRouter();
  const [modeSelected, setModeSelected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showAiPermission, setShowAiPermission] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [aiText, setAiText] = useState("");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [created, setCreated] = useState(false);

  const progress = useMemo(() => (step / totalSteps) * 100, [step]);

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleGoal(goal: string) {
    setForm((current) => {
      if (goal === "Tudo isso") {
        const allSelected = current.goals.length === goals.length;
        return { ...current, goals: allSelected ? [] : goals };
      }
      const exists = current.goals.includes(goal);
      const nextGoals = exists
        ? current.goals.filter((item) => item !== goal && item !== "Tudo isso")
        : [...current.goals.filter((item) => item !== "Tudo isso"), goal];
      return { ...current, goals: nextGoals };
    });
  }

  async function saveObra() {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setSaveError("Faça login para criar uma obra.");
        return;
      }

      const payload = buildCreateObraPayload(
        {
          name: form.name,
          type: normalizeObraType(form.projectType),
          city: form.city || undefined,
          state: form.state || undefined,
          budget_cents:
            form.hasBudget === "Sim"
              ? parseBudgetToCents(form.budgetTotal)
              : 0,
          delivery_date: form.doesNotKnowDelivery ? null : form.deliveryDate || null,
          responsible: form.role,
          property_type: form.propertyType || undefined,
          area_sqm: form.doesNotKnowArea || !form.area
            ? null
            : Number.parseFloat(form.area.replace(/[^\d.,]/g, "").replace(",", ".")) || null,
          goals: form.goals
        },
        user.id
      );

      const { error } = await supabase.from("obras").insert(payload);
      if (error) {
        setSaveError(error.message);
        return;
      }

      setCreated(true);
      router.refresh();
    } catch {
      setSaveError("Configure as variáveis do Supabase em .env.local");
    } finally {
      setSaving(false);
    }
  }

  function next() {
    if (!modeSelected) {
      setModeSelected(true);
      return;
    }
    if (step === totalSteps) {
      void saveObra();
      return;
    }
    setStep((current) => Math.min(totalSteps, current + 1));
  }

  function previous() {
    if (step === 1) {
      setAiMode(false);
      setModeSelected(false);
      return;
    }
    setStep((current) => Math.max(1, current - 1));
  }

  function finishAiCadastro(sourceText = aiText) {
    const firstWords = sourceText.trim().split(/\s+/).slice(0, 4).join(" ");
    if (firstWords) {
      update("name", firstWords);
    }
    setAiMode(false);
    setModeSelected(true);
    setCreated(true);
  }

  function answerWithAi(sourceText = aiText) {
    const text = sourceText.trim();
    if (step === 1 && text) {
      update("name", text.split(/\s+/).slice(0, 5).join(" "));
    }
    setAiText("");
    next();
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-graphite">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1fr_360px]">
        <section className="flex min-h-screen justify-center bg-white px-5 py-6 sm:bg-[#f7f8f6] md:px-8">
          <div className="flex min-h-[calc(100svh-48px)] w-full max-w-[470px] flex-col rounded-none bg-white sm:min-h-[820px] sm:rounded-[28px] sm:border-[6px] sm:border-black/10 sm:px-8 sm:py-8 sm:shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-black tracking-normal text-foundation">
                Cadastrar Nova Obra
              </h1>
              {modeSelected && !created ? (
                <span className="shrink-0 text-sm font-black text-build">
                  Passo {step} de {totalSteps}
                </span>
              ) : null}
            </div>

            {modeSelected && !created ? (
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-concrete">
                <div
                  className="h-full rounded-full bg-build transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : null}

            {saveError ? (
              <p className="mt-4 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {saveError}
              </p>
            ) : null}

            {created ? (
              <div className="flex flex-1 flex-col justify-center">
                <div className="text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-[8px] bg-[#EAF4EF] text-moss">
                    <CheckCircle2 size={34} />
                  </span>
                  <h2 className="mt-5 text-2xl font-black text-foundation">
                    Sua obra foi criada com sucesso!
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-6 text-graphite/58">
                    Agora o Obrio AI pode ajudar você a organizar tudo o que
                    acontece na sua obra.
                  </p>
                </div>
                <div className="mt-6 grid gap-2 text-sm font-black text-foundation">
                  {[
                    "Gastos e materiais",
                    "Pagamentos da equipe (mão de obra)",
                    "Fotos da obra",
                    "Documentos e garantias",
                    "Lembretes",
                    "Clima",
                    "Relatórios"
                  ].map((item) => (
                    <div key={item} className="rounded-[8px] bg-concrete px-3 py-2">
                      ✅ {item}
                    </div>
                  ))}
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-foundation text-sm font-black text-white"
                >
                  Abrir Painel da Obra
                </Link>
              </div>
            ) : false ? (
              <>
                <div className="mt-9 flex-1">
                  <div className="flex items-start gap-3 rounded-[8px] bg-concrete p-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-foundation">
                      <ObrioMark size={44} />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase text-build">
                        Obrio AI
                      </p>
                      <h2 className="mt-1 text-xl font-black leading-tight text-foundation">
                        Cadastrar por áudio ou texto
                      </h2>
                      <p className="mt-2 text-sm font-semibold leading-6 text-graphite/62">
                        Me conte o nome da obra, cidade, tipo de projeto,
                        orçamento e prazo. Eu vou preencher o cadastro para você.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-[8px] bg-white p-4 text-sm font-bold leading-6 text-graphite/70 shadow-soft">
                      Pode mandar por áudio ou escrever. Nesta etapa do quiz não
                      vamos pedir foto.
                    </div>
                    <textarea
                      value={aiText}
                      onChange={(event) => setAiText(event.target.value)}
                      placeholder="Ex: reforma da casa Vila Mariana, em São Paulo, quero controlar gastos, equipe e prazo..."
                      className="min-h-32 w-full resize-none rounded-[8px] border border-black/10 p-4 text-sm font-semibold leading-6 outline-none placeholder:text-graphite/35 focus:border-build"
                    />
                    <div className="grid grid-cols-[1fr_54px] gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const text =
                            aiText.trim() ||
                            "Cadastro por áudio: obra informada pelo usuário.";
                          setAiText(text);
                          finishAiCadastro(text);
                        }}
                        className="inline-flex h-14 items-center justify-center gap-2 rounded-[8px] bg-foundation text-sm font-black text-white"
                      >
                        <Mic size={19} className="text-build" />
                        Gravar áudio
                      </button>
                      <button
                        type="button"
                        onClick={() => finishAiCadastro()}
                        className="grid h-14 place-items-center rounded-[8px] bg-build text-white"
                        title="Enviar"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAiMode(false);
                    setModeSelected(true);
                  }}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-[8px] border border-graphite/24 bg-white text-sm font-black text-foundation"
                >
                  <Keyboard size={18} />
                  Usar Cadastro Guiado
                </button>
              </>
            ) : !modeSelected ? (
              <>
                <div className="mt-9 flex-1">
                  <h2 className="text-2xl font-black leading-tight text-foundation">
                    Como você deseja cadastrar sua obra?
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-graphite/52">
                    Escolha a forma mais rápida para começar.
                  </p>
                  <div className="mt-7 grid gap-3">
                    <OptionCard
                      icon=""
                      title="Cadastro Guiado"
                      subtitle="Preencha sua obra passo a passo."
                      selected
                      onClick={() => setModeSelected(true)}
                    />
                    <OptionCard
                      title="Conversar com Obrio AI"
                      subtitle="Responda algumas perguntas por áudio ou texto. O Obrio AI preencherá sua obra automaticamente."
                      selected={false}
                      brandIcon
                      voiceIcon
                      onClick={() => {
                        setPermissionDenied(false);
                        setShowAiPermission(true);
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex h-14 items-center justify-center rounded-[8px] bg-foundation text-sm font-black text-white shadow-soft"
                >
                  Continuar com Cadastro Guiado
                </button>
              </>
            ) : (
              <>
                <div className="mt-9 flex-1">
                  {false && aiMode ? (
                    <div className="mb-6 rounded-[8px] bg-concrete p-4">
                      <div className="flex items-start gap-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-foundation">
                          <ObrioMark size={44} />
                        </span>
                        <div>
                          <p className="text-xs font-black uppercase text-build">
                            Obrio AI
                          </p>
                          <h2 className="mt-1 text-lg font-black leading-tight text-foundation">
                            Responda por áudio ou texto
                          </h2>
                          <p className="mt-1 text-sm font-semibold leading-6 text-graphite/62">
                            Você pode preencher o campo abaixo ou me responder
                            aqui. Eu sigo para a próxima pergunta do cadastro.
                          </p>
                        </div>
                      </div>
                      <textarea
                        value={aiText}
                        onChange={(event) => setAiText(event.target.value)}
                        placeholder="Escreva sua resposta para esta pergunta..."
                        className="mt-4 min-h-24 w-full resize-none rounded-[8px] border border-black/10 bg-white p-3 text-sm font-semibold leading-6 outline-none placeholder:text-graphite/35 focus:border-build"
                      />
                      <div className="mt-3 grid grid-cols-[1fr_54px] gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const text =
                              aiText.trim() ||
                              "Resposta enviada por áudio para esta etapa.";
                            setAiText(text);
                            answerWithAi(text);
                          }}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-foundation text-sm font-black text-white"
                        >
                          <Mic size={18} className="text-build" />
                          Gravar áudio
                        </button>
                        <button
                          type="button"
                          onClick={() => answerWithAi()}
                          className="grid h-12 place-items-center rounded-[8px] bg-build text-white"
                          title="Enviar resposta"
                        >
                          <Send size={19} />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {step === 1 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Qual o nome da sua obra ou reforma?
                      </h2>
                      <p className="mt-2 text-sm font-semibold text-graphite/52">
                        Exemplo: Reforma Ap 402 ou Casa Recanto Verde
                      </p>
                      <div className={`${aiMode ? "hidden" : ""} mt-7`}>
                        <TextInput
                          label="Nome da obra"
                          value={form.name}
                          placeholder="Casa Vila Mariana"
                          onChange={(value) => update("name", value)}
                        />
                      </div>
                      <div className={`${aiMode ? "hidden" : ""} mt-5 rounded-[8px] bg-concrete p-4 text-sm font-bold leading-6 text-graphite/62`}>
                        <p className="font-black text-foundation">Exemplos:</p>
                        <p>Reforma Apartamento 402</p>
                        <p>Casa Recanto Verde</p>
                        <p>Loja Centro</p>
                        <p>Casa Praia do Forte</p>
                      </div>
                    </div>
                  ) : null}

                  {step === 2 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Qual o tipo de projeto?
                      </h2>
                      <StepHint step={2} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-3`}>
                        <OptionCard
                          title="Obra Completa"
                          subtitle="Construção iniciando do zero."
                          selected={form.projectType === "Obra Completa"}
                          onClick={() => update("projectType", "Obra Completa")}
                        />
                        <OptionCard
                          title="Reforma"
                          subtitle="Melhorias ou alterações em imóvel existente."
                          selected={form.projectType === "Reforma"}
                          onClick={() => update("projectType", "Reforma")}
                        />
                      </div>
                    </div>
                  ) : null}

                  {step === 3 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Qual o tipo de imóvel?
                      </h2>
                      <StepHint step={3} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-3`}>
                        <OptionCard
                          title="Residencial"
                          subtitle="Casas, apartamentos e condomínios."
                          selected={form.propertyType === "Residencial"}
                          onClick={() => update("propertyType", "Residencial")}
                        />
                        <OptionCard
                          title="Comercial"
                          subtitle="Lojas, salas comerciais e galpões."
                          selected={form.propertyType === "Comercial"}
                          onClick={() => update("propertyType", "Comercial")}
                        />
                      </div>
                    </div>
                  ) : null}

                  {step === 4 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Onde fica a obra?
                      </h2>
                      <StepHint step={4} />
                      <p className="mt-2 text-sm font-semibold leading-6 text-graphite/58">
                        O clima será calculado pela cidade da obra, mesmo se você
                        morar em outro local.
                      </p>
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-5`}>
                        <TextInput
                          label="Cidade"
                          value={form.city}
                          placeholder="São Paulo"
                          onChange={(value) => update("city", value)}
                        />
                        <TextInput
                          label="Estado (UF)"
                          value={form.state}
                          placeholder="SP"
                          onChange={(value) => update("state", value.toUpperCase())}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLocationPermission(true)}
                          className="flex items-start gap-3 rounded-[8px] bg-concrete p-4 text-left"
                        >
                          <span
                            className={`mt-0.5 grid h-5 w-5 place-items-center rounded-[6px] border ${
                              form.useWeatherLocation
                                ? "border-build bg-build text-white"
                                : "border-graphite/20 bg-white"
                            }`}
                          >
                            {form.useWeatherLocation ? "✓" : ""}
                          </span>
                          <span>
                            <span className="block text-sm font-black text-foundation">
                              Usar minha localização atual para preencher automaticamente
                            </span>
                            <span className="mt-1 block text-sm font-semibold leading-6 text-graphite/58">
                              Use apenas se você estiver no local da obra agora.
                              Depois, o Obrio enviará alertas de clima para essa cidade.
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {step === 5 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Qual é o seu papel nesta obra?
                      </h2>
                      <StepHint step={5} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7`}>
                        {roles.map((role) => (
                          <RadioRow
                            key={role}
                            label={role}
                            selected={form.role === role}
                            onClick={() => update("role", role)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {step === 6 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Qual a área aproximada da obra ou reforma?
                      </h2>
                      <StepHint step={6} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-4`}>
                        <TextInput
                          label="Área em metros quadrados (m²)"
                          value={form.area}
                          placeholder="128"
                          type="number"
                          disabled={form.doesNotKnowArea}
                          onChange={(value) => update("area", value)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            update("doesNotKnowArea", !form.doesNotKnowArea);
                            if (!form.doesNotKnowArea) update("area", "");
                          }}
                          className={`h-12 rounded-[8px] border text-sm font-black ${
                            form.doesNotKnowArea
                              ? "border-build bg-[#fffdf7] text-foundation"
                              : "border-black/10 bg-white text-foundation"
                          }`}
                        >
                          ⭕ Não sei informar agora
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {step === 7 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Você possui planta ou projeto?
                      </h2>
                      <StepHint step={7} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-3`}>
                        {[
                          ["Sim, enviar agora", "Anexar arquivos de engenharia ou imagens"],
                          ["Sim, enviar depois", "Tenho, mas vou carregar depois"],
                          ["Não possuo", "Estarei construindo sem projeto formal"]
                        ].map(([title, subtitle]) => (
                          <OptionCard
                            key={title}
                            title={title}
                            subtitle={subtitle}
                            selected={form.projectFile === title}
                            onClick={() => update("projectFile", title)}
                          />
                        ))}
                      </div>
                      {!aiMode && form.projectFile === "Sim, enviar agora" ? (
                        <button className="mt-5 flex h-14 w-full items-center justify-between rounded-[8px] border border-dashed border-build/70 bg-[#fffdf7] px-4 text-sm font-black text-foundation">
                          Escolher arquivo
                          <Upload size={19} className="text-build" />
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {step === 99 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Você possui fotos atuais da obra?
                      </h2>
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-3`}>
                        {[
                          ["Sim, enviar agora", ""],
                          ["Sim, enviar depois", ""],
                          ["Ainda não tenho fotos", ""]
                        ].map(([title, icon]) => (
                          <OptionCard
                            key={title}
                            icon={icon}
                            title={title}
                            selected={form.currentPhotos === title}
                            onClick={() => update("currentPhotos", title)}
                          />
                        ))}
                      </div>
                      {!aiMode && form.currentPhotos === "Sim, enviar agora" ? (
                        <button className="mt-5 flex h-14 w-full items-center justify-between rounded-[8px] border border-dashed border-build/70 bg-[#fffdf7] px-4 text-sm font-black text-foundation">
                          Enviar fotos da obra
                          <Upload size={19} className="text-build" />
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {step === 8 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Você já sabe quanto pretende gastar?
                      </h2>
                      <StepHint step={8} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-3`}>
                        <OptionCard
                          title="Sim"
                          subtitle="Desejo configurar limite financeiro"
                          selected={form.hasBudget === "Sim"}
                          onClick={() => update("hasBudget", "Sim")}
                        />
                        <OptionCard
                          title="Ainda não sei"
                          subtitle="Sem problema. O Obrio ajudará você a acompanhar os gastos reais da obra."
                          selected={form.hasBudget === "Ainda não sei"}
                          onClick={() => update("hasBudget", "Ainda não sei")}
                        />
                      </div>
                      {!aiMode && form.hasBudget === "Sim" ? (
                        <div className="mt-6 grid gap-4">
                          <TextInput
                            label="Valor total"
                            value={form.budgetTotal}
                            placeholder="180000"
                            type="number"
                            onChange={(value) => update("budgetTotal", value)}
                          />
                          <TextInput
                            label="Materiais"
                            value={form.budgetMaterials}
                            placeholder="95000"
                            type="number"
                            onChange={(value) => update("budgetMaterials", value)}
                          />
                          <TextInput
                            label="Mão de obra"
                            value={form.budgetLabor}
                            placeholder="65000"
                            type="number"
                            onChange={(value) => update("budgetLabor", value)}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {step === 9 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Qual a data prevista de entrega?
                      </h2>
                      <StepHint step={9} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-4`}>
                        <TextInput
                          label="Previsão de término"
                          value={form.deliveryDate}
                          placeholder="15/12/2026"
                          type="date"
                          disabled={form.doesNotKnowDelivery}
                          onChange={(value) => update("deliveryDate", value)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            update("doesNotKnowDelivery", !form.doesNotKnowDelivery);
                            if (!form.doesNotKnowDelivery) update("deliveryDate", "");
                          }}
                          className={`h-12 rounded-[8px] border text-sm font-black ${
                            form.doesNotKnowDelivery
                              ? "border-build bg-[#fffdf7] text-foundation"
                              : "border-black/10 bg-white text-foundation"
                          }`}
                        >
                          ⭕ Ainda não sei
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {step === 10 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        Qual a quantidade média de pessoas trabalhando na obra?
                      </h2>
                      <StepHint step={10} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7`}>
                        {["Apenas eu", "1 a 3", "4 a 10", "11 a 20", "Mais de 20"].map(
                          (option) => (
                            <RadioRow
                              key={option}
                              label={option}
                              selected={form.teamSize === option}
                              onClick={() => update("teamSize", option)}
                            />
                          )
                        )}
                      </div>
                    </div>
                  ) : null}

                  {step === 11 ? (
                    <div>
                      <h2 className="text-2xl font-black leading-tight text-foundation">
                        O que você mais deseja organizar nesta obra?
                      </h2>
                      <StepHint step={11} />
                      <div className={`${aiMode ? "hidden" : ""} mt-7 grid gap-2`}>
                        {goals.map((goal) => (
                          <CheckRow
                            key={goal}
                            label={goal}
                            checked={form.goals.includes(goal)}
                            onClick={() => toggleGoal(goal)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {aiMode ? (
                  <div className="mt-5 rounded-[8px] bg-concrete p-4">
                    <div className="flex items-start gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-foundation">
                        <ObrioMark size={44} />
                      </span>
                      <div>
                        <p className="text-xs font-black uppercase text-build">
                          Obrio AI
                        </p>
                        <h2 className="mt-1 text-2xl font-black leading-tight text-foundation">
                          Responda por áudio ou texto
                        </h2>
                        <p className="mt-2 text-base font-black leading-7 text-graphite/72">
                          {aiStepExamples[step]?.helper}
                        </p>
                      </div>
                    </div>
                    <textarea
                      value={aiText}
                      onChange={(event) => setAiText(event.target.value)}
                      placeholder={aiStepExamples[step]?.placeholder || "Escreva sua resposta para esta pergunta..."}
                      className="mt-4 min-h-24 w-full resize-none rounded-[8px] border border-black/10 bg-white p-3 text-base font-semibold leading-7 outline-none placeholder:text-graphite/38 focus:border-build"
                    />
                    <div className="mt-3 grid grid-cols-[1fr_54px] gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const text =
                            aiText.trim() ||
                            "Resposta enviada por áudio para esta etapa.";
                          setAiText(text);
                          answerWithAi(text);
                        }}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-foundation text-sm font-black text-white"
                      >
                        <Mic size={18} className="text-build" />
                        Gravar áudio
                      </button>
                      <button
                        type="button"
                        onClick={() => answerWithAi()}
                        className="grid h-12 place-items-center rounded-[8px] bg-build text-white"
                        title="Enviar resposta"
                      >
                        <Send size={19} />
                      </button>
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3 pb-2 pt-5">
                  <button
                    type="button"
                    onClick={previous}
                    className="inline-flex h-14 items-center justify-center rounded-[8px] border border-graphite/24 bg-white text-sm font-black text-foundation"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={next}
                    className="inline-flex h-14 items-center justify-center rounded-[8px] bg-foundation text-sm font-black text-white shadow-soft disabled:opacity-60"
                  >
                    {step === totalSteps
                      ? saving
                        ? "Salvando..."
                        : "Finalizar Cadastro"
                      : "Avançar"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <aside className="hidden border-l border-black/5 bg-white p-6 lg:block">
          <Brand />
          <div className="mt-8 rounded-[8px] bg-concrete p-4">
            <p className="text-xs font-black uppercase text-build">Resumo</p>
            <h2 className="mt-2 text-xl font-black text-foundation">
              {form.name || "Nova obra"}
            </h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-graphite/65">
              <p>Projeto: {form.projectType}</p>
              <p>Imóvel: {form.propertyType}</p>
              <p>Local: {form.city || "Cidade"} / {form.state || "UF"}</p>
              <p>Papel: {form.role}</p>
              <p>Equipe: {form.teamSize}</p>
            </div>
          </div>
          <Link
            href="/obras"
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-black/10 text-sm font-black text-foundation"
          >
            <ChevronLeft size={17} />
            Voltar para obras
          </Link>
        </aside>
      </div>

      {showLocationPermission ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
          <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-foundation">
                  Permitir acesso à localização?
                </h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-graphite/68">
                  Use essa opção apenas se você estiver no local da obra agora.
                  O Obrio usará a cidade da obra para enviar atualizações climáticas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationPermission(false)}
                className="grid h-9 w-9 place-items-center rounded-[8px] bg-concrete text-foundation"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setShowLocationPermission(false);
                  update("useWeatherLocation", false);
                }}
                className="inline-flex h-12 items-center justify-center rounded-[8px] border border-black/10 bg-white text-sm font-black text-foundation"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => {
                  update("useWeatherLocation", true);
                  if (!form.city) update("city", "São Paulo");
                  if (!form.state) update("state", "SP");
                  setShowLocationPermission(false);
                }}
                className="inline-flex h-12 items-center justify-center rounded-[8px] bg-foundation text-sm font-black text-white"
              >
                Permitir
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showAiPermission ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
          <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Mic className="text-build" size={26} />
                <h2 className="mt-4 text-xl font-black text-foundation">
                  Permitir acesso ao áudio?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAiPermission(false)}
                className="grid h-9 w-9 place-items-center rounded-[8px] bg-concrete text-foundation"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-graphite/68">
              O Obrio AI precisa acessar seu microfone para receber áudio e
              preencher o cadastro da obra automaticamente. No quiz não vamos
              pedir foto.
            </p>
            {permissionDenied ? (
              <div className="mt-4 rounded-[8px] bg-concrete p-4 text-sm font-bold leading-6 text-foundation">
                Acesso recusado. Você poderá seguir apenas com o Cadastro Guiado.
              </div>
            ) : null}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPermissionDenied(true)}
                className="inline-flex h-12 items-center justify-center rounded-[8px] border border-black/10 bg-white text-sm font-black text-foundation"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAiPermission(false);
                  setAiMode(true);
                  setModeSelected(true);
                }}
                className="inline-flex h-12 items-center justify-center rounded-[8px] bg-foundation text-sm font-black text-white"
              >
                Permitir
              </button>
            </div>
            {permissionDenied ? (
              <button
                type="button"
                onClick={() => {
                  setShowAiPermission(false);
                  setModeSelected(true);
                }}
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-build text-sm font-black text-white"
              >
                Continuar com Cadastro Guiado
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {showAiModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
          <div className="w-full max-w-sm rounded-[8px] bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Mic className="text-build" size={26} />
                <h2 className="mt-4 text-xl font-black text-foundation">
                  Obrio AI por áudio
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="grid h-9 w-9 place-items-center rounded-[8px] bg-concrete text-foundation"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-graphite/68">
              Esta funcionalidade está em desenvolvimento e será liberada em breve.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowAiModal(false);
                setModeSelected(true);
              }}
              className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-[8px] bg-foundation text-sm font-black text-white"
            >
              Continuar com Cadastro Guiado
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
