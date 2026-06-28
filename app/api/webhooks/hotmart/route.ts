import { NextRequest, NextResponse } from "next/server";
import {
  createSignupInviteFromPurchase,
  revokeSignupInviteByTransaction
} from "@/lib/hotmart/create-invite";
import {
  parseHotmartPayload,
  validateHotmartHottok
} from "@/lib/hotmart/parse-event";

const REFUND_EVENTS = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED"
]);

export async function POST(request: NextRequest) {
  if (!validateHotmartHottok(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event =
    body && typeof body === "object" && "event" in body
      ? String((body as { event: unknown }).event)
      : "";

  if (REFUND_EVENTS.has(event)) {
    const data = (body as { data?: { purchase?: { transaction?: string } } }).data;
    const transactionId = data?.purchase?.transaction?.trim();
    if (transactionId) {
      await revokeSignupInviteByTransaction(transactionId);
    }
    return NextResponse.json({ received: true, action: "revoked" });
  }

  const purchase = parseHotmartPayload(body);
  if (!purchase) {
    return NextResponse.json({ received: true, action: "ignored" });
  }

  const result = await createSignupInviteFromPurchase(purchase);
  if (!result.ok) {
    console.error("[hotmart webhook]", result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    received: true,
    action: result.created ? "invite_created" : "duplicate",
    email: result.email
  });
}
