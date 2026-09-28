/**
 * Built-in showcase media (files live in /public/media).
 *
 * These act as default content so the storefront never looks empty. Anything an
 * admin uploads through the dashboard (real product photos / videos) always
 * takes priority — see resolveImage() and mergeVideos() below.
 */

export const IMAGES = {
  heritageRobe: "/media/images/heritage-robe.jpg",
  neutralRack: "/media/images/neutral-rack.jpg",
  printedCloseup: "/media/images/printed-closeup.jpg",
  colourRack: "/media/images/colour-rack.jpg",
  beigeHangers: "/media/images/beige-hangers.jpg",
  boutique: "/media/images/boutique-interior.jpg",
} as const;

export const FALLBACK_PRODUCT_IMAGE = IMAGES.neutralRack;

const IMAGE_POOL: string[] = [
  IMAGES.neutralRack,
  IMAGES.heritageRobe,
  IMAGES.colourRack,
  IMAGES.printedCloseup,
  IMAGES.beigeHangers,
];

export function pickImage(index: number): string {
  return IMAGE_POOL[Math.abs(index) % IMAGE_POOL.length] ?? FALLBACK_PRODUCT_IMAGE;
}

/** True for empty values and for the legacy "/placeholder-*.jpg" paths that were seeded earlier. */
export function isPlaceholderUrl(url: string | null | undefined): boolean {
  return !url || url.startsWith("/placeholder");
}

/** Returns the real URL, or a built-in photo if the URL is missing/legacy-placeholder. */
export function resolveImage(url: string | null | undefined, fallback: string = FALLBACK_PRODUCT_IMAGE): string {
  return url && !isPlaceholderUrl(url) ? url : fallback;
}

/** Returns the URL only if it's a real image (not missing / legacy placeholder). */
export function realImage(url: string | null | undefined): string | undefined {
  return url && !isPlaceholderUrl(url) ? url : undefined;
}

const COLLECTION_IMAGES: Record<string, string> = {
  "premium-suiting": IMAGES.neutralRack,
  "summer-collection": IMAGES.colourRack,
  "winter-collection": IMAGES.heritageRobe,
  "luxury-collection": IMAGES.printedCloseup,
  unstitched: IMAGES.beigeHangers,
};

const CATEGORY_IMAGES: Record<string, string> = {
  suiting: IMAGES.neutralRack,
  unstitched: IMAGES.beigeHangers,
  summer: IMAGES.colourRack,
  winter: IMAGES.heritageRobe,
  premium: IMAGES.printedCloseup,
  luxury: IMAGES.heritageRobe,
};

export function collectionImage(slug: string, url: string | null | undefined, index = 0): string {
  return url && !isPlaceholderUrl(url) ? url : COLLECTION_IMAGES[slug] ?? pickImage(index);
}

export function categoryImage(slug: string, url: string | null | undefined, index = 0): string {
  return url && !isPlaceholderUrl(url) ? url : CATEGORY_IMAGES[slug] ?? pickImage(index);
}

// ---------- Video ----------

export type VideoOrientation = "portrait" | "landscape";

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string | null;
  orientation: VideoOrientation;
  productSlug?: string;
  productName?: string;
}

export const HERO_VIDEOS = {
  fabricTouch: {
    src: "/media/videos/fabric-touch.mp4",
    poster: "/media/posters/fabric-touch.jpg",
  },
  velvetSwatches: {
    src: "/media/videos/velvet-swatches.mp4",
    poster: "/media/posters/velvet-swatches.jpg",
  },
} as const;

/** Default films shown on the homepage rail and /videos until the admin publishes their own. */
export const SHOWCASE_VIDEOS: VideoItem[] = [
  {
    id: "showcase-fabric-touch",
    title: "The feel of fine suiting",
    description: "A hand-on look at weave and texture.",
    url: HERO_VIDEOS.fabricTouch.src,
    thumbnailUrl: HERO_VIDEOS.fabricTouch.poster,
    orientation: "landscape",
  },
  {
    id: "showcase-velvet-swatches",
    title: "Swatches, up close",
    description: "Running a hand across soft, heavy weaves.",
    url: HERO_VIDEOS.velvetSwatches.src,
    thumbnailUrl: HERO_VIDEOS.velvetSwatches.poster,
    orientation: "landscape",
  },
  {
    id: "showcase-everyday-essentials",
    title: "Everyday essentials",
    description: "Clean lines that start with the right cloth.",
    url: "/media/videos/everyday-essentials.mp4",
    thumbnailUrl: "/media/posters/everyday-essentials.jpg",
    orientation: "portrait",
  },
  {
    id: "showcase-inside-the-boutique",
    title: "Inside the boutique",
    description: "Browsing the rack, one piece at a time.",
    url: "/media/videos/inside-the-boutique.mp4",
    thumbnailUrl: "/media/posters/inside-the-boutique.jpg",
    orientation: "portrait",
  },
  {
    id: "showcase-styled-for-the-season",
    title: "Styled for the season",
    description: "Layers, prints and denim in motion.",
    url: "/media/videos/styled-for-the-season.mp4",
    thumbnailUrl: "/media/posters/styled-for-the-season.jpg",
    orientation: "portrait",
  },
];

/**
 * Admin-published videos first (they're the real content), then the built-in
 * showcase films. Legacy placeholder videos left over from early seed data are dropped.
 */
export function mergeVideos(
  dbVideos: { id: string; title: string; description: string | null; url: string; thumbnailUrl: string | null; product?: { slug: string; name: string } | null }[]
): VideoItem[] {
  const real: VideoItem[] = dbVideos
    .filter((v) => !isPlaceholderUrl(v.url))
    .map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description ?? undefined,
      url: v.url,
      thumbnailUrl: v.thumbnailUrl,
      orientation: "landscape" as const,
      productSlug: v.product?.slug,
      productName: v.product?.name,
    }));
  return [...real, ...SHOWCASE_VIDEOS];
}
