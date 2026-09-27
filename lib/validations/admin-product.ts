import { z } from "zod";

export const adminProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  sku: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  categoryId: z.string().optional(),
  collectionId: z.string().optional(),
  fabricType: z.string().optional(),
  texture: z.string().optional(),
  season: z.enum(["ALL_SEASON", "SUMMER", "WINTER"]),
  recommendedUse: z.string().optional(),
  stockMeters: z.coerce.number().int().nonnegative(),
  colorIds: z.array(z.string()).default([]),
  imageUrls: z.array(z.string()).default([]),
  isFeatured: z.coerce.boolean().default(false),
  isNewArrival: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(false),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;
