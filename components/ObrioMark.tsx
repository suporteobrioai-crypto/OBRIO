export function ObrioMark({
  size = 22,
  className = ""
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/obrio-logo.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      className={`block rounded-[8px] ${className}`}
    />
  );
}
