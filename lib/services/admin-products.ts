"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { adminProductSchema } from "@/lib/validations/admin-product";

export async function listAdminProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { category: true, inventory: true, images: { take: 1 } },
  });
}

export async function getAdminProduct(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({
    where: { id },
    include: { colors: true, inventory: true, images: { orderBy: { position: "asc" } } },
  });
}

export async function getProductFormOptions() {
  await requireAdmin();
  const [categories, collections, colors] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { categories, collections, colors };
}

export interface AdminActionResult {
  success: boolean;
  error?: string;
  productId?: string;
}

export async function createAdminProduct(input: unknown): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = adminProductSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
  const data = parsed.data;

  const existing = await prisma.product.findFirst({ where: { OR: [{ slug: data.slug }, { sku: data.sku }] } });
  if (existing) return { success: false, error: "A product with this slug or SKU already exists." };

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      compareAtPrice: data.compareAtPrice || undefined,
      categoryId: data.categoryId || undefined,
      collectionId: data.collectionId || undefined,
      fabricType: data.fabricType,
      texture: data.texture,
      season: data.season,
      recommendedUse: data.recommendedUse,
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isPublished: data.isPublished,
      colors: { create: data.colorIds.map((colorId) => ({ colorId })) },
      images: { create: data.imageUrls.map((url, position) => ({ url, position })) },
      inventory: { create: { stockMeters: data.stockMeters } },
    },
  });

  revalidatePath("/admin/products");
  return { success: true, productId: product.id };
}

export async function updateAdminProduct(id: string, input: unknown): Promise<AdminActionResult> {
  await requireAdmin();
  const parsed = adminProductSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.errors[0]?.message };
  const data = parsed.data;

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        categoryId: data.categoryId || null,
        collectionId: data.collectionId || null,
        fabricType: data.fabricType,
        texture: data.texture,
        season: data.season,
        recommendedUse: data.recommendedUse,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isPublished: data.isPublished,
      },
    }),
    prisma.productColor.deleteMany({ where: { productId: id } }),
    prisma.productColor.createMany({ data: data.colorIds.map((colorId) => ({ productId: id, colorId })) }),
    prisma.productImage.deleteMany({ where: { productId: id } }),
    prisma.productImage.createMany({
      data: data.imageUrls.map((url, position) => ({ productId: id, url, position })),
    }),
    prisma.inventory.upsert({
      where: { productId: id },
      update: { stockMeters: data.stockMeters },
      create: { productId: id, stockMeters: data.stockMeters },
    }),
  ]);

  revalidatePath("/admin/products");
  revalidatePath(`/product/${data.slug}`);
  return { success: true, productId: id };
}

export async function deleteAdminProduct(id: string) {
  await requireAdmin();
  // Soft delete — preserves order history referencing this product.
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date(), isPublished: false } });
  revalidatePath("/admin/products");
}

export async function toggleProductField(
  id: string,
  field: "isPublished" | "isFeatured" | "isNewArrival",
  value: boolean
) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { [field]: value } });
  revalidatePath("/admin/products");
}
