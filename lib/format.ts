const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0
});

export function formatCents(cents: number): string {
  if (cents >= 1_000_000) {
    return `R$ ${Math.round(cents / 100_000) / 10}M`;
  }
  if (cents >= 1_000) {
    return `R$ ${Math.round(cents / 1_000)}k`;
  }
  return currencyFormatter.format(cents / 100);
}

export function formatDateBr(isoDate: string | null): string {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function daysUntil(isoDate: string | null): string {
  if (!isoDate) return "—";
  const target = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (days < 0) return "0";
  return String(days);
}

export function normalizeObraType(value: string): "Obra completa" | "Reforma" {
  if (value.toLowerCase().includes("reforma")) return "Reforma";
  return "Obra completa";
}

export function parseBudgetToCents(value: string): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return 0;
  return Number.parseInt(digits, 10) * 100;
}
