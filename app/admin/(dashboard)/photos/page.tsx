import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { activeProvider } from "@/lib/storage/providers";
import {
  createPhotos, createPhoto, updatePhoto, setPhotoPublished, deletePhoto, movePhoto,
} from "@/lib/services/admin-media";
import { BulkPhotoUploader } from "@/components/admin/bulk-photo-uploader";
import { MediaField } from "@/components/admin/media-field";
import { MediaRowActions } from "@/components/admin/media-row-actions";

const input = "border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold";

export default async function AdminPhotosPage() {
  await requireAdmin();
  const uploadsEnabled = activeProvider() !== null;
  const photos = await prisma.galleryPhoto.findMany({ orderBy: [{ position: "asc" }, { createdAt: "asc" }] });

  return (
    <div>
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="font-display text-2xl text-navy">Photos</h1>
        <p className="text-xs text-navy/50">
          {photos.filter((p) => p.isPublished).length} published · {photos.length} total · shown on /gallery
        </p>
      </div>

      {uploadsEnabled && <BulkPhotoUploader saveAction={createPhotos} />}

      <form action={createPhoto} className="mb-10 grid max-w-2xl gap-3 sm:grid-cols-2">
        <p className="text-xs text-navy/50 sm:col-span-2">
          {uploadsEnabled
            ? "Or add one by path / URL:"
            : "Put your pictures in public/media/gallery/ in the project, then add each one here by path."}
        </p>
        <input name="title" required placeholder="Title" className={input} />
        <input name="caption" placeholder="Caption (optional)" className={input} />
        <MediaField name="url" label="Photo path or URL" folder="photos" required uploadsEnabled={uploadsEnabled} />
        <button className="bg-navy px-5 py-2 text-sm text-cream sm:col-span-2">Add photo (saved as draft)</button>
      </form>

      {photos.length === 0 ? (
        <p className="border-y border-navy/10 bg-white px-4 py-8 text-center text-sm text-navy/50">
          No photos yet. Until you publish some, /gallery shows the built-in showcase photos.
        </p>
      ) : (
        <div className="divide-y divide-navy/5 border-y border-navy/10 bg-white">
          {photos.map((p, i) => (
            <div key={p.id} className="px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" className="h-14 w-14 flex-shrink-0 border border-navy/10 object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-navy">{p.title}</p>
                    {p.caption && <p className="truncate text-xs text-navy/50">{p.caption}</p>}
                  </div>
                </div>
                <MediaRowActions
                  isPublished={p.isPublished}
                  isFirst={i === 0}
                  isLast={i === photos.length - 1}
                  moveUp={movePhoto.bind(null, p.id, "up")}
                  moveDown={movePhoto.bind(null, p.id, "down")}
                  togglePublish={setPhotoPublished.bind(null, p.id, !p.isPublished)}
                  remove={deletePhoto.bind(null, p.id)}
                />
              </div>

              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-navy/50 hover:text-navy">Edit details</summary>
                <form action={updatePhoto} className="mt-3 grid max-w-2xl gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={p.id} />
                  <input name="title" required defaultValue={p.title} placeholder="Title" className={input} />
                  <input name="caption" defaultValue={p.caption ?? ""} placeholder="Caption (optional)" className={input} />
                  <MediaField name="url" label="Photo" folder="photos" defaultValue={p.url} required uploadsEnabled={uploadsEnabled} />
                  <button className="bg-navy px-5 py-2 text-sm text-cream sm:col-span-2">Save changes</button>
                </form>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
