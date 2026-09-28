"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import type { VideoItem } from "@/lib/media";

function VideoCard({
  video,
  playing,
  onPlay,
  onStop,
}: {
  video: VideoItem;
  playing: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const portrait = video.orientation === "portrait";

  return (
    <div className={`group relative overflow-hidden bg-navy ${portrait ? "aspect-[9/16]" : "aspect-video"}`}>
      {playing ? (
        <video
          src={video.url}
          poster={video.thumbnailUrl ?? undefined}
          controls
          autoPlay
          playsInline
          onEnded={onStop}
          className="h-full w-full object-cover"
        />
      ) : (
        <button type="button" className="absolute inset-0 h-full w-full text-left" onClick={onPlay} aria-label={`Play ${video.title}`}>
          {video.thumbnailUrl && (
            <Image
              src={video.thumbnailUrl}
              alt=""
              fill
              className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
              sizes={portrait ? "(min-width: 1024px) 25vw, 50vw" : "(min-width: 1024px) 50vw, 100vw"}
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/90 text-navy transition-transform group-hover:scale-110">
              <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
            </span>
          </span>
          <span className="absolute inset-x-4 bottom-4 text-cream">
            <span className="block text-sm">{video.title}</span>
            {video.description && <span className="mt-0.5 block text-xs text-cream/70">{video.description}</span>}
          </span>
        </button>
      )}
      {!playing && video.productSlug && (
        <Link
          href={`/product/${video.productSlug}`}
          className="absolute right-3 top-3 bg-cream/90 px-3 py-1 text-xs text-navy hover:bg-gold"
        >
          Shop {video.productName}
        </Link>
      )}
    </div>
  );
}

export function VideoGalleryGrid({ videos }: { videos: VideoItem[] }) {
  // One shared piece of state across both grids: only one video plays at a time.
  const [playingId, setPlayingId] = useState<string | null>(null);

  const films = videos.filter((v) => v.orientation === "landscape");
  const shorts = videos.filter((v) => v.orientation === "portrait");

  const renderCard = (v: VideoItem) => (
    <VideoCard
      key={v.id}
      video={v}
      playing={playingId === v.id}
      onPlay={() => setPlayingId(v.id)}
      onStop={() => setPlayingId((cur) => (cur === v.id ? null : cur))}
    />
  );

  return (
    <div className="space-y-16">
      {films.length > 0 && (
        <section>
          <h2 className="mb-6 font-display text-xl text-navy">Films</h2>
          <div className="grid gap-5 sm:grid-cols-2">{films.map(renderCard)}</div>
        </section>
      )}
      {shorts.length > 0 && (
        <section>
          <h2 className="mb-6 font-display text-xl text-navy">Quick looks</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">{shorts.map(renderCard)}</div>
        </section>
      )}
    </div>
  );
}
