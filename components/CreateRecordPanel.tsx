"use client";

import { FormEvent, useState } from "react";
import { PrimaryButton } from "@/components/Ui";

type FieldOption = { value: string; label: string };

type Field = {
  name: string;
  label: string;
  type?: "text" | "date" | "number" | "textarea" | "select" | "datetime-local";
  placeholder?: string;
  required?: boolean;
  step?: string;
  options?: FieldOption[];
  defaultValue?: string;
};

type CreateRecordPanelProps = {
  title: string;
  description?: string;
  fields: Field[];
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onCancel?: () => void;
};

export function CreateRecordPanel({
  title,
  description,
  fields,
  submitLabel = "Salvar",
  onSubmit,
  onCancel
}: CreateRecordPanelProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((field) => [field.name, field.defaultValue ?? ""])
    )
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values);
      setValues(
        Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? ""]))
      );
      onCancel?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[8px] border border-black/8 bg-white p-4 shadow-soft"
    >
      <h3 className="text-lg font-black text-foundation">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm font-semibold text-graphite/65">{description}</p>
      ) : null}
      {error ? (
        <p className="mt-3 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.name}
            className={field.type === "textarea" ? "sm:col-span-2 block" : "block"}
          >
            <span className="text-sm font-black text-graphite/76">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                value={values[field.name] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field.name]: event.target.value }))
                }
                placeholder={field.placeholder}
                required={field.required}
                rows={3}
                className="mt-2 w-full rounded-[8px] border border-black/10 px-3 py-2 text-sm font-semibold outline-none focus:border-build"
              />
            ) : field.type === "select" ? (
              <select
                value={values[field.name] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field.name]: event.target.value }))
                }
                required={field.required}
                className="mt-2 h-12 w-full rounded-[8px] border border-black/10 px-3 text-sm font-semibold outline-none focus:border-build"
              >
                {(field.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type ?? "text"}
                step={field.step}
                value={values[field.name] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [field.name]: event.target.value }))
                }
                placeholder={field.placeholder}
                required={field.required}
                className="mt-2 h-12 w-full rounded-[8px] border border-black/10 px-3 text-sm font-semibold outline-none focus:border-build"
              />
            )}
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Salvando..." : submitLabel}
        </PrimaryButton>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-[8px] border border-black/10 px-4 text-sm font-black text-foundation"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
