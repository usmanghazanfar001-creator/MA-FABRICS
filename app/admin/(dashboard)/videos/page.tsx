import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import type { VideoType } from "@prisma/client";

async function createVideo(formData: FormData) {
  "use server";
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  await prisma.productVideo.create({
    data: {
      productId: productId || undefined,
      title: String(formData.get("title")),
      description: String(formData.get("description") ?? "") || undefined,
      url: String(formData.get("url")),
      thumbnailUrl: String(formData.get("thumbnailUrl") ?? "") || undefined,
      type: formData.get("type") as VideoType,
    },
  });
  revalidatePath("/admin/videos");
}

async function togglePublish(id: string, isPublished: boolean) {
  "use server";
  await requireAdmin();
  await prisma.productVideo.update({ where: { id }, data: { isPublished } });
  revalidatePath("/admin/videos");
}

async function deleteVideo(id: string) {
  "use server";
  await requireAdmin();
  await prisma.productVideo.delete({ where: { id } });
  revalidatePath("/admin/videos");
}

export default async function AdminVideosPage() {
  await requireAdmin();
  const [videos, products] = await Promise.all([
    prisma.productVideo.findMany({ orderBy: { position: "asc" }, include: { product: true } }),
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Videos</h1>

      <form action={createVideo} className="mb-10 grid max-w-2xl gap-3 sm:grid-cols-2">
        <input name="title" required placeholder="Title" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <select name="productId" className="border border-navy/20 bg-white px-3 py-2 text-sm">
          <option value="">No linked product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select name="type" className="border border-navy/20 bg-white px-3 py-2 text-sm">
          <option value="PRODUCT_SHOWCASE">Product showcase</option>
          <option value="FABRIC_TEXTURE">Fabric texture</option>
          <option value="COLOR_SHOWCASE">Color showcase</option>
          <option value="COLLECTION">Collection</option>
          <option value="PROMOTIONAL">Promotional</option>
        </select>
        <input name="url" required placeholder="Video URL" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <input name="thumbnailUrl" placeholder="Thumbnail URL" className="border border-navy/20 bg-white px-3 py-2 text-sm sm:col-span-2" />
        <input name="description" placeholder="Description (optional)" className="border border-navy/20 bg-white px-3 py-2 text-sm sm:col-span-2" />
        <button className="bg-navy px-5 py-2 text-sm text-cream sm:col-span-2">Add video</button>
      </form>

      <div className="divide-y divide-navy/5 border-y border-navy/10 bg-white">
        {videos.map((v) => (
          <div key={v.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="text-navy">{v.title}</p>
              <p className="text-xs text-navy/50">
                {v.type.replace("_", " ")} {v.product ? `· ${v.product.name}` : ""}
              </p>
            </div>
            <div className="flex gap-4">
              <form action={async () => { "use server"; await togglePublish(v.id, !v.isPublished); }}>
                <button className={v.isPublished ? "text-green-700" : "text-navy/40"}>
                  {v.isPublished ? "Published" : "Draft"}
                </button>
              </form>
              <form action={async () => { "use server"; await deleteVideo(v.id); }}>
                <button className="text-red-700">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
