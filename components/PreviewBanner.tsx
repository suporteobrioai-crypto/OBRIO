import { Sparkles } from "lucide-react";

type PreviewBannerProps = {
  title?: string;
  description?: string;
};

export function PreviewBanner({
  title = "Prévia",
  description = "Esta seção usa dados de demonstração. Os números reais da sua obra aparecerão quando a funcionalidade estiver conectada."
}: PreviewBannerProps) {
  return (
    <div
      className="flex gap-3 rounded-[8px] border border-build/25 bg-[#FFF4EA] px-4 py-3"
      role="status"
    >
      <Sparkles size={18} className="mt-0.5 shrink-0 text-build" aria-hidden />
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-build">{title}</p>
        <p className="mt-1 text-sm font-semibold leading-5 text-graphite/75">{description}</p>
      </div>
    </div>
  );
}
