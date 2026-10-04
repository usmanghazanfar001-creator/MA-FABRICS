export type UploadFolder = "photos" | "videos" | "thumbnails";

const LIMITS: Record<UploadFolder, { maxBytes: number; types: string[] }> = {
  photos: { maxBytes: 10 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
  thumbnails: { maxBytes: 10 * 1024 * 1024, types: ["image/jpeg", "image/png", "image/webp"] },
  videos: { maxBytes: 100 * 1024 * 1024, types: ["video/mp4", "video/webm", "video/quicktime"] },
};

export const ACCEPT: Record<UploadFolder, string> = {
  photos: LIMITS.photos.types.join(","),
  thumbnails: LIMITS.thumbnails.types.join(","),
  videos: LIMITS.videos.types.join(","),
};

/** Uploads straight from the browser to Cloudinary using a server-signed request. */
export async function uploadDirect(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void
): Promise<string> {
  const rule = LIMITS[folder];
  if (!rule.types.includes(file.type)) throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  if (file.size > rule.maxBytes) throw new Error(`File exceeds the ${rule.maxBytes / (1024 * 1024)}MB limit.`);

  const signRes = await fetch("/api/admin/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  const sign = await signRes.json();
  if (!signRes.ok) throw new Error(sign.error ?? "Could not start upload.");

  if (sign.provider === "blob") {
    const { upload } = await import("@vercel/blob/client");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const blob = await upload(`${folder}/${safeName}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload/blob",
      clientPayload: folder,
      onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
    });
    return blob.url;
  }

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", sign.apiKey);
  body.append("timestamp", String(sign.timestamp));
  body.append("signature", sign.signature);
  body.append("folder", sign.folder);
  body.append("allowed_formats", sign.allowedFormats);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/${sign.resourceType}/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) resolve(data.secure_url);
        else reject(new Error(data?.error?.message ?? "Upload failed."));
      } catch {
        reject(new Error("Upload failed."));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(body);
  });
}
