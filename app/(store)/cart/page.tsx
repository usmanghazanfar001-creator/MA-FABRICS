import type { Metadata } from "next";
import { getPublicShippingFee } from "@/lib/services/site-settings";
import { CartView } from "@/components/store/cart-view";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const shippingFee = await getPublicShippingFee();
  return <CartView shippingFee={shippingFee} />;
}
