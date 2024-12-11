import { LucideSparkles } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <LucideSparkles size={20} strokeWidth={1.5} />
      <span className="text-lg font-semibold">Pictoria AI</span>
    </Link>
  );
}
