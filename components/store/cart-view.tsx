"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";

export function CartView({ shippingFee }: { shippingFee: number }) {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const shipping = items.length > 0 ? shippingFee : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center lg:px-10">
        <h1 className="font-display text-3xl text-navy">Your cart is empty</h1>
        <p className="mt-3 text-sm text-navy/60">Browse our fabrics and find something for your next stitch.</p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button variant="primary">Continue shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-32 lg:px-10">
      <h1 className="mb-10 font-display text-3xl text-navy sm:text-4xl">Your cart</h1>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 divide-y divide-navy/10">
          {items.map((item) => (
            <div key={`${item.productId}-${item.color}`} className="flex gap-4 py-6">
              <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden bg-cream">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/product/${item.slug}`} className="font-display text-lg text-navy">
                      {item.name}
                    </Link>
                    {item.color && <p className="mt-1 text-xs text-navy/50">Color: {item.color}</p>}
                  </div>
                  <button
                    aria-label="Remove item"
                    onClick={() => removeItem(item.productId, item.color)}
                    className="text-navy/40 hover:text-navy"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center border border-navy/20">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                      className="p-2 text-navy"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                      className="p-2 text-navy"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm text-navy">{formatPKR(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <Link href="/shop" className="text-sm text-navy/60 hover:text-gold-dark">
              Continue shopping
            </Link>
          </div>
        </div>

        <div className="h-fit border border-navy/10 p-6">
          <h2 className="mb-5 font-display text-lg text-navy">Order summary</h2>
          <div className="space-y-3 text-sm text-navy/70">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatPKR(shipping)}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-navy/10 pt-4 font-display text-lg text-navy">
            <span>Total</span><span>{formatPKR(total)}</span>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button variant="primary" className="w-full">Proceed to checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
