import { describe, expect, it } from "vitest";
import {
  mapLembreteRow,
  postponeDueAt,
  uiStatusToDbStatus
} from "@/lib/lembretes";
import type { LembreteRow } from "@/lib/types/database";

const baseRow: LembreteRow = {
  id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  obra_id: "11111111-1111-1111-1111-111111111111",
  title: "Comprar cimento",
  due_at: "2026-06-26T14:00:00.000Z",
  status: "pendente",
  priority: "Alta",
  channel: "ambos",
  created_at: "2026-06-01T00:00:00Z",
  updated_at: "2026-06-01T00:00:00Z"
};

describe("mapLembreteRow", () => {
  it("maps channel and priority to UI labels", () => {
    const view = mapLembreteRow(baseRow, new Date("2026-06-26T10:00:00.000Z"));
    expect(view.channel).toBe("Aplicativo + WhatsApp");
    expect(view.priority).toBe("Alta");
    expect(view.title).toBe("Comprar cimento");
  });

  it("marks completed reminders", () => {
    const view = mapLembreteRow(
      { ...baseRow, status: "concluido" },
      new Date("2026-06-26T10:00:00.000Z")
    );
    expect(view.status).toBe("completed");
    expect(view.countdown).toBe("Concluído");
  });
});

describe("uiStatusToDbStatus", () => {
  it("maps completed UI status to concluido", () => {
    expect(uiStatusToDbStatus("completed")).toBe("concluido");
  });

  it("maps active statuses to pendente", () => {
    expect(uiStatusToDbStatus("today")).toBe("pendente");
    expect(uiStatusToDbStatus("overdue")).toBe("pendente");
  });
});

describe("postponeDueAt", () => {
  it("advances due date by one day at 09:00", () => {
    const next = postponeDueAt("2026-06-26T14:00:00.000Z");
    const date = new Date(next);
    expect(date.getDate()).toBe(27);
    expect(date.getHours()).toBe(9);
  });
});
