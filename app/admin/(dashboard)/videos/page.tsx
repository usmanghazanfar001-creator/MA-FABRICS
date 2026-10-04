import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { activeProvider } from "@/lib/storage/providers";
import {
  createVideo, updateVideo, setVideoPublished, deleteVideo, moveVideo,
} from "@/lib/services/admin-media";
import { MediaField } from "@/components/admin/media-field";
import { MediaRowActions } from "@/components/admin/media-row-actions";

const input = "border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold";

const TYPES = [
  ["PRODUCT_SHOWCASE", "Product showcase"],
  ["FABRIC_TEXTURE", "Fabric texture"],
  ["COLOR_SHOWCASE", "Color showcase"],
  ["COLLECTION", "Collection"],
  ["PROMOTIONAL", "Promotional"],
] as const;

export default async function AdminVideosPage() {
  await requireAdmin();
  const uploadsEnabled = activeProvider() !== null;
  const [videos, products] = await Promise.all([
    prisma.productVideo.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      include: { product: { select: { name: true } } },
    }),
    prisma.product.findMany({ where: { deletedAt: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const fields = (v?: (typeof videos)[number]) => (
    <>
      <input name="title" required defaultValue={v?.title} placeholder="Title" className={input} />
      <select name="productId" defaultValue={v?.productId ?? ""} className={input}>
        <option value="">No linked product</option>
        {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select name="type" defaultValue={v?.type ?? "PRODUCT_SHOWCASE"} className={input}>
        {TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <select name="orientation" defaultValue={v?.orientation ?? "LANDSCAPE"} className={input}>
        <option value="LANDSCAPE">Landscape (16:9) — shown under “Films”</option>
        <option value="PORTRAIT">Portrait (9:16) — shown under “Quick looks”</option>
      </select>
      <MediaField name="url" label="Video (MP4, WebM or MOV · up to 100MB)" folder="videos" defaultValue={v?.url} required uploadsEnabled={uploadsEnabled} />
      <MediaField name="thumbnailUrl" label="Thumbnail (optional)" folder="thumbnails" defaultValue={v?.thumbnailUrl ?? ""} uploadsEnabled={uploadsEnabled} />
      <input name="description" defaultValue={v?.description ?? ""} placeholder="Description (optional)" className={`${input} sm:col-span-2`} />
    </>
  );

  return (
    <div>
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="font-display text-2xl text-navy">Videos</h1>
        <p className="text-xs text-navy/50">
          {videos.filter((v) => v.isPublished).length} published · {videos.length} total · shown on / and /videos
        </p>
      </div>

      <form action={createVideo} className="mb-10 grid max-w-2xl gap-3 sm:grid-cols-2">
        {fields()}
        <button className="bg-navy px-5 py-2 text-sm text-cream sm:col-span-2">Add video (saved as draft)</button>
      </form>

      <div className="divide-y divide-navy/5 border-y border-navy/10 bg-white">
        {videos.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-navy/50">No videos yet.</p>
        )}
        {videos.map((v, i) => (
          <div key={v.id} className="px-4 py-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden border border-navy/10 bg-navy">
                  {v.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <video src={v.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-navy">{v.title}</p>
                  <p className="truncate text-xs text-navy/50">
                    {v.type.replace(/_/g, " ").toLowerCase()} · {v.orientation.toLowerCase()}
                    {v.product ? ` · ${v.product.name}` : ""}
                  </p>
                </div>
              </div>
              <MediaRowActions
                isPublished={v.isPublished}
                isFirst={i === 0}
                isLast={i === videos.length - 1}
                moveUp={moveVideo.bind(null, v.id, "up")}
                moveDown={moveVideo.bind(null, v.id, "down")}
                togglePublish={setVideoPublished.bind(null, v.id, !v.isPublished)}
                remove={deleteVideo.bind(null, v.id)}
              />
            </div>

            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-navy/50 hover:text-navy">Edit details</summary>
              <form action={updateVideo} className="mt-3 grid max-w-2xl gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={v.id} />
                {fields(v)}
                <button className="bg-navy px-5 py-2 text-sm text-cream sm:col-span-2">Save changes</button>
              </form>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
