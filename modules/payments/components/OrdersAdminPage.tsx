import { fmtAmount } from "@/modules/payments/lib/format";
import { listAllOrders } from "@/modules/payments/server/queries";
import type { OrderStatus, OrderWithBuyer } from "@/modules/payments/types";

const STATUS_BADGE: Record<OrderStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  processing: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-neutral-200 text-neutral-700",
};

function buyerName(order: OrderWithBuyer): string {
  const profile = order.profiles;
  if (!profile) return "Deleted account";
  const fullName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ");
  return profile.display_name ?? (fullName || (profile.email ?? "Unknown"));
}

export async function OrdersAdminPage() {
  const orders = await listAllOrders();
  const paidCount = orders.filter((o) => o.status === "paid").length;

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Director · Orders
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
          Orders
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Membership and merch payments, newest first. {paidCount} paid. Use
          the size column for T-shirt pickup.
        </p>
      </header>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-neutral-300 px-6 py-16 text-center text-sm text-neutral-500">
          No orders yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Buyer</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">
                      {buyerName(order)}
                    </p>
                    {order.profiles?.email && (
                      <p className="text-xs text-neutral-500">
                        {order.profiles.email}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {order.product_name}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {order.shirt_size ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-neutral-900">
                    {fmtAmount(order.amount_total, order.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider " +
                        STATUS_BADGE[order.status]
                      }
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
