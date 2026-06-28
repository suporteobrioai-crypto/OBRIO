import type { SupabaseClient } from "@supabase/supabase-js";

export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/obras",
  "/diario",
  "/financeiro",
  "/materiais",
  "/mao-de-obra",
  "/recibos",
  "/lembretes",
  "/clima",
  "/relatorios",
  "/assistente",
  "/equipe",
  "/trocar-obra",
  "/perfil",
  "/configuracoes",
  "/assinatura"
] as const;

export type PostLoginPath = "/obras/nova" | "/dashboard";

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function getPostLoginPath(
  supabase: SupabaseClient,
  userId: string
): Promise<PostLoginPath> {
  const { count } = await supabase
    .from("obras")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", userId);

  return (count ?? 0) > 0 ? "/dashboard" : "/obras/nova";
}

export async function resolvePostLoginRedirect(
  supabase: SupabaseClient,
  userId: string,
  requestedRedirect: string | null
): Promise<string> {
  if (requestedRedirect && isProtectedPath(requestedRedirect)) {
    return requestedRedirect;
  }

  return getPostLoginPath(supabase, userId);
}
