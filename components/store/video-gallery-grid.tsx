"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  type: string;
  productSlug?: string;
  productName?: string;
}

export function VideoGalleryGrid({ videos }: { videos: VideoItem[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  function handlePlay(id: string) {
    // Ensure only one video plays at a time.
    Object.entries(videoRefs.current).forEach(([key, el]) => {
      if (key !== id && el && !el.paused) el.pause();
    });
    setPlayingId(id);
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {videos.map((v) => (
        <div key={v.id} className="group relative aspect-[9/16] overflow-hidden bg-navy">
          {playingId === v.id ? (
            <video
              ref={(el) => { videoRefs.current[v.id] = el; }}
              src={v.url}
              controls
              autoPlay
              onPause={() => setPlayingId((cur) => (cur === v.id ? null : cur))}
              className="h-full w-full object-cover"
            />
          ) : (
            <button className="absolute inset-0 h-full w-full" onClick={() => handlePlay(v.id)}>
              {v.thumbnailUrl && (
                <Image src={v.thumbnailUrl} alt={v.title} fill className="object-cover opacity-90 transition-opacity group-hover:opacity-70" sizes="(min-width: 1024px) 25vw, 33vw" />
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/90 text-navy">
                  <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
                </span>
              </span>
            </button>
          )}

          <div className="absolute bottom-3 left-3 right-3 text-cream">
            <p className="text-sm">{v.title}</p>
            {v.productSlug && (
              <Link href={`/product/${v.productSlug}`} className="text-xs text-gold underline">
                Shop {v.productName}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
