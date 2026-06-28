import { fetchWeatherForCity } from "@/lib/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const state = searchParams.get("state")?.trim() ?? undefined;

  if (!city) {
    return Response.json({ error: "Informe city" }, { status: 400 });
  }

  try {
    const weather = await fetchWeatherForCity(city, state);
    if (!weather) {
      return Response.json({ error: "Cidade não encontrada" }, { status: 404 });
    }
    return Response.json(weather);
  } catch {
    return Response.json({ error: "Falha ao consultar clima" }, { status: 502 });
  }
}
