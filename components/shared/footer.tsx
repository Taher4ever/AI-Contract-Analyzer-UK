import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";

const columns: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "X (Twitter)", href: "https://x.com", external: true },
      {
        label: "LinkedIn",
        href: "https://linkedin.com",
        external: true,
      },
      { label: "GitHub", href: "https://github.com", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2">
            <Logo />
            <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
              Understand any UK contract in minutes — plain-English summaries,
              risk scores and answers you can actually use.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col items-start justify-between gap-3 text-sm sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} ContractLens AI. All rights reserved.
          </p>
          <p>ContractLens AI provides information, not legal advice.</p>
        </div>
      </Container>
    </footer>
  );
}
