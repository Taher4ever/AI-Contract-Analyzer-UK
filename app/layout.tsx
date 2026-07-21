import type { Metadata } from "next";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin-var.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});

const newsreader = localFont({
  src: [
    {
      path: "./fonts/newsreader-latin-var.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "./fonts/newsreader-latin-var-italic.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-newsreader",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const title = "ContractLens AI — Understand any UK contract in minutes";
const description =
  "Upload a contract and get a plain-English summary, risk score, clause analysis and an AI you can ask anything about your document.";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: title,
    template: "%s · ContractLens AI",
  },
  description,
  keywords: [
    "contract analysis",
    "UK contract checker",
    "tenancy agreement analysis",
    "employment contract review",
    "AI legal document summary",
    "NDA analysis",
    "contract risk score",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: appUrl,
    siteName: "ContractLens AI",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MotionConfig reducedMotion="user">
            {children}
            <Toaster position="top-center" />
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
