/**
 * Cria um convite de cadastro de teste e imprime o link de signup.
 *
 * Uso:
 *   npx tsx scripts/create-test-invite.ts voce@email.com
 *   npx tsx scripts/create-test-invite.ts voce@email.com --send-email
 *
 * Requer SUPABASE_SECRET_KEY (ou SERVICE_ROLE) e SIGNUP_TOKEN_SECRET no ambiente.
 * --send-email também requer RESEND_API_KEY e EMAIL_FROM.
 */

import { createSignupToken, hashSignupToken } from "../lib/auth/signup-token";
import {
  buildSignupUrl,
  sendPurchaseWelcome
} from "../lib/email/send-purchase-welcome";
import { createAdminClient } from "../lib/supabase/admin";
import { loadLocalEnv } from "./load-local-env";

loadLocalEnv();

function parseArgs(argv: string[]): { email: string; sendEmail: boolean } {
  const positional = argv.filter((arg) => !arg.startsWith("--"));
  const email = positional[0]?.trim().toLowerCase();
  if (!email) {
    console.error(
      "Uso: npx tsx scripts/create-test-invite.ts voce@email.com [--send-email]"
    );
    process.exit(1);
  }
  return { email, sendEmail: argv.includes("--send-email") };
}

async function main() {
  const { email, sendEmail } = parseArgs(process.argv.slice(2));

  const admin = createAdminClient();
  const token = createSignupToken();
  const tokenHash = hashSignupToken(token);

  const { error } = await admin.from("signup_invites").insert({
    email,
    token_hash: tokenHash,
    hotmart_transaction_id: `test-${Date.now()}`,
    buyer_name: "Teste Obrio",
    plan: "premium"
  });

  if (error) {
    console.error("Erro ao criar invite:", error.message);
    process.exit(1);
  }

  const signupUrl = buildSignupUrl(email, token);
  console.log("Invite criado com sucesso.");
  console.log("Link de cadastro:");
  console.log(signupUrl);

  if (sendEmail) {
    const result = await sendPurchaseWelcome({
      email,
      token,
      buyerName: "Teste Obrio"
    });
    if (!result.ok) {
      console.error("Erro ao enviar email:", result.error);
      process.exit(1);
    }
    console.log("Email enviado via Resend para", email);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
