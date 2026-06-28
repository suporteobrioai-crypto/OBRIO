import { createSignupToken, hashSignupToken } from "@/lib/auth/signup-token";
import { sendPurchaseWelcome } from "@/lib/email/send-purchase-welcome";
import { resolvePlanFromProduct } from "@/lib/hotmart/parse-event";
import type { ParsedHotmartPurchase } from "@/lib/hotmart/parse-event";
import { createAdminClient } from "@/lib/supabase/admin";

export type CreateInviteResult =
  | { ok: true; created: boolean; email: string }
  | { ok: false; error: string };

export async function createSignupInviteFromPurchase(
  purchase: ParsedHotmartPurchase
): Promise<CreateInviteResult> {
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("signup_invites")
    .select("id, consumed_at")
    .eq("hotmart_transaction_id", purchase.transactionId)
    .maybeSingle();

  if (existing) {
    return { ok: true, created: false, email: purchase.email };
  }

  const token = createSignupToken();
  const tokenHash = hashSignupToken(token);
  const plan = resolvePlanFromProduct(purchase.productId);

  const { error: insertError } = await admin.from("signup_invites").insert({
    email: purchase.email,
    token_hash: tokenHash,
    hotmart_transaction_id: purchase.transactionId,
    buyer_name: purchase.buyerName,
    buyer_phone: purchase.buyerPhone,
    plan
  });

  if (insertError) {
    return { ok: false, error: insertError.message };
  }

  const emailResult = await sendPurchaseWelcome({
    email: purchase.email,
    token,
    buyerName: purchase.buyerName
  });

  if (!emailResult.ok) {
    return { ok: false, error: emailResult.error };
  }

  return { ok: true, created: true, email: purchase.email };
}

export async function revokeSignupInviteByTransaction(
  transactionId: string
): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("signup_invites")
    .update({ revoked_at: new Date().toISOString() })
    .eq("hotmart_transaction_id", transactionId)
    .is("consumed_at", null);
}
