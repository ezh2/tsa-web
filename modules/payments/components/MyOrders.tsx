import "server-only";
import Link from "next/link";
// Stripe-backed order history is temporarily paused.
// import { fmtAmount } from "@/modules/payments/lib/format";
// import { listMyOrders } from "@/modules/payments/server/queries";
// import type { OrderStatus } from "@/modules/payments/types";

// const STATUS_BADGE: Record<OrderStatus, string> = {
//   paid: "bg-emerald-100 text-emerald-800",
//   processing: "bg-amber-100 text-amber-800",
//   failed: "bg-red-100 text-red-800",
//   refunded: "bg-neutral-200 text-neutral-700",
// };

export async function MyOrders() {
  // const orders = await listMyOrders();

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
      Online checkout and order history are temporarily paused. See{" "}
      <Link href="/membership" className="font-medium underline">
        membership and merch options
      </Link>
      .
    </div>
  );

  // Original order history UI:
  // if (orders.length === 0) {
  //   return (
  //     <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-700">
  //       No orders yet. See{" "}
  //       <Link href="/membership" className="font-medium underline">
  //         membership and merch options
  //       </Link>
  //       .
  //     </div>
  //   );
  // }
  //
  // return (
  //   <ul className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 bg-white">
  //     {orders.map((order) => (
  //       <li key={order.id} className="px-5 py-4">
  //         <div className="flex items-baseline justify-between gap-4">
  //           <p className="truncate font-medium text-neutral-900">
  //             {order.product_name}
  //           </p>
  //           <span
  //             className={
  //               "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider " +
  //               STATUS_BADGE[order.status]
  //             }
  //           >
  //             {order.status}
  //           </span>
  //         </div>
  //         <p className="mt-1 text-xs text-neutral-600">
  //           {new Date(order.created_at).toLocaleDateString(undefined, {
  //             month: "short",
  //             day: "numeric",
  //             year: "numeric",
  //           })}
  //           {" · "}
  //           {fmtAmount(order.amount_total, order.currency)}
  //           {order.shirt_size ? ` · Size ${order.shirt_size}` : ""}
  //         </p>
  //       </li>
  //     ))}
  //   </ul>
  // );
}
