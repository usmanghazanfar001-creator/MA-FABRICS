"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";
import { createOrder } from "@/lib/services/orders";

const STEPS = ["Customer", "Shipping", "Review", "Payment"] as const;

export function CheckoutView({ shippingFee }: { shippingFee: number }) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [shipping, setShipping] = useState({ line1: "", city: "", province: "", postalCode: "" });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER">("COD");

  const total = subtotal + (items.length > 0 ? shippingFee : 0);

  async function handlePlaceOrder() {
    setSubmitting(true);
    setError(null);
    const result = await createOrder({
      customer,
      shipping,
      paymentMethod,
      items: items.map((i) => ({ productId: i.productId, color: i.color, quantity: i.quantity })),
    });
    setSubmitting(false);

    if (result.success && result.orderNumber) {
      clear();
      router.push(`/order-success?order=${result.orderNumber}`);
    } else {
      setError(result.error ?? "Something went wrong placing your order.");
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-40 text-center lg:px-10">
        <h1 className="font-display text-2xl text-navy">Your cart is empty</h1>
        <p className="mt-2 text-sm text-navy/60">Add fabrics to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-32 lg:px-10">
      <h1 className="mb-8 font-display text-3xl text-navy">Checkout</h1>

      <ol className="mb-12 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? "text-navy" : "text-navy/40"}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="max-w-md space-y-5">
          <Field label="Full name" value={customer.name} onChange={(v) => setCustomer({ ...customer, name: v })} />
          <Field label="Phone" value={customer.phone} onChange={(v) => setCustomer({ ...customer, phone: v })} />
          <Field label="Email (optional)" value={customer.email} onChange={(v) => setCustomer({ ...customer, email: v })} />
          <Button onClick={() => setStep(1)} disabled={!customer.name || !customer.phone}>Continue</Button>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-md space-y-5">
          <Field label="Address" value={shipping.line1} onChange={(v) => setShipping({ ...shipping, line1: v })} />
          <Field label="City" value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} />
          <Field label="Province" value={shipping.province} onChange={(v) => setShipping({ ...shipping, province: v })} />
          <Field label="Postal code (optional)" value={shipping.postalCode} onChange={(v) => setShipping({ ...shipping, postalCode: v })} />
          <div className="flex gap-3">
            <Button variant="outline" className="text-navy border-navy" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => setStep(2)} disabled={!shipping.line1 || !shipping.city || !shipping.province}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md space-y-6">
          <div className="divide-y divide-navy/10 border-y border-navy/10">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}`} className="flex justify-between py-3 text-sm">
                <span className="text-navy/70">{item.name} {item.color ? `(${item.color})` : ""} × {item.quantity}</span>
                <span className="text-navy">{formatPKR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-sm text-navy/70">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatPKR(shippingFee)}</span></div>
            <div className="flex justify-between font-display text-base text-navy"><span>Total</span><span>{formatPKR(total)}</span></div>
          </div>
          <div className="text-sm text-navy/70">
            <p>{customer.name} · {customer.phone}</p>
            <p>{shipping.line1}, {shipping.city}, {shipping.province}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-navy border-navy" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-md space-y-6">
          <div className="space-y-3">
            {(["COD", "BANK_TRANSFER"] as const).map((method) => (
              <label key={method} className="flex cursor-pointer items-center gap-3 border border-navy/20 p-4 text-sm">
                <input
                  type="radio"
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="accent-gold"
                />
                {method === "COD" ? "Cash on Delivery" : "Bank Transfer"}
              </label>
            ))}
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" className="text-navy border-navy" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handlePlaceOrder} disabled={submitting}>
              {submitting ? "Placing order..." : "Place order"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-navy">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm text-navy outline-none focus:border-gold"
      />
    </div>
  );
}
