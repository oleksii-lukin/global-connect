import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Global Connect — home"
      className={cn("flex items-center gap-2.5", className)}
    >
      <Image
        src="/logo.png"
        alt="Global Connect logo"
        width={40}
        height={40}
        className="h-9 w-9 object-contain transition-transform duration-300 hover:scale-105"
      />
      <span className="font-display text-lg tracking-tight text-foreground">
        GLOBAL CONNECT
      </span>
    </Link>
  );
}