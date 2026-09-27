"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// --- Categories ---
export async function listCategories() {
  await requireAdmin();
  return prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "") || undefined;
  if (!name) return;
  await prisma.category.create({ data: { name, slug: slugify(name), description, imageUrl } });
  revalidatePath("/admin/categories");
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.category.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } }).catch(() => null); // no-op if referenced
  revalidatePath("/admin/categories");
}

// --- Collections ---
export async function listCollections() {
  await requireAdmin();
  return prisma.collection.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } });
}

export async function createCollection(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "") || undefined;
  if (!name) return;
  await prisma.collection.create({ data: { name, slug: slugify(name), description, imageUrl } });
  revalidatePath("/admin/collections");
  revalidatePath("/");
}

export async function toggleCollectionActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.collection.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/collections");
  revalidatePath("/");
}

export async function deleteCollection(id: string) {
  await requireAdmin();
  await prisma.collection.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/collections");
}

// --- Colors ---
export async function listColors() {
  await requireAdmin();
  return prisma.color.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { productColors: true } } } });
}

export async function createColor(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const hex = String(formData.get("hex") ?? "#000000");
  if (!name) return;
  await prisma.color.create({ data: { name, hex } });
  revalidatePath("/admin/colors");
}

export async function toggleColorActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.color.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/colors");
}
