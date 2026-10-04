import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { requireAdmin } from "@/lib/auth/guards";

const RULES: Record<string, { types: string[]; maxBytes: number }> = {
  photos: { types: ["image/jpeg", "image/png", "image/webp"], maxBytes: 10 * 1024 * 1024 },
  thumbnails: { types: ["image/jpeg", "image/png", "image/webp"], maxBytes: 10 * 1024 * 1024 },
  videos: { types: ["video/mp4", "video/webm", "video/quicktime"], maxBytes: 100 * 1024 * 1024 },
};

/**
 * Vercel Blob client-upload handshake. The browser asks for a short-lived token here, then sends the
 * file straight to Blob (so Vercel's ~4.5MB request limit never applies). Auth is checked only when a
 * token is requested; Vercel's own completion callback is verified by handleUpload itself.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        await requireAdmin();
        const rule = RULES[clientPayload ?? ""];
        if (!rule) throw new Error("Invalid folder.");
        return {
          allowedContentTypes: rule.types,
          maximumSizeInBytes: rule.maxBytes,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed." }, { status: 400 });
  }
}
