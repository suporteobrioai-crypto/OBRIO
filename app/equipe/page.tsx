import { Mail, Plus, ShieldCheck, UserPlus, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Card, Field, Metric, PrimaryButton, SelectField } from "@/components/Ui";

const members = [
  {
    name: "Carlos Almeida",
    role: "Mestre de obras",
    project: "Casa Vila Mariana",
    whatsapp: "(11) 98888-1010",
    status: "Ativo"
  },
  {
    name: "Marina Costa",
    role: "Gerente da obra",
    project: "Reforma Loja Centro",
    whatsapp: "(11) 97777-2020",
    status: "Convite enviado"
  }
];

export default function EquipePage() {
  return (
    <AppShell
      title="Equipe"
      subtitle="Cadastre gerentes e mestres de obra com acesso limitado por projeto."
      action={
        <PrimaryButton>
          <Plus size={18} />
          Colaborador
        </PrimaryButton>
      }
    >
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Plano atual" value="Mensal" helper="Até 3 obras" />
        <Metric label="Colaboradores" value="2/3" helper="Limite do plano" />
        <Metric label="Obras ativas" value="2/3" helper="Simultâneas" />
        <Metric label="Permissão" value="Por obra" helper="Sem acesso cruzado" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[440px_1fr]">
        <Card>
          <div className="flex items-center gap-3">
            <UserPlus className="text-build" size={24} />
            <h2 className="text-xl font-black text-foundation">
              Cadastrar colaborador
            </h2>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-graphite/62">
            Use para adicionar gerente, mestre de obras ou responsável por uma
            obra. Ele só verá os projetos atribuídos.
          </p>

          <div className="mt-4 grid gap-4">
            <Field label="Nome" placeholder="Carlos Almeida" />
            <Field label="Email" placeholder="gerente@email.com" type="email" />
            <Field label="WhatsApp" placeholder="(11) 99999-9999" />
            <SelectField
              label="Função"
              options={[
                "Mestre de obras",
                "Gerente da obra",
                "Encarregado",
                "Administrativo",
                "Sócio",
                "Outro"
              ]}
            />
            <SelectField
              label="Obra permitida"
              options={[
                "Casa Vila Mariana",
                "Reforma Loja Centro",
                "Galpão Zona Norte"
              ]}
            />
            <SelectField
              label="Permissões"
              options={[
                "Operacional: diário, fotos, materiais e lembretes",
                "Financeiro limitado",
                "Financeiro completo",
                "Somente leitura"
              ]}
            />
            <Field label="Senha provisória" placeholder="Criar ou enviar convite" />
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <Users className="text-build" size={24} />
              <h2 className="text-xl font-black text-foundation">
                Colaboradores cadastrados
              </h2>
            </div>
            <div className="mt-4 grid gap-3">
              {members.map((member) => (
                <div key={member.name} className="rounded-[8px] bg-concrete p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-black text-foundation">{member.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-graphite/62">
                        {member.role} · {member.project}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-[8px] bg-white px-2 py-1 text-xs font-black text-foundation">
                          <Mail size={13} className="text-build" />
                          Email
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-[8px] bg-white px-2 py-1 text-xs font-black text-foundation">
                          <WhatsAppIcon size={14} />
                          {member.whatsapp}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-[8px] bg-white px-3 py-2 text-xs font-black text-foundation">
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-[#EAF4EF]">
            <ShieldCheck className="text-build" size={25} />
            <h2 className="mt-4 text-xl font-black text-foundation">
              Regra de acesso
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-graphite/70">
              O dono vê todas as obras. O gerente ou mestre só vê a obra em que
              foi colocado. Exemplo: gerente da segunda obra não acessa o painel
              da primeira obra.
            </p>
            <div className="mt-4 grid gap-2 text-sm font-bold text-foundation">
              <p>Free teste: 1 obra, sem colaborador pago.</p>
              <p>Mensal: até 3 obras simultâneas e 3 colaboradores.</p>
              <p>Anual: até 10 obras simultâneas e 10 colaboradores.</p>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
