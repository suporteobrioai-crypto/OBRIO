export type PurchaseWelcomeParams = {
  buyerName?: string | null;
  email: string;
  signupUrl: string;
  siteUrl: string;
};

export function buildPurchaseWelcomeHtml(params: PurchaseWelcomeParams): string {
  const greeting = params.buyerName
    ? `Olá, <strong>${escapeHtml(params.buyerName)}</strong>!`
    : "Olá!";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sua compra foi aprovada — Obrio AI</title>
</head>
<body style="margin:0;padding:0;background-color:#EEF1EF;font-family:Arial,Helvetica,sans-serif;color:#1E2523;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#EEF1EF;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 24px rgba(14,51,42,0.08);">
          <tr>
            <td style="background-color:#0E332A;padding:28px 32px;">
              <span style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;background-color:#F17B22;border-radius:8px;color:#ffffff;font-size:14px;font-weight:700;">OB</span>
              <span style="margin-left:10px;font-size:18px;font-weight:700;color:#ffffff;vertical-align:middle;">Obrio AI</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#F17B22;">
                Compra aprovada
              </p>
              <h1 style="margin:0 0 16px;font-size:28px;line-height:1.25;font-weight:900;color:#0E332A;">
                Bem-vindo ao Obrio AI
              </h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1E2523;">
                ${greeting} Sua compra foi aprovada. Agora crie sua conta com email, senha e WhatsApp para começar a organizar suas obras.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#1E2523;">
                Use o email <strong>${escapeHtml(params.email)}</strong> no cadastro.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center" style="border-radius:8px;background-color:#F17B22;">
                    <a href="${escapeHtml(params.signupUrl)}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Criar minha conta
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#1E2523;opacity:0.72;">
                Depois de criar a conta, faça login com o email e a senha que você escolher.
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#1E2523;opacity:0.55;">
                Se o botão não funcionar, copie e cole este link no navegador:<br />
                <a href="${escapeHtml(params.signupUrl)}" style="color:#1E5C4C;word-break:break-all;">${escapeHtml(params.signupUrl)}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid rgba(30,37,35,0.08);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#1E2523;opacity:0.45;">
                © Obrio AI — <a href="${escapeHtml(params.siteUrl)}" style="color:#1E5C4C;text-decoration:none;">${escapeHtml(params.siteUrl)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
