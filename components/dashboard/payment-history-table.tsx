import { Receipt } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export interface PaymentRow {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function PaymentHistoryTable({ payments }: { payments: PaymentRow[] }) {
  if (payments.length === 0) {
    return (
      <div className="glass shadow-soft rounded-2xl">
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          description="Your payment history will appear here after your first invoice."
        />
      </div>
    );
  }

  return (
    <div className="glass shadow-soft overflow-x-auto rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-border/60 border-b text-left">
            <th className="text-muted-foreground px-5 py-3 font-medium">Date</th>
            <th className="text-muted-foreground px-5 py-3 font-medium">Amount</th>
            <th className="text-muted-foreground px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-border/40 not-last:border-b">
              <td className="px-5 py-3">
                {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-5 py-3 font-medium">
                {formatAmount(payment.amount, payment.currency)}
              </td>
              <td className="px-5 py-3">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-current" />
                  {payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
