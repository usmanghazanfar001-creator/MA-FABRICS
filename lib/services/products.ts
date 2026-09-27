import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { ShopFilters } from "@/lib/validations/shop-filters";

const PAGE_SIZE = 12;

function buildOrderBy(sort: ShopFilters["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "newest":
      return { createdAt: "desc" };
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "name-asc":
      return { name: "asc" };
    case "featured":
    default:
      return { isFeatured: "desc" };
  }
}

export async function getShopProducts(filters: ShopFilters) {
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
    deletedAt: null,
    ...(filters.q && {
      OR: [
        { name: { contains: filters.q, mode: "insensitive" } },
        { sku: { contains: filters.q, mode: "insensitive" } },
        { category: { name: { contains: filters.q, mode: "insensitive" } } },
        { colors: { some: { color: { name: { contains: filters.q, mode: "insensitive" } } } } },
      ],
    }),
    ...(filters.category && { category: { slug: filters.category } }),
    ...(filters.collection && { collection: { slug: filters.collection } }),
    ...(filters.color && { colors: { some: { color: { name: filters.color } } } }),
    ...(filters.featured && { isFeatured: true }),
    ...(filters.newArrival && { isNewArrival: true }),
    ...((filters.minPrice !== undefined || filters.maxPrice !== undefined) && {
      price: {
        ...(filters.minPrice !== undefined && { gte: filters.minPrice }),
        ...(filters.maxPrice !== undefined && { lte: filters.maxPrice }),
      },
    }),
    ...(filters.inStock && { inventory: { stockMeters: { gt: 0 } } }),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(filters.sort),
      skip: (filters.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        category: true,
        collection: true,
        images: { orderBy: { position: "asc" }, take: 2 },
        colors: { include: { color: true } },
        inventory: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isPublished: true, deletedAt: null },
    include: {
      category: true,
      collection: true,
      images: { orderBy: { position: "asc" } },
      videos: { where: { isPublished: true }, orderBy: { position: "asc" } },
      colors: { include: { color: true } },
      inventory: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null) {
  if (!categoryId) return [];
  return prisma.product.findMany({
    where: {
      id: { not: productId },
      categoryId,
      isPublished: true,
      deletedAt: null,
    },
    take: 4,
    include: { images: { take: 1 }, colors: { include: { color: true } } },
  });
}

export async function getFilterFacets() {
  const [categories, collections, colors] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.collection.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.color.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);
  return { categories, collections, colors };
}
