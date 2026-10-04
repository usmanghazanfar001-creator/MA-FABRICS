import { deleteCloudinaryByUrl } from "@/lib/storage/cloudinary";

export type StorageProvider = "cloudinary" | "blob" | null;

/** Cloudinary wins if fully configured; otherwise Vercel Blob if its token is present. */
export function activeProvider(): StorageProvider {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    return "cloudinary";
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return null;
}

const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

/** Best-effort cleanup of an uploaded file. Ignores local /media/... paths and unknown hosts. */
export async function deleteStoredMedia(url: string | null | undefined, resourceType: "image" | "video") {
  if (!url) return;
  if (BLOB_HOST.test(url)) {
    try {
      const { del } = await import("@vercel/blob");
      await del(url);
    } catch {
      // An orphaned file is harmless; never block the record delete on cleanup.
    }
    return;
  }
  await deleteCloudinaryByUrl(url, resourceType);
}
