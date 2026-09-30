import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { IMAGES } from "@/lib/media";

interface BannerContent {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
}

const DEFAULT_BANNERS: BannerContent[] = [
  {
    id: "default-suiting",
    title: "Premium Suiting",
    subtitle: "Italian-inspired weaves, cut to order",
    imageUrl: IMAGES.stripedBundle,
    linkUrl: "/shop?category=suiting",
  },
  {
    id: "default-luxury",
    title: "Luxury Collection",
    subtitle: "Embroidered pieces for formal occasions",
    imageUrl: IMAGES.embroideredSuitSet,
    linkUrl: "/collections/luxury-collection",
  },
];

export async function PromoBanners() {
  const now = new Date();
  const dbBanners = await prisma.banner
    .findMany({
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: { position: "asc" },
      take: 2,
    })
    .catch(() => []);

  const banners: BannerContent[] = dbBanners.length > 0 ? dbBanners : DEFAULT_BANNERS;

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
