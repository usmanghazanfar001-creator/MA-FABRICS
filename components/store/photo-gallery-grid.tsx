"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PhotoItem } from "@/lib/media";

// next/image only accepts configured hosts; anything else (e.g. a pasted URL) is served as-is.
const optimizable = (url: string) => url.startsWith("/") || url.startsWith("https://res.cloudinary.com/") || /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(url);

export function PhotoGalleryGrid({ photos }: { photos: PhotoItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open !== null ? photos[open] : undefined;

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative block w-full overflow-hidden bg-navy/5 text-left"
            aria-label={`View ${p.title}`}
          >
            {/* Natural aspect ratio is unknown up front, so width/height are a layout hint only. */}
            <Image
              src={p.url}
              alt={p.title}
              width={800}
              height={1000}
              unoptimized={!optimizable(p.url)}
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent px-3 pb-3 pt-8 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100">
              {p.title}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/95 p-4"
          onClick={close}
        >
          <button type="button" aria-label="Close" onClick={close} className="absolute right-5 top-5 text-cream">
            <X className="h-6 w-6" />
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                className="absolute left-3 text-cream sm:left-6"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                className="absolute right-3 text-cream sm:right-6"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-5xl text-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.title} className="mx-auto max-h-[80vh] w-auto object-contain" />
            <figcaption className="mt-3 text-sm text-cream">
              {current.title}
              {current.caption && <span className="block text-xs text-cream/70">{current.caption}</span>}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
