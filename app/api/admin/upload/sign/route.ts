import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { signUpload, type MediaFolder } from "@/lib/storage/cloudinary";
import { activeProvider } from "@/lib/storage/providers";

const FOLDERS: MediaFolder[] = ["photos", "videos", "thumbnails"];

/** Tells the browser how to upload: a signed Cloudinary request, or the Vercel Blob client flow. */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { folder } = (await request.json().catch(() => ({}))) as { folder?: string };
  if (!folder || !FOLDERS.includes(folder as MediaFolder)) {
    return NextResponse.json({ error: "Invalid folder." }, { status: 400 });
  }

  const provider = activeProvider();
  if (provider === "blob") return NextResponse.json({ provider: "blob" });
  if (provider === "cloudinary") return NextResponse.json({ provider: "cloudinary", ...signUpload(folder as MediaFolder) });
  return NextResponse.json({ error: "No file storage is configured." }, { status: 500 });
}
