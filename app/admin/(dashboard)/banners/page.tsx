import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { SingleImageField } from "@/components/admin/single-image-field";

async function createBanner(formData: FormData) {
  "use server";
  await requireAdmin();
  await prisma.banner.create({
    data: {
      title: String(formData.get("title")),
      subtitle: String(formData.get("subtitle") ?? "") || undefined,
      imageUrl: String(formData.get("imageUrl")),
      linkUrl: String(formData.get("linkUrl") ?? "") || undefined,
    },
  });
  revalidatePath("/admin/banners");
}

async function toggleActive(id: string, isActive: boolean) {
  "use server";
  await requireAdmin();
  await prisma.banner.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/banners");
}

export default async function AdminBannersPage() {
  await requireAdmin();
  const banners = await prisma.banner.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Banners</h1>

      <form action={createBanner} className="mb-10 grid max-w-2xl gap-3 sm:grid-cols-2">
        <input name="title" required placeholder="Title" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <input name="subtitle" placeholder="Subtitle (optional)" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <SingleImageField name="imageUrl" label="Banner image" folder="banners" />
        <input name="linkUrl" placeholder="Link URL (optional)" className="border border-navy/20 bg-white px-3 py-2 text-sm sm:col-span-2" />
        <button className="bg-navy px-5 py-2 text-sm text-cream sm:col-span-2">Add banner</button>
      </form>

      <div className="divide-y divide-navy/5 border-y border-navy/10 bg-white">
        {banners.map((b) => (
          <div key={b.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div className="flex items-center gap-3">
              {b.imageUrl && (
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden border border-navy/10">
                  <Image src={b.imageUrl} alt="" fill className="object-cover" sizes="48px" />
                </div>
              )}
              <div>
                <p className="text-navy">{b.title}</p>
                {b.subtitle && <p className="text-xs text-navy/50">{b.subtitle}</p>}
              </div>
            </div>
            <form action={async () => { "use server"; await toggleActive(b.id, !b.isActive); }}>
              <button className={b.isActive ? "text-green-700" : "text-navy/40"}>
                {b.isActive ? "Active" : "Inactive"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
