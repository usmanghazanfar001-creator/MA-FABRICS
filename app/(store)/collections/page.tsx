import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { collectionImage } from "@/lib/media";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse MA Fabrics' curated fabric collections — suiting, summer, winter, and luxury.",
};

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <h1 className="mb-2 font-display text-3xl text-navy sm:text-4xl">Collections</h1>
      <p className="mb-12 max-w-lg text-sm text-navy/60">
        Curated groupings of our fabrics, from formal suiting to seasonal staples.
      </p>

      {collections.length === 0 ? (
        <p className="text-sm text-navy/60">No collections available yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative aspect-[4/3] overflow-hidden bg-cream">
              <Image
                src={collectionImage(c.slug, c.imageUrl, i)}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent" />
              <div className="absolute bottom-5 left-5 text-cream">
                <p className="font-display text-xl">{c.name}</p>
                <p className="text-xs text-cream/70">{c._count.products} fabrics</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
