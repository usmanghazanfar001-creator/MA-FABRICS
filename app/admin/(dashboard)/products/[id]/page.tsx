import { notFound } from "next/navigation";
import { getAdminProduct, getProductFormOptions } from "@/lib/services/admin-products";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, options] = await Promise.all([
    getAdminProduct(id),
    getProductFormOptions(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Edit product</h1>
      <ProductForm
        productId={product.id}
        options={options}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          shortDescription: product.shortDescription ?? undefined,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
          categoryId: product.categoryId ?? undefined,
          collectionId: product.collectionId ?? undefined,
          fabricType: product.fabricType ?? undefined,
          texture: product.texture ?? undefined,
          season: product.season,
          recommendedUse: product.recommendedUse ?? undefined,
          stockMeters: product.inventory?.stockMeters ?? 0,
          colorIds: product.colors.map((c) => c.colorId),
          imageUrls: product.images.map((img) => img.url),
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
          isPublished: product.isPublished,
        }}
      />
    </div>
  );
}
