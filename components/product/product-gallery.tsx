"use client";

import Image from "next/image";
import { useState } from "react";
import { FALLBACK_PRODUCT_IMAGE, isPlaceholderUrl } from "@/lib/media";

export function ProductGallery({ images, name }: { images: { url: string; alt: string | null }[]; name: string }) {
  const [active, setActive] = useState(0);
  const real = images.filter((img) => !isPlaceholderUrl(img.url));
  const gallery = real.length > 0 ? real : [{ url: FALLBACK_PRODUCT_IMAGE, alt: name }];

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      <div className="flex gap-3 sm:flex-col">
        {gallery.map((img, i) => (
          <button
            key={img.url + i}
            onClick={() => setActive(i)}
            className={`relative h-20 w-16 flex-shrink-0 overflow-hidden border ${
              active === i ? "border-gold" : "border-transparent"
            }`}
          >
            <Image src={img.url} alt={img.alt ?? name} fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-cream">
        <Image
          src={gallery[active]?.url ?? FALLBACK_PRODUCT_IMAGE}
          alt={gallery[active]?.alt ?? name}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </div>
    </div>
  );
}
