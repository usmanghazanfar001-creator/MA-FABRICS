import type { Metadata } from "next";
import { parseShopSearchParams } from "@/lib/validations/shop-filters";
import { getShopProducts, getFilterFacets } from "@/lib/services/products";
import { ShopFiltersDesktop, ShopFiltersMobile } from "@/components/store/shop-filters";
import { ShopSort, ShopSearch, ShopPagination } from "@/components/store/shop-controls";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";
import { resolveImage, realImage } from "@/lib/media";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse premium Pakistani suiting and fabric collections from MA Fabrics.",
};

function toCardData(product: Awaited<ReturnType<typeof getShopProducts>>["items"][number]): ProductCardData {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category?.name ?? "",
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    imageUrl: resolveImage(product.images[0]?.url),
    hoverImageUrl: realImage(product.images[1]?.url),
    colors: product.colors.map((pc) => ({ name: pc.color.name, hex: pc.color.hex })),
    inStock: (product.inventory?.stockMeters ?? 0) > 0,
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseShopSearchParams(resolvedSearchParams);
  const [{ items, total, page, pageCount }, facets] = await Promise.all([
    getShopProducts(filters),
    getFilterFacets(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <div className="mb-10">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">Shop all fabrics</h1>
        <p className="mt-2 text-sm text-navy/60">{total} fabrics</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ShopSearch />
        <div className="flex items-center gap-3">
          <ShopFiltersMobile facets={facets} />
          <ShopSort />
        </div>
      </div>

      <div className="flex gap-12">
        <ShopFiltersDesktop facets={facets} />

        <div className="flex-1">
          {items.length === 0 ? (
            <div className="border border-dashed border-navy/20 py-20 text-center">
              <p className="text-navy/60">No fabrics match those filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p.id} product={toCardData(p)} />
              ))}
            </div>
          )}
          <ShopPagination page={page} pageCount={pageCount} />
        </div>
      </div>
    </div>
  );
}
