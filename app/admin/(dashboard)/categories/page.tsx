import { listCategories, createCategory, toggleCategoryActive, deleteCategory } from "@/lib/services/admin-catalog";
import { SingleImageField } from "@/components/admin/single-image-field";
import Image from "next/image";

export default async function AdminCategoriesPage() {
  const categories = await listCategories();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Categories</h1>

      <form action={createCategory} className="mb-10 flex max-w-lg flex-wrap items-end gap-3">
        <input name="name" required placeholder="Category name" className="flex-1 border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold" />
        <input name="description" placeholder="Description (optional)" className="flex-1 border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold" />
        <SingleImageField name="imageUrl" label="Image" folder="categories" />
        <button className="bg-navy px-5 py-2 text-sm text-cream">Add</button>
      </form>

      <div className="divide-y divide-navy/5 border-y border-navy/10 bg-white">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div className="flex items-center gap-3">
              {c.imageUrl && (
                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden border border-navy/10">
                  <Image src={c.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                </div>
              )}
              <div>
                <p className="text-navy">{c.name}</p>
                <p className="text-xs text-navy/40">{c._count.products} products</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <form action={async () => { "use server"; await toggleCategoryActive(c.id, !c.isActive); }}>
                <button className={c.isActive ? "text-green-700" : "text-navy/40"}>
                  {c.isActive ? "Active" : "Inactive"}
                </button>
              </form>
              <form action={async () => { "use server"; await deleteCategory(c.id); }}>
                <button className="text-red-700">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
