import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-7", className)}
    >
      {/* document */}
      <path
        d="M7 5a3 3 0 0 1 3-3h8.5L25 8.5V27a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V5Z"
        className="fill-primary/15 stroke-primary"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2v5a2 2 0 0 0 2 2H25"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* lens */}
      <circle
        cx="15"
        cy="17"
        r="4.5"
        className="fill-background stroke-primary"
        strokeWidth="2"
      />
      <path
        d="m18.5 20.5 3.5 3.5"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight",
        className
      )}
    >
      <LogoMark />
      <span className="text-lg">
        ContractLens <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}
