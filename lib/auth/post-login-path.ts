import type { SupabaseClient } from "@supabase/supabase-js";
import { getProfileOnboardingPath } from "@/lib/auth/profile-onboarding";

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
  "/responsaveis",
  "/perfil",
  "/configuracoes",
  "/assinatura"
] as const;

export type { PostLoginPath } from "@/lib/auth/profile-onboarding";

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function getPostLoginPath(
  supabase: SupabaseClient,
  userId: string
) {
  return getProfileOnboardingPath(supabase, userId);
}

export async function resolvePostLoginRedirect(
  supabase: SupabaseClient,
  userId: string,
  requestedRedirect: string | null
): Promise<string> {
  const defaultPath = await getPostLoginPath(supabase, userId);

  if (requestedRedirect && isProtectedPath(requestedRedirect)) {
    if (defaultPath === "/onboarding") {
      return "/onboarding";
    }
    return requestedRedirect;
  }

  return defaultPath;
}
