/** Cadastro pós-compra (Hotmart) — habilitar quando Supabase + webhook estiverem prontos. */
export function isSignupEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SIGNUP_ENABLED === "true";
}
