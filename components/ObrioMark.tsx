export function ObrioMark({
  size = 22,
  className = ""
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-grid place-items-center rounded-[8px] bg-foundation font-black text-white ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.38)) }}
    >
      OB
    </span>
  );
}
