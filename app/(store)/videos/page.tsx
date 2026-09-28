import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { mergeVideos } from "@/lib/media";
import { VideoGalleryGrid } from "@/components/store/video-gallery-grid";

export const metadata: Metadata = {
  title: "Fabric Videos",
  description: "Watch MA Fabrics' fabric texture, color, and collection videos.",
  alternates: { canonical: "/videos" },
};

export default async function VideosPage() {
  const dbVideos = await prisma.productVideo
    .findMany({
      where: { isPublished: true },
      orderBy: { position: "asc" },
      include: { product: { select: { slug: true, name: true } } },
    })
    .catch(() => []);

  const videos = mergeVideos(dbVideos);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <h1 className="mb-2 font-display text-3xl text-navy sm:text-4xl">Fabric videos</h1>
      <p className="mb-12 max-w-lg text-sm text-navy/60">
        See texture, drape, and color up close before you order.
      </p>
      <VideoGalleryGrid videos={videos} />
    </div>
  );
}
