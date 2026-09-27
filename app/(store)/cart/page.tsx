import { getPublicShippingFee } from "@/lib/services/site-settings";
import { CartView } from "@/components/store/cart-view";

export default async function CartPage() {
  const shippingFee = await getPublicShippingFee();
  return <CartView shippingFee={shippingFee} />;
}
