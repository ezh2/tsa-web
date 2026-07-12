// Stripe-backed orders admin is temporarily paused.
// import { fmtAmount } from "@/modules/payments/lib/format";
// import { listAllOrders } from "@/modules/payments/server/queries";
// import type { OrderStatus, OrderWithBuyer } from "@/modules/payments/types";

// const STATUS_BADGE: Record<OrderStatus, string> = {
//   paid: "bg-emerald-100 text-emerald-800",
//   processing: "bg-amber-100 text-amber-800",
//   failed: "bg-red-100 text-red-800",
//   refunded: "bg-neutral-200 text-neutral-700",
// };

// function buyerName(order: OrderWithBuyer): string {
//   const profile = order.profiles;
//   if (!profile) return "Deleted account";
//   const fullName = [profile.first_name, profile.last_name]
//     .filter(Boolean)
//     .join(" ");
//   return profile.display_name ?? (fullName || (profile.email ?? "Unknown"));
// }

export async function OrdersAdminPage() {
  // const orders = await listAllOrders();
  // const paidCount = orders.filter((o) => o.status === "paid").length;

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
          Stripe checkout and order fulfillment are temporarily paused.
        </p>
      </header>

      <p className="mt-10 rounded-xl border border-dashed border-neutral-300 px-6 py-16 text-center text-sm text-neutral-500">
        Orders are hidden while the Stripe implementation is paused.
      </p>

      {/* Original Stripe-backed orders table:
      {orders.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-neutral-300 px-6 py-16 text-center text-sm text-neutral-500">
          No orders yet.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[44rem] text-left text-sm">
            ...
          </table>
        </div>
      )} */}
    </main>
  );
}
