"use client";

import { RotateCw } from "lucide-react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground flex min-h-dvh items-center justify-center antialiased">
        <div className="max-w-md px-6 text-center">
          <h1 className="font-display text-4xl tracking-tight">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            A critical error occurred and the app couldn&apos;t recover.
            Please try again.
          </p>
          {error.digest && (
            <p className="text-muted-foreground/70 mt-3 text-xs">
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="bg-primary text-primary-foreground shadow-soft mt-8 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            <RotateCw className="size-4" />
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
