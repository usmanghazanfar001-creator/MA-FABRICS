import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { formatPKR } from "@/lib/utils";

export default async function AccountOrdersPage() {
  const session = await getSession();
  const orders = session
    ? await prisma.order.findMany({
        where: { customer: { userId: session.userId } },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      })
    : [];

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 lg:px-10">
      <h1 className="mb-8 font-display text-3xl text-navy">Order history</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-navy/60">No orders yet.</p>
      ) : (
        <div className="divide-y divide-navy/10 border-y border-navy/10">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="text-navy">{order.orderNumber}</p>
                <p className="text-navy/50">{order.createdAt.toLocaleDateString()} · {order.items.length} item(s)</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-navy/60">{order.status.replace("_", " ")}</span>
                <span className="text-navy">{formatPKR(Number(order.total))}</span>
                <Link href={`/track-order?order=${order.orderNumber}`} className="text-navy underline">
                  Track
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
