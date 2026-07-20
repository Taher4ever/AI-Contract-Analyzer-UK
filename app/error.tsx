"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-grain flex min-h-dvh flex-col">
      <header className="py-6">
        <Container>
          <Logo />
        </Container>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <Container className="max-w-lg text-center">
          <div className="glass shadow-soft-lg mx-auto flex size-20 items-center justify-center rounded-2xl">
            <AlertTriangle className="size-9 text-amber-500" />
          </div>
          <h1 className="font-display mt-8 text-4xl tracking-tight">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            We&apos;re sorry — an unexpected error occurred. You can try
            again, or head back home if the problem continues.
          </p>
          {error.digest && (
            <p className="text-muted-foreground/70 mt-3 text-xs">
              Reference: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="shadow-soft rounded-full"
              onClick={() => reset()}
            >
              <RotateCw className="size-4" />
              Try again
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Back to home
            </Button>
          </div>
        </Container>
      </main>
    </div>
  );
}
