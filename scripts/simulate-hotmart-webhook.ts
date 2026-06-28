/**
 * Simula POST da Hotmart para o webhook local.
 *
 * Uso (dev server em http://localhost:3000):
 *   npx tsx scripts/simulate-hotmart-webhook.ts voce@email.com
 *
 * Requer HOTMART_HOTTOK no ambiente (mesmo valor usado pelo app).
 */

import { loadLocalEnv } from "./load-local-env";

loadLocalEnv();

function parseEmail(argv: string[]): string {
  const email = argv[0]?.trim().toLowerCase();
  if (!email) {
    console.error("Uso: npx tsx scripts/simulate-hotmart-webhook.ts voce@email.com");
    process.exit(1);
  }
  return email;
}

async function main() {
  const email = parseEmail(process.argv.slice(2));
  const hottok = process.env.HOTMART_HOTTOK;
  if (!hottok) {
    console.error("Missing HOTMART_HOTTOK");
    process.exit(1);
  }

  const baseUrl = process.env.WEBHOOK_BASE_URL ?? "http://localhost:3000";
  const transactionId = `sim-${Date.now()}`;

  const payload = {
    event: "PURCHASE_COMPLETE",
    data: {
      product: { id: 123456, name: "Obrio AI" },
      buyer: {
        name: "Teste Obrio",
        email,
        phone: "+5511999998888"
      },
      purchase: {
        transaction: transactionId,
        status: "APPROVED"
      }
    }
  };

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/webhooks/hotmart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Hotmart-Hottok": hottok
    },
    body: JSON.stringify(payload)
  });

  const body = await response.text();
  console.log(`Status: ${response.status}`);
  console.log(body);

  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
