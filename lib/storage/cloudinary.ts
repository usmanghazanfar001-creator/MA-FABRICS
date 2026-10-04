import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

/** Uploads a base64 data URI or remote URL to Cloudinary, folder-scoped by type. */
export async function uploadToCloudinary(
  source: string,
  folder: "products" | "videos" | "banners" | "categories"
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(source, {
    folder: `ma-fabrics/${folder}`,
    resource_type: folder === "videos" ? "video" : "image",
    transformation:
      folder === "videos"
        ? undefined
        : [{ quality: "auto", fetch_format: "auto" }],
  });

  return { url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height };
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "video" = "image") {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export type MediaFolder = "photos" | "videos" | "thumbnails";

const FOLDER_RULES: Record<MediaFolder, { resourceType: "image" | "video"; formats: string }> = {
  photos: { resourceType: "image", formats: "jpg,jpeg,png,webp" },
  thumbnails: { resourceType: "image", formats: "jpg,jpeg,png,webp" },
  videos: { resourceType: "video", formats: "mp4,webm,mov" },
};

/**
 * Signs a direct browser -> Cloudinary upload. The file never passes through our
 * server, which matters on Vercel (serverless request bodies are capped at ~4.5MB).
 * `allowed_formats` is part of the signature, so it can't be tampered with client-side.
 */
export function signUpload(folder: MediaFolder) {
  const rule = FOLDER_RULES[folder];
  const timestamp = Math.round(Date.now() / 1000);
  const params = { allowed_formats: rule.formats, folder: `ma-fabrics/${folder}`, timestamp };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET ?? "");
  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    folder: params.folder,
    allowedFormats: rule.formats,
    resourceType: rule.resourceType,
  };
}

/** Best-effort cleanup when a record is deleted. Ignores non-Cloudinary URLs (e.g. /media/... files). */
export async function deleteCloudinaryByUrl(url: string | null | undefined, resourceType: "image" | "video") {
  if (!url) return;
  const match = url.match(/^https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(ma-fabrics\/.+?)(?:\.[a-z0-9]+)?$/i);
  if (!match?.[1]) return;
  try {
    await cloudinary.uploader.destroy(match[1], { resource_type: resourceType });
  } catch {
    // Orphaned file is harmless; never block the delete on cleanup.
  }
}
