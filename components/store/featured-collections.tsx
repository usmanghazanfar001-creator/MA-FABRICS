import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { collectionImage } from "@/lib/media";
import { SectionHeading } from "@/components/store/section-heading";

const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export async function FeaturedCollections() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    take: 4,
  });

  if (collections.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
      <SectionHeading
        eyebrow="Curated for you"
        title="Featured collections"
        action={
          <Link href="/collections" className="text-sm text-navy/70 hover:text-gold-dark">
            View all collections
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {collections.map((c, i) => (
          <Link
            key={c.slug}
            href={`/collections/${c.slug}`}
            className={`group relative aspect-[4/3] overflow-hidden ${SPANS[i % SPANS.length]}`}
          >
            <Image
              src={collectionImage(c.slug, c.imageUrl, i)}
              alt={c.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent" />
            <span className="absolute bottom-6 left-6 font-display text-2xl text-cream">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
