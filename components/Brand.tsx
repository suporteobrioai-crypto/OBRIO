import Link from "next/link";
import { ObrioMark } from "@/components/ObrioMark";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span
        className="grid h-9 w-9 place-items-center"
      >
        <ObrioMark size={36} />
      </span>
      <span
        className={`text-lg font-bold tracking-normal ${
          inverse ? "text-white" : "text-foundation"
        }`}
      >
        Obrio AI
      </span>
    </Link>
  );
}
