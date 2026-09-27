import { getPublicShippingFee } from "@/lib/services/site-settings";
import { CheckoutView } from "@/components/store/checkout-view";

export default async function CheckoutPage() {
  const shippingFee = await getPublicShippingFee();
  return <CheckoutView shippingFee={shippingFee} />;
}
