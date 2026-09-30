import { prisma } from "@/lib/db/prisma";
import { ShopByCategoryGrid } from "@/components/store/shop-by-category-grid";
import { categoryImage } from "@/lib/media";
import { SectionHeading } from "@/components/store/section-heading";

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
        <SectionHeading eyebrow="Browse" title="Shop by category" tone="light" />
        <ShopByCategoryGrid
          categories={categories.map((c, i) => ({ slug: c.slug, name: c.name, imageUrl: categoryImage(c.slug, c.imageUrl, i) }))}
        />
      </div>
    </section>
  );
}
