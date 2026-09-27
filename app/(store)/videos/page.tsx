import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { VideoGalleryGrid } from "@/components/store/video-gallery-grid";

export const metadata: Metadata = {
  title: "Fabric Videos",
  description: "Watch MA Fabrics' fabric texture, color, and collection videos.",
};

export default async function VideosPage() {
  const videos = await prisma.productVideo.findMany({
    where: { isPublished: true },
    orderBy: { position: "asc" },
    include: { product: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <h1 className="mb-2 font-display text-3xl text-navy sm:text-4xl">Fabric videos</h1>
      <p className="mb-12 max-w-lg text-sm text-navy/60">
        See texture, drape, and color up close before you order.
      </p>

      {videos.length === 0 ? (
        <p className="text-sm text-navy/60">No videos published yet.</p>
      ) : (
        <VideoGalleryGrid videos={videos.map((v) => ({
          id: v.id,
          title: v.title,
          url: v.url,
          thumbnailUrl: v.thumbnailUrl,
          type: v.type,
          productSlug: v.product?.slug,
          productName: v.product?.name,
        }))} />
      )}
    </div>
  );
}
