export type WeatherDay = {
  day: string;
  temperature: string;
  condition: string;
  rain: string;
  favorable: boolean;
};

export type WeatherSnapshot = {
  city: string;
  currentTemp: string;
  currentCondition: string;
  rainChance: string;
  forecast: WeatherDay[];
};

const WMO_LABELS: Record<number, string> = {
  0: "Céu limpo",
  1: "Quase limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina",
  51: "Garoa",
  53: "Garoa",
  55: "Garoa",
  61: "Chuva",
  63: "Chuva",
  65: "Chuva forte",
  80: "Pancadas",
  95: "Tempestade"
};

function wmoLabel(code: number): string {
  return WMO_LABELS[code] ?? "Variável";
}

const WEEKDAY = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

export async function fetchWeatherForCity(
  city: string,
  state?: string
): Promise<WeatherSnapshot | null> {
  const query = [city, state, "Brasil"].filter(Boolean).join(", ");
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.set("name", query);
  geoUrl.searchParams.set("count", "1");
  geoUrl.searchParams.set("language", "pt");
  geoUrl.searchParams.set("countryCode", "BR");

  const geoRes = await fetch(geoUrl.toString(), { next: { revalidate: 3600 } });
  if (!geoRes.ok) return null;
  const geoData = (await geoRes.json()) as {
    results?: { latitude: number; longitude: number; name: string }[];
  };
  const place = geoData.results?.[0];
  if (!place) return null;

  const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
  forecastUrl.searchParams.set("latitude", String(place.latitude));
  forecastUrl.searchParams.set("longitude", String(place.longitude));
  forecastUrl.searchParams.set(
    "current",
    "temperature_2m,weather_code,precipitation_probability"
  );
  forecastUrl.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,precipitation_probability_max"
  );
  forecastUrl.searchParams.set("timezone", "America/Sao_Paulo");
  forecastUrl.searchParams.set("forecast_days", "7");

  const forecastRes = await fetch(forecastUrl.toString(), { next: { revalidate: 1800 } });
  if (!forecastRes.ok) return null;
  const forecastData = (await forecastRes.json()) as {
    current?: {
      temperature_2m?: number;
      weather_code?: number;
      precipitation_probability?: number;
    };
    daily?: {
      time?: string[];
      weather_code?: number[];
      temperature_2m_max?: number[];
      precipitation_probability_max?: number[];
    };
  };

  const daily = forecastData.daily;
  const forecast: WeatherDay[] =
    daily?.time?.map((iso, index) => {
      const code = daily.weather_code?.[index] ?? 0;
      const rainPct = daily.precipitation_probability_max?.[index] ?? 0;
      const temp = daily.temperature_2m_max?.[index] ?? 0;
      const date = new Date(`${iso}T12:00:00`);
      return {
        day: WEEKDAY.format(date).replace(".", ""),
        temperature: `${Math.round(temp)}°`,
        condition: wmoLabel(code),
        rain: `${Math.round(rainPct)}%`,
        favorable: rainPct < 40
      };
    }) ?? [];

  const currentCode = forecastData.current?.weather_code ?? 0;
  const currentRain = forecastData.current?.precipitation_probability ?? 0;

  return {
    city: place.name,
    currentTemp: `${Math.round(forecastData.current?.temperature_2m ?? 0)}°C`,
    currentCondition: wmoLabel(currentCode),
    rainChance: `${Math.round(currentRain)}%`,
    forecast
  };
}
