import { notFound } from "next/navigation";
import { getAdminOrder, updateOrderStatus, addOrderNote } from "@/lib/services/admin-orders";
import { formatPKR } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP", "SHIPPED", "DELIVERED", "CANCELLED"];

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-1 font-display text-2xl text-navy">{order.orderNumber}</h1>
      <p className="mb-8 text-sm text-navy/50">Placed {order.createdAt.toLocaleString()}</p>

      <div className="mb-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 font-display text-base text-navy">Customer</h2>
          <p className="text-sm text-navy/70">{order.customer?.user.name ?? order.guestName}</p>
          <p className="text-sm text-navy/70">{order.guestPhone}</p>
          {order.guestEmail && <p className="text-sm text-navy/70">{order.guestEmail}</p>}
        </div>
        <div>
          <h2 className="mb-2 font-display text-base text-navy">Shipping address</h2>
          <p className="text-sm text-navy/70">{order.shippingLine1}</p>
          <p className="text-sm text-navy/70">{order.shippingCity}, {order.shippingProvince} {order.shippingPostalCode}</p>
        </div>
      </div>

      <div className="mb-8 divide-y divide-navy/10 border-y border-navy/10">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-3 text-sm">
            <span className="text-navy/70">
              {item.product.name} {item.colorName ? `(${item.colorName})` : ""} × {item.quantity}
            </span>
            <span className="text-navy">{formatPKR(Number(item.lineTotal))}</span>
          </div>
        ))}
      </div>

      <div className="mb-10 max-w-xs space-y-1 text-sm text-navy/70">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatPKR(Number(order.subtotal))}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{formatPKR(Number(order.shippingFee))}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>-{formatPKR(Number(order.discount))}</span></div>
        <div className="flex justify-between font-display text-base text-navy"><span>Total</span><span>{formatPKR(Number(order.total))}</span></div>
        <p className="pt-1 text-xs text-navy/50">Payment: {order.paymentMethod.replace("_", " ")}</p>
      </div>

      <div className="mb-10">
        <h2 className="mb-3 font-display text-base text-navy">Update status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <form key={status} action={async () => { "use server"; await updateOrderStatus(order.id, status); }}>
              <button
                className={`px-3 py-1.5 text-xs ${
                  order.status === status ? "bg-navy text-cream" : "border border-navy/20 text-navy/70"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            </form>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-base text-navy">Order notes</h2>
        <form action={async (formData: FormData) => { "use server"; await addOrderNote(order.id, String(formData.get("notes") ?? "")); }}>
          <textarea
            name="notes"
            defaultValue={order.notes ?? ""}
            rows={3}
            className="w-full border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
          />
          <button className="mt-2 bg-navy px-4 py-2 text-sm text-cream">Save note</button>
        </form>
      </div>
    </div>
  );
}
