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
  printedSuitSet: "/media/images/printed-suit-set.jpg",
  charcoalSelvedge: "/media/images/charcoal-selvedge.jpg",
  blackPinstripeSelvedge: "/media/images/black-pinstripe-selvedge.jpg",
  blackSatinDrape: "/media/images/black-satin-drape.jpg",
  swatchFanDeck: "/media/images/swatch-fan-deck.jpg",
  stripedBundle: "/media/images/striped-bundle.jpg",
  superiorBolts: "/media/images/superior-bolts.jpg",
  italianWoolBundles: "/media/images/italian-wool-bundles.jpg",
  woolSelvedgeCloseup: "/media/images/wool-selvedge-closeup.jpg",
  embroideredSuitSet: "/media/images/embroidered-suit-set.jpg",
} as const;

export const FALLBACK_PRODUCT_IMAGE = IMAGES.neutralRack;

const IMAGE_POOL: string[] = [
  IMAGES.neutralRack,
  IMAGES.heritageRobe,
  IMAGES.colourRack,
  IMAGES.printedCloseup,
  IMAGES.beigeHangers,
  IMAGES.printedSuitSet,
  IMAGES.charcoalSelvedge,
  IMAGES.blackPinstripeSelvedge,
  IMAGES.blackSatinDrape,
  IMAGES.swatchFanDeck,
  IMAGES.stripedBundle,
  IMAGES.superiorBolts,
  IMAGES.italianWoolBundles,
  IMAGES.woolSelvedgeCloseup,
  IMAGES.embroideredSuitSet,
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
  "premium-suiting": IMAGES.superiorBolts,
  "summer-collection": IMAGES.colourRack,
  "winter-collection": IMAGES.italianWoolBundles,
  "luxury-collection": IMAGES.embroideredSuitSet,
  unstitched: IMAGES.printedSuitSet,
};

const CATEGORY_IMAGES: Record<string, string> = {
  suiting: IMAGES.blackPinstripeSelvedge,
  unstitched: IMAGES.printedSuitSet,
  summer: IMAGES.colourRack,
  winter: IMAGES.woolSelvedgeCloseup,
  premium: IMAGES.italianWoolBundles,
  luxury: IMAGES.embroideredSuitSet,
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
  {
    id: "showcase-fabric-wall-browse",
    title: "Walking the fabric wall",
    description: "Shelf after shelf of suiting, ready to choose from.",
    url: "/media/videos/fabric-wall-browse.mp4",
    thumbnailUrl: "/media/posters/fabric-wall-browse.jpg",
    orientation: "portrait",
  },
  {
    id: "showcase-shade-by-shade",
    title: "Shade by shade",
    description: "Every tone, folded and ready to compare.",
    url: "/media/videos/shade-by-shade.mp4",
    thumbnailUrl: "/media/posters/shade-by-shade.jpg",
    orientation: "portrait",
  },
];

/**
 * Admin-published videos first (they're the real content), then the built-in
 * showcase films. Legacy placeholder videos left over from early seed data are dropped.
 */
export function mergeVideos(
  dbVideos: {
    id: string;
    title: string;
    description: string | null;
    url: string;
    thumbnailUrl: string | null;
    orientation: "LANDSCAPE" | "PORTRAIT";
    product?: { slug: string; name: string } | null;
  }[]
): VideoItem[] {
  const real: VideoItem[] = dbVideos
    .filter((v) => !isPlaceholderUrl(v.url))
    .map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description ?? undefined,
      url: v.url,
      thumbnailUrl: v.thumbnailUrl,
      orientation: v.orientation === "PORTRAIT" ? ("portrait" as const) : ("landscape" as const),
      productSlug: v.product?.slug,
      productName: v.product?.name,
    }));
  return [...real, ...SHOWCASE_VIDEOS];
}

// ---------- Gallery photos ----------

export interface PhotoItem {
  id: string;
  title: string;
  caption?: string;
  url: string;
}

/** Built-in gallery shown only until the admin publishes at least one photo. */
export const SHOWCASE_PHOTOS: PhotoItem[] = [
  { id: "showcase-boutique", title: "Inside the boutique", url: IMAGES.boutique },
  { id: "showcase-superior-bolts", title: "Superior suiting bolts", url: IMAGES.superiorBolts },
  { id: "showcase-swatch-fan", title: "Swatch fan deck", url: IMAGES.swatchFanDeck },
  { id: "showcase-colour-rack", title: "The colour rack", url: IMAGES.colourRack },
  { id: "showcase-italian-wool", title: "Italian wool bundles", url: IMAGES.italianWoolBundles },
  { id: "showcase-embroidered", title: "Embroidered suit set", url: IMAGES.embroideredSuitSet },
  { id: "showcase-pinstripe", title: "Black pinstripe selvedge", url: IMAGES.blackPinstripeSelvedge },
  { id: "showcase-satin", title: "Black satin drape", url: IMAGES.blackSatinDrape },
  { id: "showcase-printed", title: "Printed suit set", url: IMAGES.printedSuitSet },
];

/** Admin-published photos win outright; the built-in set only fills an empty gallery. */
export function mergePhotos(
  dbPhotos: { id: string; title: string; caption: string | null; url: string }[]
): PhotoItem[] {
  const real: PhotoItem[] = dbPhotos
    .filter((p) => !isPlaceholderUrl(p.url))
    .map((p) => ({ id: p.id, title: p.title, caption: p.caption ?? undefined, url: p.url }));
  return real.length > 0 ? real : SHOWCASE_PHOTOS;
}
