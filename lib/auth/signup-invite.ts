import { createAdminClient } from "@/lib/supabase/admin";
import { hashSignupToken } from "@/lib/auth/signup-token";

export type SignupInviteRow = {
  id: string;
  email: string;
  token_hash: string;
  hotmart_transaction_id: string | null;
  buyer_name: string | null;
  buyer_phone: string | null;
  plan: "gratuito" | "mensal" | "premium";
  consumed_at: string | null;
  revoked_at: string | null;
  expires_at: string;
  created_at: string;
};

export type InviteValidationResult =
  | { ok: true; invite: SignupInviteRow }
  | { ok: false; reason: string };

export async function findValidInvite(
  email: string,
  token: string
): Promise<InviteValidationResult> {
  const admin = createAdminClient();
  const tokenHash = hashSignupToken(token);
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await admin
    .from("signup_invites")
    .select("*")
    .eq("token_hash", tokenHash)
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    return { ok: false, reason: "Erro ao validar convite." };
  }

  if (!data) {
    return { ok: false, reason: "Link inválido ou expirado." };
  }

  const invite = data as SignupInviteRow;

  if (invite.revoked_at) {
    return { ok: false, reason: "Este convite foi cancelado." };
  }

  if (invite.consumed_at) {
    return { ok: false, reason: "Este link já foi usado para criar uma conta." };
  }

  if (new Date(invite.expires_at) < new Date()) {
    return { ok: false, reason: "Este link expirou. Entre em contato com o suporte." };
  }

  return { ok: true, invite };
}

export function isSignupOpenWithoutToken(): boolean {
  return process.env.SIGNUP_ALLOW_OPEN === "true";
}
