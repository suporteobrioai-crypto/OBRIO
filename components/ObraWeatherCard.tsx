"use client";

import { useEffect, useState } from "react";
import { CloudRain } from "lucide-react";
import { Card } from "@/components/Ui";
import type { WeatherSnapshot } from "@/lib/weather";

type ObraWeatherCardProps = {
  city: string;
  state?: string;
};

export function ObraWeatherCard({ city, state }: ObraWeatherCardProps) {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ city });
        if (state) params.set("state", state);
        const response = await fetch(`/api/weather?${params.toString()}`);
        if (!response.ok) {
          if (!cancelled) setError("Clima indisponível para esta cidade.");
          return;
        }
        const data = (await response.json()) as WeatherSnapshot;
        if (!cancelled) setWeather(data);
      } catch {
        if (!cancelled) setError("Não foi possível carregar o clima.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [city, state]);

  if (loading) {
    return (
      <Card>
        <p className="text-sm font-semibold text-graphite/60">Carregando clima da obra…</p>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <p className="text-sm font-semibold text-graphite/60">
          {error ?? "Clima indisponível."}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-build">Clima da obra</p>
          <h2 className="mt-1 text-xl font-black text-foundation">Previsão para {weather.city}</h2>
        </div>
        <CloudRain size={24} className="shrink-0 text-build" aria-hidden />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[230px_1fr]">
        <div className="rounded-[8px] bg-foundation p-5 text-white">
          <p className="text-4xl font-black">{weather.currentTemp}</p>
          <p className="mt-2 font-black">{weather.currentCondition}</p>
          <p className="mt-1 text-sm font-semibold text-white/70">
            Chance de chuva: {weather.rainChance}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
          {weather.forecast.map((day) => (
            <div
              key={day.day}
              className={`rounded-[8px] p-3 text-center ${
                day.favorable ? "bg-[#EAF4EF]" : "bg-[#FFF0E5]"
              }`}
            >
              <p className="text-xs font-black text-foundation">{day.day}</p>
              <p className="mt-2 text-lg font-black text-foundation">{day.temperature}</p>
              <p className="mt-1 text-xs font-bold text-graphite/60">{day.condition}</p>
              <p className="mt-1 text-xs font-black text-build">{day.rain}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
