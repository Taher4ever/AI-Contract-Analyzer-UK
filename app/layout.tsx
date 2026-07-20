import type { Metadata } from "next";
import localFont from "next/font/local";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/shared/theme-provider";
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

export const metadata: Metadata = {
  title: {
    default: "ContractLens AI — Understand any UK contract in minutes",
    template: "%s · ContractLens AI",
  },
  description:
    "Upload a contract and get a plain-English summary, risk score, clause analysis and an AI you can ask anything about your document.",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
