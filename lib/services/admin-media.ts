"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { MediaOrientation, VideoType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { deleteStoredMedia } from "@/lib/storage/providers";

const mediaUrl = z
  .string()
  .trim()
  .min(1, "Upload a file or paste a URL.")
  .refine((v) => /^https?:\/\//i.test(v) || v.startsWith("/"), "Must be an http(s) URL or a /path.");

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\//i.test(v) || v.startsWith("/"), "Must be an http(s) URL or a /path.")
  .transform((v) => v || undefined);

const photoSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120),
  caption: z.string().trim().max(300).optional(),
  url: mediaUrl,
});

const VIDEO_TYPES = ["PRODUCT_SHOWCASE", "FABRIC_TEXTURE", "COLOR_SHOWCASE", "COLLECTION", "PROMOTIONAL"] as const;

const videoSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120),
  description: z.string().trim().max(300).optional(),
  url: mediaUrl,
  thumbnailUrl: optionalUrl,
  productId: z.string().trim().optional(),
  type: z.enum(VIDEO_TYPES),
  orientation: z.enum(["LANDSCAPE", "PORTRAIT"]),
});

function formValues(formData: FormData) {
  return Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, typeof v === "string" ? v : ""]));
}

function revalidatePhotos() {
  revalidatePath("/admin/photos");
  revalidatePath("/gallery");
}

function revalidateVideos() {
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  revalidatePath("/");
}

// ---------------- Photos ----------------

/** Saves freshly uploaded photos as drafts at the end of the list. */
export async function createPhotos(items: { title: string; url: string }[]) {
  await requireAdmin();
  const parsed = items.map((i) => photoSchema.parse(i)).slice(0, 50);
  if (!parsed.length) return;
  const last = await prisma.galleryPhoto.aggregate({ _max: { position: true } });
  const start = (last._max.position ?? -1) + 1;
  await prisma.galleryPhoto.createMany({
    data: parsed.map((p, i) => ({ title: p.title, url: p.url, position: start + i })),
  });
  revalidatePhotos();
}

export async function createPhoto(formData: FormData) {
  await requireAdmin();
  const data = photoSchema.parse(formValues(formData));
  const last = await prisma.galleryPhoto.aggregate({ _max: { position: true } });
  await prisma.galleryPhoto.create({
    data: { ...data, caption: data.caption || undefined, position: (last._max.position ?? -1) + 1 },
  });
  revalidatePhotos();
}

export async function updatePhoto(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = photoSchema.parse(formValues(formData));
  const existing = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.galleryPhoto.update({ where: { id }, data: { ...data, caption: data.caption || null } });
  if (existing.url !== data.url) await deleteStoredMedia(existing.url, "image");
  revalidatePhotos();
}

export async function setPhotoPublished(id: string, isPublished: boolean) {
  await requireAdmin();
  await prisma.galleryPhoto.update({ where: { id }, data: { isPublished } });
  revalidatePhotos();
}

export async function deletePhoto(id: string) {
  await requireAdmin();
  const photo = await prisma.galleryPhoto.findUnique({ where: { id } });
  if (!photo) return;
  await prisma.galleryPhoto.delete({ where: { id } });
  await deleteStoredMedia(photo.url, "image");
  revalidatePhotos();
}

export async function movePhoto(id: string, direction: "up" | "down") {
  await requireAdmin();
  const all = await prisma.galleryPhoto.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const ids = reorder(all.map((x) => x.id), id, direction);
  if (!ids) return;
  await prisma.$transaction(ids.map((pid, position) => prisma.galleryPhoto.update({ where: { id: pid }, data: { position } })));
  revalidatePhotos();
}

// ---------------- Videos ----------------

export async function createVideo(formData: FormData) {
  await requireAdmin();
  const data = videoSchema.parse(formValues(formData));
  const last = await prisma.productVideo.aggregate({ _max: { position: true } });
  await prisma.productVideo.create({
    data: {
      title: data.title,
      description: data.description || undefined,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl,
      productId: data.productId || undefined,
      type: data.type as VideoType,
      orientation: data.orientation as MediaOrientation,
      position: (last._max.position ?? -1) + 1,
    },
  });
  revalidateVideos();
}

export async function updateVideo(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const data = videoSchema.parse(formValues(formData));
  const existing = await prisma.productVideo.findUnique({ where: { id } });
  if (!existing) return;
  await prisma.productVideo.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl ?? null,
      productId: data.productId || null,
      type: data.type as VideoType,
      orientation: data.orientation as MediaOrientation,
    },
  });
  if (existing.url !== data.url) await deleteStoredMedia(existing.url, "video");
  if (existing.thumbnailUrl && existing.thumbnailUrl !== (data.thumbnailUrl ?? null)) {
    await deleteStoredMedia(existing.thumbnailUrl, "image");
  }
  revalidateVideos();
}

export async function setVideoPublished(id: string, isPublished: boolean) {
  await requireAdmin();
  await prisma.productVideo.update({ where: { id }, data: { isPublished } });
  revalidateVideos();
}

export async function deleteVideo(id: string) {
  await requireAdmin();
  const video = await prisma.productVideo.findUnique({ where: { id } });
  if (!video) return;
  await prisma.productVideo.delete({ where: { id } });
  await deleteStoredMedia(video.url, "video");
  await deleteStoredMedia(video.thumbnailUrl, "image");
  revalidateVideos();
}

export async function moveVideo(id: string, direction: "up" | "down") {
  await requireAdmin();
  const all = await prisma.productVideo.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const ids = reorder(all.map((x) => x.id), id, direction);
  if (!ids) return;
  await prisma.$transaction(ids.map((vid, position) => prisma.productVideo.update({ where: { id: vid }, data: { position } })));
  revalidateVideos();
}

// ---------------- helpers ----------------

function reorder(ids: string[], id: string, direction: "up" | "down"): string[] | null {
  const from = ids.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from === -1 || to < 0 || to >= ids.length) return null;
  const next = [...ids];
  [next[from], next[to]] = [next[to]!, next[from]!];
  return next;
}
