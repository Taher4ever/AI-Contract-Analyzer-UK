import { Logo } from "@/components/shared/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-grain flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="glass shadow-soft-lg rounded-2xl p-8">{children}</div>
      </div>
    </div>
  );
}
