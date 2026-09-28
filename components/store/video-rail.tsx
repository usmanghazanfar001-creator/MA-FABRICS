"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { VideoItem } from "@/lib/media";

export function VideoRail({ videos }: { videos: VideoItem[] }) {
  // Single piece of state = only one video can ever be playing.
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2 lg:mx-0 lg:px-0">
      {videos.map((v) => {
        const portrait = v.orientation === "portrait";
        return (
          <div
            key={v.id}
            className={`group relative h-80 flex-shrink-0 snap-start overflow-hidden bg-navy sm:h-[26rem] ${
              portrait ? "aspect-[9/16]" : "aspect-video"
            }`}
          >
            {playingId === v.id ? (
              <video
                src={v.url}
                poster={v.thumbnailUrl ?? undefined}
                controls
                autoPlay
                playsInline
                onEnded={() => setPlayingId(null)}
                className="h-full w-full object-cover"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlayingId(v.id)}
                aria-label={`Play ${v.title}`}
                className="absolute inset-0 h-full w-full text-left"
              >
                {v.thumbnailUrl && (
                  <Image
                    src={v.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    sizes={portrait ? "240px" : "760px"}
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/90 text-navy transition-transform group-hover:scale-110">
                    <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
                  </span>
                </span>
                <span className="absolute inset-x-4 bottom-4 text-sm text-cream">{v.title}</span>
              </button>
            )}
            {playingId !== v.id && v.productSlug && (
              <Link
                href={`/product/${v.productSlug}`}
                className="absolute right-3 top-3 bg-cream/90 px-3 py-1 text-xs text-navy hover:bg-gold"
              >
                Shop {v.productName}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
