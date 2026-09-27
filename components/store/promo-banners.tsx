import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export async function PromoBanners() {
  const now = new Date();
  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    orderBy: { position: "asc" },
    take: 2,
  });

  if (banners.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
      <div className="grid gap-6 sm:grid-cols-2">
        {banners.map((b) => {
          const content = (
            <div className="group relative aspect-[16/7] overflow-hidden bg-navy">
              <Image
                src={b.imageUrl}
                alt={b.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-navy/30" />
              <div className="absolute bottom-5 left-5 text-cream">
                <p className="font-display text-xl">{b.title}</p>
                {b.subtitle && <p className="text-sm text-cream/80">{b.subtitle}</p>}
              </div>
            </div>
          );
          return b.linkUrl ? (
            <Link key={b.id} href={b.linkUrl}>{content}</Link>
          ) : (
            <div key={b.id}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
