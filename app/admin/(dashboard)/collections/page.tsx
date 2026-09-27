import Image from "next/image";
import { listCollections, createCollection, toggleCollectionActive, deleteCollection } from "@/lib/services/admin-catalog";
import { SingleImageField } from "@/components/admin/single-image-field";

export default async function AdminCollectionsPage() {
  const collections = await listCollections();

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl text-navy">Collections</h1>
      <p className="mb-8 text-sm text-navy/50">
        Active collections appear in the homepage's Featured Collections section, in this order.
      </p>

      <form action={createCollection} className="mb-10 flex max-w-lg flex-wrap items-end gap-3">
        <input name="name" required placeholder="Collection name" className="flex-1 border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold" />
        <input name="description" placeholder="Description (optional)" className="flex-1 border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold" />
        <SingleImageField name="imageUrl" label="Image" folder="categories" />
        <button className="bg-navy px-5 py-2 text-sm text-cream">Add</button>
      </form>

      <div className="divide-y divide-navy/5 border-y border-navy/10 bg-white">
        {collections.map((c) => (
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
              <form action={async () => { "use server"; await toggleCollectionActive(c.id, !c.isActive); }}>
                <button className={c.isActive ? "text-green-700" : "text-navy/40"}>
                  {c.isActive ? "Shown on homepage" : "Hidden"}
                </button>
              </form>
              <form action={async () => { "use server"; await deleteCollection(c.id); }}>
                <button className="text-red-700">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
