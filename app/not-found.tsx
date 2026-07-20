import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { FadeIn } from "@/components/shared/motion";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="bg-grain flex min-h-dvh flex-col">
      <header className="py-6">
        <Container>
          <Logo />
        </Container>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <Container className="max-w-lg text-center">
          <FadeIn>
            <div className="glass shadow-soft-lg mx-auto flex size-20 items-center justify-center rounded-2xl motion-safe:animate-bounce">
              <FileQuestion className="text-primary size-9" />
            </div>
            <h1 className="font-display mt-8 text-5xl tracking-tight">
              Page not found
            </h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or may have
              moved.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="shadow-soft rounded-full"
                nativeButton={false}
                render={<Link href="/" />}
              >
                <ArrowLeft className="size-4" />
                Back to home
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                nativeButton={false}
                render={<Link href="/dashboard" />}
              >
                Go to dashboard
              </Button>
            </div>
          </FadeIn>
        </Container>
      </main>
    </div>
  );
}
