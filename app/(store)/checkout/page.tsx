import type { Metadata } from "next";
import { getPublicShippingFee } from "@/lib/services/site-settings";
import { CheckoutView } from "@/components/store/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const shippingFee = await getPublicShippingFee();
  return <CheckoutView shippingFee={shippingFee} />;
}
