import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { mergeVideos } from "@/lib/media";
import { VideoRail } from "@/components/store/video-rail";

export async function VideoShowcase() {
  // Admin-published videos come first; the built-in films fill the rest.
  const dbVideos = await prisma.productVideo
    .findMany({
      where: { isPublished: true },
      orderBy: { position: "asc" },
      take: 6,
      include: { product: { select: { slug: true, name: true } } },
    })
    .catch(() => []);

  const videos = mergeVideos(dbVideos).slice(0, 6);

  return (
    <section className="bg-cream px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl text-navy sm:text-4xl">In motion</h2>
          <Link href="/videos" className="text-sm text-navy/70 hover:text-gold-dark">
            View all videos
          </Link>
        </div>
        <VideoRail videos={videos} />
      </div>
    </section>
  );
}
