import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProfileRow } from "@/lib/types/database";

export type PostLoginPath = "/onboarding" | "/dashboard";

export function isProfileComplete(
  profile: Pick<ProfileRow, "full_name" | "whatsapp"> | null | undefined
): boolean {
  if (!profile) return false;
  return Boolean(profile.full_name?.trim() && profile.whatsapp?.trim());
}

export async function getProfileOnboardingPath(
  supabase: SupabaseClient,
  userId: string
): Promise<PostLoginPath> {
  const { data } = await supabase
    .from("profiles")
    .select("full_name, whatsapp")
    .eq("id", userId)
    .maybeSingle();

  return isProfileComplete(data as ProfileRow | null) ? "/dashboard" : "/onboarding";
}

export function isOnboardingPath(pathname: string): boolean {
  return pathname === "/onboarding" || pathname.startsWith("/onboarding/");
}
