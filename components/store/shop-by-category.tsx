import { prisma } from "@/lib/db/prisma";
import { ShopByCategoryGrid } from "@/components/store/shop-by-category-grid";

export async function ShopByCategory() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    take: 8,
  });

  if (categories.length === 0) return null;

  return (
    <section className="section-navy px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 font-display text-3xl sm:text-4xl">Shop by category</h2>
        <ShopByCategoryGrid
          categories={categories.map((c) => ({ slug: c.slug, name: c.name, imageUrl: c.imageUrl }))}
        />
      </div>
    </section>
  );
}
