import { Bell, LockKeyhole, Save } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Card, Field, PrimaryButton, SelectField } from "@/components/Ui";

export default function ConfiguracoesPage() {
  return (
    <AppShell
      title="Configurações"
      subtitle="Notificações, WhatsApp e permissões de acesso."
      action={
        <PrimaryButton>
          <Save size={18} />
          Salvar
        </PrimaryButton>
      }
    >
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <Bell className="text-build" size={24} />
            <h2 className="text-xl font-black text-foundation">Notificações</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              "Lembretes no aplicativo",
              "Lembretes pelo WhatsApp",
              "Alertas de atraso da obra",
              "Resumo semanal da obra"
            ].map((item) => (
              <label key={item} className="flex items-center justify-between gap-4 rounded-[8px] bg-concrete p-4">
                <span className="text-sm font-black text-foundation">{item}</span>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#22C55E]" />
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <WhatsAppIcon size={26} />
            <h2 className="text-xl font-black text-foundation">WhatsApp</h2>
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-graphite/65">
            Este número será usado para receber lembretes, clima, avisos da obra
            e enviar áudio, foto ou texto para o Obrio AI organizar no sistema.
          </p>
          <div className="mt-5 grid gap-4">
            <Field label="Número principal" placeholder="(11) 99999-9999" />
            <SelectField
              label="Receber notificações por"
              options={["Aplicativo + WhatsApp", "Somente aplicativo", "Somente WhatsApp"]}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <LockKeyhole className="text-build" size={24} />
            <h2 className="text-xl font-black text-foundation">Permissões</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              "Permitir que colaboradores vejam apenas obras liberadas",
              "Ocultar valores financeiros para perfis sem permissão",
              "Solicitar confirmação antes de excluir registros"
            ].map((item) => (
              <label key={item} className="flex items-center justify-between gap-4 rounded-[8px] bg-concrete p-4">
                <span className="text-sm font-black text-foundation">{item}</span>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#22C55E]" />
              </label>
            ))}
          </div>
        </Card>

      </section>
    </AppShell>
  );
}
