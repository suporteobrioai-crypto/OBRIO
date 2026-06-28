import type { DiarioEntryRow } from "@/lib/types/database";
import { formatDateBr } from "@/lib/format";

export type DiarioEntryView = {
  id: string;
  obraId: string;
  date: string;
  author: string;
  content: string;
  tags: string[];
  weatherNote?: string;
  attachments: string[];
};

export function mapDiarioEntryRow(row: DiarioEntryRow): DiarioEntryView {
  return {
    id: row.id,
    obraId: row.obra_id,
    date: formatDateBr(row.entry_date),
    author: row.author_name ?? "Você",
    content: row.content,
    tags: row.tags ?? [],
    weatherNote: row.weather_note ?? undefined,
    attachments: row.attachment_paths ?? []
  };
}

export type CreateDiarioInput = {
  obra_id: string;
  content: string;
  author_name?: string;
  entry_date?: string;
  tags?: string[];
  weather_note?: string;
  attachment_paths?: string[];
};

export function buildDiarioPayload(input: CreateDiarioInput) {
  return {
    obra_id: input.obra_id,
    content: input.content,
    author_name: input.author_name ?? null,
    entry_date: input.entry_date ?? new Date().toISOString().slice(0, 10),
    tags: input.tags ?? [],
    weather_note: input.weather_note ?? null,
    attachment_paths: input.attachment_paths ?? []
  };
}
