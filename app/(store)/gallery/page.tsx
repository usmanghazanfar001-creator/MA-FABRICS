import type { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { mergePhotos } from "@/lib/media";
import { PhotoGalleryGrid } from "@/components/store/photo-gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A look inside MA Fabrics: our suiting, swatches, colours and boutique.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const dbPhotos = await prisma.galleryPhoto
    .findMany({
      where: { isPublished: true },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    })
    .catch(() => []);

  const photos = mergePhotos(dbPhotos);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <h1 className="mb-2 font-display text-3xl text-navy sm:text-4xl">Gallery</h1>
      <p className="mb-12 max-w-lg text-sm text-navy/60">
        Cloth, colour and craft, photographed in our boutique.
      </p>
      <PhotoGalleryGrid photos={photos} />
    </div>
  );
}
