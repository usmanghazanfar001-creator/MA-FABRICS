"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export function VideoPlayer({ url, thumbnailUrl, title }: { url: string; thumbnailUrl: string | null; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video src={url} controls autoPlay className="h-full w-full object-cover" onPause={() => {}} />
    );
  }

  return (
    <button className="relative h-full w-full" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
      {thumbnailUrl && <Image src={thumbnailUrl} alt={title} fill className="object-cover opacity-80" />}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 text-navy">
          <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}
