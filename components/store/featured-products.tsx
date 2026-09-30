import { prisma } from "@/lib/db/prisma";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";
import { resolveImage, realImage } from "@/lib/media";
import { SectionHeading } from "@/components/store/section-heading";

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isPublished: true, deletedAt: null },
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { position: "asc" }, take: 2 }, colors: { include: { color: true } }, inventory: true },
  });

  if (products.length === 0) return null;

  const cards: ProductCardData[] = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category?.name ?? "",
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    imageUrl: resolveImage(p.images[0]?.url),
    hoverImageUrl: realImage(p.images[1]?.url),
    colors: p.colors.map((pc) => ({ name: pc.color.name, hex: pc.color.hex })),
    inStock: (p.inventory?.stockMeters ?? 0) > 0,
  }));

  return (
    <section className="bg-cream px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
<SectionHeading eyebrow="Best sellers" title="Featured fabrics" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {cards.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
