/** Client-safe feature flags (NEXT_PUBLIC_*). */

export function isAiDockEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AI_DOCK_ENABLED === "true";
}

export function isWhatsAppFabEnabled(): boolean {
  return process.env.NEXT_PUBLIC_WHATSAPP_FAB_ENABLED === "true";
}

export function getWhatsAppContactUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  return raw || null;
}
