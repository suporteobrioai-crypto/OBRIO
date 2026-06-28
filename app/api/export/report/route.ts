import { buildReportText, type ReportPayload } from "@/lib/report-export";

export async function POST(request: Request) {
  let payload: ReportPayload;
  try {
    payload = (await request.json()) as ReportPayload;
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!payload.obraName?.trim()) {
    return Response.json({ error: "obraName obrigatório" }, { status: 400 });
  }

  const text = buildReportText({
    ...payload,
    generatedAt: payload.generatedAt || new Date().toLocaleString("pt-BR")
  });

  const filename = `relatorio-${payload.obraName.replace(/\s+/g, "-").toLowerCase()}.txt`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
