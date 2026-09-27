"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderForTracking } from "@/lib/services/orders";
import type { Order } from "@prisma/client";

const TIMELINE = ["PENDING", "CONFIRMED", "PROCESSING", "READY_TO_SHIP", "SHIPPED", "DELIVERED"] as const;

const LABELS: Record<(typeof TIMELINE)[number], string> = {
  PENDING: "Order confirmed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  READY_TO_SHIP: "Ready to ship",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") ?? "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  async function handleTrack() {
    setLoading(true);
    const result = await getOrderForTracking(orderNumber, phone);
    setOrder(result);
    setLoading(false);
  }

  const currentIndex = order && order.status !== "CANCELLED" ? TIMELINE.indexOf(order.status as any) : -1;

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-40 lg:px-10">
      <h1 className="mb-8 font-display text-3xl text-navy">Track your order</h1>

      <div className="space-y-4">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order number (e.g. MA-2026-000123)"
          className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number used at checkout"
          className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
        />
        <Button onClick={handleTrack} disabled={!orderNumber || !phone || loading}>
          {loading ? "Searching..." : "Track order"}
        </Button>
      </div>

      {order === null && (
        <p className="mt-8 text-sm text-navy/60">No order found with that number and phone.</p>
      )}

      {order && (
        <div className="mt-12">
          {order.status === "CANCELLED" ? (
            <p className="text-sm text-red-700">This order was cancelled.</p>
          ) : (
            <ol className="space-y-6">
              {TIMELINE.map((s, i) => (
                <li key={s} className="flex items-center gap-4">
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border ${
                      i <= currentIndex ? "border-gold bg-gold text-navy" : "border-navy/20 text-navy/30"
                    }`}
                  >
                    {i <= currentIndex ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className={i <= currentIndex ? "text-navy" : "text-navy/40"}>{LABELS[s]}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
