import Link from "next/link";
import { listAdminOrders } from "@/lib/services/admin-orders";
import { formatPKR } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await listAdminOrders();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Orders</h1>

      <div className="overflow-x-auto border border-navy/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy/10 text-navy/50">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 text-navy">{o.orderNumber}</td>
                <td className="px-4 py-3 text-navy/60">{o.customer?.user.name ?? o.guestName}</td>
                <td className="px-4 py-3 text-navy/60">{o.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3 text-navy/60">{o.items.length}</td>
                <td className="px-4 py-3 text-navy/60">{formatPKR(Number(o.total))}</td>
                <td className="px-4 py-3 text-navy/60">{o.paymentMethod.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-cream px-2.5 py-1 text-xs text-navy">
                    {o.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-navy underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
