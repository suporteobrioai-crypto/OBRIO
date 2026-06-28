/**
 * Cria um convite de cadastro de teste e imprime o link de signup.
 *
 * Uso:
 *   npx tsx scripts/create-test-invite.ts voce@email.com
 *
 * Requer SUPABASE_SECRET_KEY (ou SERVICE_ROLE) e SIGNUP_TOKEN_SECRET no ambiente.
 */

import { createSignupToken, hashSignupToken } from "../lib/auth/signup-token";
import { buildSignupUrl } from "../lib/email/send-purchase-welcome";
import { createAdminClient } from "../lib/supabase/admin";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Uso: npx tsx scripts/create-test-invite.ts voce@email.com");
    process.exit(1);
  }

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

  console.log("Invite criado com sucesso.");
  console.log("Link de cadastro:");
  console.log(buildSignupUrl(email, token));
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
