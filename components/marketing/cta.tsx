import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { FadeIn } from "@/components/shared/motion";

export function Cta() {
  return (
    <section className="pb-20 lg:pb-28">
      <Container>
        <FadeIn>
          <div className="glass-strong shadow-soft-lg relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-16">
            <div
              aria-hidden="true"
              className="bg-primary/15 absolute -top-24 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full blur-3xl"
            />
            <h2 className="font-display mx-auto max-w-2xl text-4xl tracking-tight text-balance sm:text-5xl">
              Stop signing contracts you don&apos;t fully understand
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
              Your first three documents are free. No card required.
            </p>
            <Button
              size="lg"
              className="shadow-soft mt-8 rounded-full"
              nativeButton={false}
              render={<Link href="/signup" />}
            >
              Analyze Contract
              <ArrowRight className="size-4" />
            </Button>
            <p className="text-muted-foreground/80 mt-6 text-xs">
              Not legal advice — ContractLens AI helps you understand documents,
              it does not replace a solicitor.
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
