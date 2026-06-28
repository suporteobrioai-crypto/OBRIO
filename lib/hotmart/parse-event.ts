export type HotmartPurchaseEvent = {
  event: string;
  data?: {
    product?: { id?: number | string; name?: string };
    buyer?: { name?: string; email?: string; phone?: string };
    purchase?: {
      transaction?: string;
      status?: string;
    };
  };
};

export type ParsedHotmartPurchase = {
  event: string;
  email: string;
  buyerName: string | null;
  buyerPhone: string | null;
  transactionId: string;
  productId: string | null;
  status: string | null;
};

const APPROVED_EVENTS = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);

export function parseHotmartPayload(body: unknown): ParsedHotmartPurchase | null {
  if (!body || typeof body !== "object") return null;

  const payload = body as HotmartPurchaseEvent;
  const event = typeof payload.event === "string" ? payload.event : "";

  if (!APPROVED_EVENTS.has(event)) return null;

  const data = payload.data;
  const email = data?.buyer?.email?.trim().toLowerCase();
  const transactionId = data?.purchase?.transaction?.trim();
  const status = data?.purchase?.status?.trim().toUpperCase() ?? null;

  if (!email || !transactionId) return null;

  if (status && status !== "APPROVED" && status !== "COMPLETE") {
    return null;
  }

  const productId =
    data?.product?.id !== undefined ? String(data.product.id) : null;

  return {
    event,
    email,
    buyerName: data?.buyer?.name?.trim() ?? null,
    buyerPhone: data?.buyer?.phone?.trim() ?? null,
    transactionId,
    productId,
    status
  };
}

export function getHotmartHottok(request: Request): string | null {
  return (
    request.headers.get("X-Hotmart-Hottok") ??
    request.headers.get("X-HOTMART-HOTTOK") ??
    request.headers.get("X-Hotmart-Webhook-Token")
  );
}

export function validateHotmartHottok(request: Request): boolean {
  const expected = process.env.HOTMART_HOTTOK;
  if (!expected) return false;

  const received = getHotmartHottok(request);
  return received === expected;
}

export function resolvePlanFromProduct(productId: string | null): "gratuito" | "mensal" | "premium" {
  if (!productId) return "premium";

  const raw = process.env.HOTMART_PRODUCT_PLAN_MAP;
  if (!raw) return "premium";

  try {
    const map = JSON.parse(raw) as Record<string, string>;
    const plan = map[productId];
    if (plan === "gratuito" || plan === "mensal" || plan === "premium") {
      return plan;
    }
  } catch {
    return "premium";
  }

  return "premium";
}
