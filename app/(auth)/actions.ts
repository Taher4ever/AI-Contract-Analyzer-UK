"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error?: string; success?: boolean; message?: string };

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

function friendlyAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "Incorrect email or password.",
    "User already registered": "An account with this email already exists.",
    "Email not confirmed": "Please confirm your email before signing in.",
  };
  if (known[message]) return known[message];
  if (message.toLowerCase().includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return message;
}

function safeNext(next?: string): string {
  return next && next.startsWith("/") ? next : "/dashboard";
}

export async function signInWithPassword(values: {
  email: string;
  password: string;
  next?: string;
}): Promise<ActionResult> {
  const parsed = z
    .object({ email: emailSchema, password: z.string().min(1) })
    .safeParse(values);
  if (!parsed.success) return { error: "Please enter a valid email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: friendlyAuthError(error.message) };

  redirect(safeNext(values.next));
}

export async function signUp(values: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  const parsed = z
    .object({ email: emailSchema, password: passwordSchema })
    .safeParse(values);
  if (!parsed.success) {
    return { error: "Please enter a valid email and a password of at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  if (error) return { error: friendlyAuthError(error.message) };

  if (data.session) redirect("/dashboard");

  return { success: true, message: "Check your inbox to confirm your email." };
}

export async function signInWithMagicLink(values: {
  email: string;
}): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(values.email);
  if (!parsed.success) return { error: "Please enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  if (error) return { error: friendlyAuthError(error.message) };

  return { success: true, message: "Check your inbox for a magic link to sign in." };
}

export async function signInWithGoogle(next?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const callbackUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`);
  if (next) callbackUrl.searchParams.set("next", safeNext(next));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl.toString() },
  });
  if (error || !data.url) {
    return { error: friendlyAuthError(error?.message ?? "Could not start Google sign-in.") };
  }

  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(values: {
  email: string;
}): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(values.email);
  if (!parsed.success) return { error: "Please enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: friendlyAuthError(error.message) };

  return { success: true, message: "Check your inbox for a password reset link." };
}

export async function updatePassword(values: {
  password: string;
}): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse(values.password);
  if (!parsed.success) return { error: "Password must be at least 8 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { error: friendlyAuthError(error.message) };

  redirect("/dashboard");
}
