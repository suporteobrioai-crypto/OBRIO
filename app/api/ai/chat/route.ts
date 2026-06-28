type ChatRequest = {
  message?: string;
  obraId?: string;
};

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return Response.json({ error: "Mensagem vazia" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return Response.json({
      reply:
        "Assistente em breve. Enquanto isso, use os botões + Registrar em Diário, Compras, Pagamentos e Lembretes.",
      persisted: false,
      mode: "stub"
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é o assistente Obrio AI para gestão de obras. Responda em português do Brasil, de forma objetiva."
          },
          { role: "user", content: message }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      return Response.json({
        reply: "Não foi possível consultar a IA agora. Tente novamente em instantes.",
        persisted: false,
        mode: "error"
      });
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ??
      "Não consegui gerar uma resposta agora.";

    return Response.json({ reply, persisted: false, mode: "openai", obraId: body.obraId ?? null });
  } catch {
    return Response.json({
      reply: "Erro de conexão com a IA.",
      persisted: false,
      mode: "error"
    });
  }
}
