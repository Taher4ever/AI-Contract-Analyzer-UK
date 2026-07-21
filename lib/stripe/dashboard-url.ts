import "server-only";

export function stripeInvoiceUrl(stripeId: string): string {
  const isTest = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
  return `https://dashboard.stripe.com/${isTest ? "test/" : ""}invoices/${stripeId}`;
}
