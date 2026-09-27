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
