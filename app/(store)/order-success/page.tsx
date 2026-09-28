import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-40 text-center lg:px-10">
      <CheckCircle2 className="mx-auto mb-6 h-12 w-12 text-gold" />
      <h1 className="font-display text-3xl text-navy">Order confirmed</h1>
      {orderNumber && (
        <p className="mt-3 text-sm text-navy/70">
          Your order number is <span className="text-navy">{orderNumber}</span>. Save it to track your order.
        </p>
      )}
      <p className="mt-2 text-sm text-navy/60">
        We'll contact you shortly to confirm delivery details.
      </p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {orderNumber && (
          <Link href={`/track-order?order=${orderNumber}`}>
            <Button variant="primary">Track your order</Button>
          </Link>
        )}
        <Link href="/shop">
          <Button variant="outline" className="text-navy border-navy">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
