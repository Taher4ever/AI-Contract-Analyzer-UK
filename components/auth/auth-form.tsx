import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleButton } from "@/components/auth/google-button";
import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { MagicLinkForm } from "@/components/auth/magic-link-form";

export function AuthForm({
  mode,
  next,
}: {
  mode: "login" | "signup";
  next?: string;
}) {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-muted-foreground mt-1.5 text-center text-sm">
        {mode === "login"
          ? "Log in to keep analysing your contracts."
          : "Your first 3 documents are free."}
      </p>

      <div className="mt-6">
        <GoogleButton next={next} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">or continue with email</span>
        <Separator className="flex-1" />
      </div>

      <Tabs defaultValue="password">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic-link">Magic link</TabsTrigger>
        </TabsList>
        <TabsContent value="password" className="mt-5">
          <EmailPasswordForm mode={mode} next={next} />
        </TabsContent>
        <TabsContent value="magic-link" className="mt-5">
          <MagicLinkForm />
        </TabsContent>
      </Tabs>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
