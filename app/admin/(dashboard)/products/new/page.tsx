import { getProductFormOptions } from "@/lib/services/admin-products";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const options = await getProductFormOptions();
  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">New product</h1>
      <ProductForm options={options} />
    </div>
  );
}
