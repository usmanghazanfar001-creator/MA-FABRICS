import { z } from "zod";

export const sortOptions = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
] as const;

export const shopFiltersSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().optional(),
  collection: z.string().optional(),
  color: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  inStock: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  newArrival: z.coerce.boolean().optional(),
  sort: z.enum(sortOptions).default("featured"),
  page: z.coerce.number().int().positive().default(1),
});

export type ShopFilters = z.infer<typeof shopFiltersSchema>;

/** Next.js gives searchParams as string | string[] | undefined — normalize before validating. */
export function parseShopSearchParams(
  raw: Record<string, string | string[] | undefined>
): ShopFilters {
  const flat = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  return shopFiltersSchema.parse(flat);
}
