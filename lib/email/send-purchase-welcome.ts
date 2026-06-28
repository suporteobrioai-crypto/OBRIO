import { buildPurchaseWelcomeHtml } from "@/lib/email/purchase-welcome-html";

export type SendPurchaseWelcomeInput = {
  email: string;
  token: string;
  buyerName?: string | null;
};

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://obrioai.app";
}

function getEmailFrom(): string {
  return process.env.EMAIL_FROM ?? "Obrio AI <noreply@obrioai.app>";
}

export function buildSignupUrl(email: string, token: string): string {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const params = new URLSearchParams({
    mode: "cadastro",
    email,
    token
  });
  return `${siteUrl}/?${params.toString()}`;
}

export async function sendPurchaseWelcome(
  input: SendPurchaseWelcomeInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "Missing RESEND_API_KEY" };
  }

  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const signupUrl = buildSignupUrl(input.email, input.token);
  const html = buildPurchaseWelcomeHtml({
    email: input.email,
    buyerName: input.buyerName,
    signupUrl,
    siteUrl
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: getEmailFrom(),
      to: [input.email],
      subject: "Sua compra foi aprovada — crie sua conta no Obrio AI",
      html
    })
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: `Resend error: ${response.status} ${body}` };
  }

  return { ok: true };
}
