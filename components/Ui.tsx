import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Camera, FileUp, Mic, Upload } from "lucide-react";

export function Card({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 w-full rounded-[8px] border border-black/5 bg-white p-4 shadow-soft md:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export function Metric({
  label,
  value,
  helper
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-normal text-graphite/50">
        {label}
      </p>
      <strong className="mt-2 block text-2xl font-black tracking-normal text-foundation">
        {value}
      </strong>
      {helper ? (
        <p className="mt-1 text-xs font-bold text-graphite/54">{helper}</p>
      ) : null}
    </Card>
  );
}

export function Field({
  label,
  placeholder,
  type = "text"
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-foundation">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
      />
    </label>
  );
}

export function SelectField({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-foundation">{label}</span>
      <select
        value={value}
        onChange={
          onChange
            ? (event) => onChange(event.target.value)
            : undefined
        }
        className="mt-2 h-12 w-full rounded-[8px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-build"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PrimaryButton({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[8px] bg-foundation px-4 text-sm font-black text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SmartCaptureBox({
  title,
  description,
  textPlaceholder = "Descreva rapidamente ou cole uma mensagem..."
}: {
  title: string;
  description: string;
  textPlaceholder?: string;
}) {
  return (
    <div className="rounded-[8px] border border-dashed border-build/50 bg-[#fffdf7] p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-white text-build shadow-soft">
          <Upload size={21} />
        </span>
        <div className="min-w-0">
          <h3 className="break-words text-lg font-black text-foundation">{title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-graphite/62">
            {description}
          </p>
        </div>
      </div>

      <textarea
        placeholder={textPlaceholder}
        className="mt-4 min-h-28 w-full resize-none rounded-[8px] border border-black/10 bg-white p-3 text-sm font-semibold outline-none placeholder:text-graphite/35 focus:border-build"
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-foundation text-sm font-black text-white">
          <Camera size={18} />
          Câmera
          <input className="hidden" type="file" accept="image/*" capture="environment" />
        </label>
        <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-concrete text-sm font-black text-foundation">
          <FileUp size={18} className="text-build" />
          Upload
          <input className="hidden" type="file" accept="image/*,.pdf,.doc,.docx" multiple />
        </label>
        <button className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-concrete text-sm font-black text-foundation">
          <Mic size={18} className="text-build" />
          Áudio
        </button>
      </div>
    </div>
  );
}
