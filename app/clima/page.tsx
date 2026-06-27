"use client";

import { useState } from "react";
import { CloudRain, CloudSun, Power, Wind } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Card, Metric } from "@/components/Ui";

const days = [
  { day: "Hoje", temp: "24°C", rain: "20%", note: "Bom para alvenaria" },
  { day: "Ter", temp: "26°C", rain: "10%", note: "Condições favoráveis" },
  { day: "Qua", temp: "23°C", rain: "35%", note: "Acompanhar céu" },
  { day: "Qui", temp: "21°C", rain: "80%", note: "Evite pintura externa" },
  { day: "Sex", temp: "22°C", rain: "60%", note: "Risco de atraso" },
  { day: "Sáb", temp: "25°C", rain: "15%", note: "Bom para concretagem" },
  { day: "Dom", temp: "27°C", rain: "5%", note: "Secagem favorável" }
];

export default function ClimaPage() {
  const [whatsAppForecastEnabled, setWhatsAppForecastEnabled] = useState(true);

  return (
    <AppShell
      title="Clima"
      subtitle="Previsão da cidade cadastrada, alertas inteligentes e envio diário no WhatsApp."
    >
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Cidade" value="São Paulo" helper="SP" />
        <Metric label="Temperatura" value="24°C" helper="Hoje" />
        <Metric label="Chuva" value="20%" helper="Baixo risco" />
        <Metric label="Vento" value="12 km/h" helper="Moderado" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card>
          <div className="flex items-center gap-3">
            <CloudSun className="text-build" size={24} />
            <h2 className="text-xl font-black text-foundation">Próximos 7 dias</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {days.map((day) => (
              <div key={day.day} className="rounded-[8px] bg-concrete p-4">
                <div className="flex items-center justify-between">
                  <strong className="text-foundation">{day.day}</strong>
                  <span className="font-black text-build">{day.temp}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-graphite/60">
                  Chuva {day.rain}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/70">
                  {day.note}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-[#EAF4EF]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <WhatsAppIcon size={28} />
                <h2 className="mt-4 text-xl font-black text-foundation">
                  Previsão diária no WhatsApp
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-graphite/70">
                  Enviar todos os dias às 8h da manhã a previsão do dia para o
                  local da obra.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWhatsAppForecastEnabled((value) => !value)}
                className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-[8px] px-4 text-sm font-black ${
                  whatsAppForecastEnabled
                    ? "bg-foundation text-white"
                    : "bg-white text-foundation"
                }`}
              >
                <Power size={17} className="text-build" />
                {whatsAppForecastEnabled ? "Ligado" : "Desligado"}
              </button>
            </div>
            <div className="mt-4 rounded-[8px] bg-white p-4 text-sm font-semibold leading-6 text-graphite/70">
              Amanhã às 8h: "Bom dia. Previsão para Casa Vila Mariana: 24°C,
              chuva 20%, vento moderado. Condições boas para alvenaria."
            </div>
          </Card>

          <Card className="bg-[#EAF4EF]">
            <CloudRain className="text-build" size={25} />
            <h2 className="mt-4 text-xl font-black text-foundation">
              Avisos inteligentes
            </h2>
            <div className="mt-4 grid gap-3">
              <p className="rounded-[8px] bg-white p-3 text-sm font-bold text-graphite/70">
                Chuva prevista para quinta-feira.
              </p>
              <p className="rounded-[8px] bg-white p-3 text-sm font-bold text-graphite/70">
                Evite pintura externa.
              </p>
              <p className="rounded-[8px] bg-white p-3 text-sm font-bold text-graphite/70">
                Condições favoráveis para concretagem no sábado.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-foundation">
              <Wind size={17} className="text-build" />
              Umidade 68%
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
