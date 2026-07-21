import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Receipt } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { AdminPagination } from "@/components/admin/pagination";
import { Badge } from "@/components/ui/badge";
import { stripeInvoiceUrl } from "@/lib/stripe/dashboard-url";

export const metadata: Metadata = { title: "Admin Payments" };

const PAGE_SIZE = 20;

interface PaymentRow {
  id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  stripeId: string;
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const admin = createAdminClient();

  const from = (page - 1) * PAGE_SIZE;
  const [{ data: payments, count }, { data: allPaid }] = await Promise.all([
    admin
      .from("payments")
      .select("id, user_id, stripe_id, amount, currency, status, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1),
    admin.from("payments").select("amount").eq("status", "paid"),
  ]);

  const totalRevenue = (allPaid ?? []).reduce((sum, p) => sum + p.amount, 0);

  const userIds = [...new Set((payments ?? []).map((p) => p.user_id))];
  const { data: profiles } = userIds.length
    ? await admin.from("profiles").select("id, email").in("id", userIds)
    : { data: [] as { id: string; email: string | null }[] };
  const emailById = new Map((profiles ?? []).map((p) => [p.id, p.email ?? "—"]));

  const rows: PaymentRow[] = (payments ?? []).map((p) => ({
    id: p.id,
    email: emailById.get(p.user_id) ?? "—",
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    createdAt: p.created_at,
    stripeId: p.stripe_id,
  }));

  const pageCount = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const columns: DataTableColumn<PaymentRow>[] = [
    { key: "user", header: "User", render: (p) => <span className="font-medium">{p.email}</span> },
    { key: "amount", header: "Amount", render: (p) => formatAmount(p.amount, p.currency) },
    {
      key: "status",
      header: "Status",
      render: (p) => <Badge variant="secondary">{p.status}</Badge>,
    },
    {
      key: "date",
      header: "Date",
      render: (p) =>
        new Date(p.createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "link",
      header: "",
      className: "text-right",
      render: (p) => (
        <Link
          href={stripeInvoiceUrl(p.stripeId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
        >
          Stripe
          <ExternalLink className="size-3" />
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">Payments</h1>
      <p className="text-muted-foreground mt-1 text-sm">{count ?? 0} total payments.</p>

      <div className="glass shadow-soft mt-6 max-w-xs rounded-2xl p-6">
        <p className="text-muted-foreground text-sm">Total revenue</p>
        <p className="mt-1 text-3xl font-semibold">{formatAmount(totalRevenue, "GBP")}</p>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={rows}
          emptyIcon={Receipt}
          emptyTitle="No payments yet"
          emptyDescription="Payments will appear here once customers are billed."
        />
      </div>

      <AdminPagination page={page} pageCount={pageCount} basePath="/admin/payments" />
    </div>
  );
}
