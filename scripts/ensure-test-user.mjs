/**
 * Garante usuário de teste no Supabase Auth e imprime credenciais (só local).
 * Uso: node --env-file=.env.local scripts/ensure-test-user.mjs
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

const email =
  process.env.E2E_USER_EMAIL ?? "teste@obrioai.app";
const password =
  process.env.E2E_USER_PASSWORD ?? "ObrioTeste2026!";

if (!url || !serviceKey) {
  console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const { data: listData, error: listError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000
});

if (listError) {
  console.error("Erro ao listar usuários:", listError.message);
  process.exit(1);
}

const existing = listData.users.find(
  (user) => user.email?.toLowerCase() === email.toLowerCase()
);

if (existing) {
  const { error: updateError } = await admin.auth.admin.updateUserById(
    existing.id,
    { password, email_confirm: true }
  );
  if (updateError) {
    console.error("Erro ao atualizar senha:", updateError.message);
    process.exit(1);
  }
  console.log("Usuário de teste já existia — senha atualizada.");
} else {
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { whatsapp: "5511999990000" }
  });
  if (createError) {
    console.error("Erro ao criar usuário:", createError.message);
    process.exit(1);
  }
  console.log("Usuário de teste criado.");
}

console.log(JSON.stringify({ email, password }));
