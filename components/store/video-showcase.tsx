import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { mergeVideos } from "@/lib/media";
import { VideoRail } from "@/components/store/video-rail";
import { SectionHeading } from "@/components/store/section-heading";

export async function VideoShowcase() {
  // Admin-published videos come first; the built-in films fill the rest.
  const dbVideos = await prisma.productVideo
    .findMany({
      where: { isPublished: true },
      orderBy: { position: "asc" },
      take: 8,
      include: { product: { select: { slug: true, name: true } } },
    })
    .catch(() => []);

  const videos = mergeVideos(dbVideos).slice(0, 9);

  return (
    <section className="section-navy px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Watch"
          title="In motion"
          tone="light"
          action={
            <Link href="/videos" className="text-sm text-cream/70 hover:text-gold">
              View all videos
            </Link>
          }
        />
        <VideoRail videos={videos} />
      </div>
    </section>
  );
}
