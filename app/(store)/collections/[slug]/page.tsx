import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description ?? `Shop the ${collection.name} collection from MA Fabrics.`,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isPublished: true, deletedAt: null },
        include: { category: true, images: { take: 2, orderBy: { position: "asc" } }, colors: { include: { color: true } }, inventory: true },
      },
    },
  });
  if (!collection) notFound();

  const cards: ProductCardData[] = collection.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category?.name ?? "",
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    imageUrl: p.images[0]?.url ?? "/placeholder-fabric.jpg",
    hoverImageUrl: p.images[1]?.url,
    colors: p.colors.map((pc) => ({ name: pc.color.name, hex: pc.color.hex })),
    inStock: (p.inventory?.stockMeters ?? 0) > 0,
  }));

  return (
    <div>
      <div className="relative flex h-64 items-end overflow-hidden bg-navy sm:h-80">
        <Image
          src={collection.imageUrl || "/placeholder-suiting.jpg"}
          alt={collection.name}
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 lg:px-10">
          <h1 className="font-display text-4xl text-cream">{collection.name}</h1>
          {collection.description && <p className="mt-2 max-w-lg text-sm text-cream/70">{collection.description}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        {cards.length === 0 ? (
          <p className="text-sm text-navy/60">No fabrics in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {cards.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
