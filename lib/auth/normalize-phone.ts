/** Normaliza telefone BR para armazenamento (somente dígitos, com DDI 55). */
export function normalizePhoneBR(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 0) return null;

  if (digits.length === 11) {
    return `55${digits}`;
  }

  if (digits.length === 10) {
    return `55${digits}`;
  }

  if (digits.length === 13 && digits.startsWith("55")) {
    return digits;
  }

  if (digits.length === 12 && digits.startsWith("55")) {
    return digits;
  }

  return null;
}

/** Formata dígitos BR para exibição: (11) 99999-9999 */
export function formatPhoneBRDisplay(input: string): string {
  const digits = input.replace(/\D/g, "").replace(/^55/, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function isValidPhoneBR(input: string): boolean {
  return normalizePhoneBR(input) !== null;
}
