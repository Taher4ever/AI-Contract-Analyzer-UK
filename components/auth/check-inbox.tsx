import { Mail } from "lucide-react";
import { FadeIn } from "@/components/shared/motion";

export function CheckInbox({ message }: { message: string }) {
  return (
    <FadeIn className="py-4 text-center">
      <div className="glass shadow-soft mx-auto flex size-14 items-center justify-center rounded-2xl motion-safe:animate-bounce">
        <Mail className="text-primary size-6" />
      </div>
      <p className="mt-4 font-semibold">Check your inbox</p>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        {message}
      </p>
    </FadeIn>
  );
}
