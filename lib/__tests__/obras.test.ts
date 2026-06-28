import { describe, expect, it } from "vitest";
import {
  buildCreateObraPayload,
  getInitials,
  mapObraRow,
  mapObraRowToShell
} from "@/lib/obras";
import type { ObraRow } from "@/lib/types/database";

const sampleObra: ObraRow = {
  id: "11111111-1111-1111-1111-111111111111",
  owner_id: "22222222-2222-2222-2222-222222222222",
  name: "Casa Alphaville",
  type: "Obra completa",
  status: "Ativa",
  city: "São Paulo",
  state: "SP",
  address: "Rua A, 100",
  budget_cents: 180_000_00,
  spent_cents: 74_000_00,
  progress: 41,
  start_date: "2026-01-15",
  delivery_date: "2026-12-01",
  responsible: "João Silva",
  property_type: "Casa",
  area_sqm: 220,
  goals: ["Acabamento"],
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z"
};

describe("mapObraRow", () => {
  it("maps monetary fields to formatted strings and cents", () => {
    const view = mapObraRow(sampleObra);
    expect(view.name).toBe("Casa Alphaville");
    expect(view.budgetCents).toBe(180_000_00);
    expect(view.spentCents).toBe(74_000_00);
    expect(view.budget).toContain("R$");
    expect(view.deliveryDate).toBe("01/12/2026");
  });
});

describe("mapObraRowToShell", () => {
  it("adds shell-specific display fields", () => {
    const shell = mapObraRowToShell(sampleObra);
    expect(shell.displayStatus).toBe("Em andamento");
    expect(shell.propertyType).toBe("Casa");
    expect(shell.area).toBe("220 m²");
    expect(shell.archived).toBe(false);
  });
});

describe("buildCreateObraPayload", () => {
  it("sets defaults for new obra", () => {
    const payload = buildCreateObraPayload(
      {
        name: "Reforma Cozinha",
        type: "Reforma",
        budget_cents: 50_000_00
      },
      sampleObra.owner_id
    );
    expect(payload.owner_id).toBe(sampleObra.owner_id);
    expect(payload.status).toBe("Ativa");
    expect(payload.spent_cents).toBe(0);
    expect(payload.progress).toBe(0);
  });
});

describe("getInitials", () => {
  it("returns two letters from full name", () => {
    expect(getInitials("Orlando Montes")).toBe("OM");
  });

  it("falls back to email when name is empty", () => {
    expect(getInitials("", "orlando@email.com")).toBe("OR");
  });
});
