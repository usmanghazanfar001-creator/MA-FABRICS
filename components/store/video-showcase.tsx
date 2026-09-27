import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

const VIDEOS = [
  { title: "MA Hawal — Fabric Showcase", thumb: "/placeholder-video-1.jpg" },
  { title: "Winter Collection — Texture", thumb: "/placeholder-video-2.jpg" },
  { title: "Color Showcase", thumb: "/placeholder-video-3.jpg" },
  { title: "Behind the Weave", thumb: "/placeholder-video-4.jpg" },
];

export function VideoShowcase() {
  return (
    <section className="bg-cream px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl text-navy sm:text-4xl">In motion</h2>
          <Link href="/videos" className="hidden text-sm text-navy/70 hover:text-gold-dark sm:block">
            View all videos
          </Link>
        </div>
        <div className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2 lg:mx-0 lg:px-0">
          {VIDEOS.map((v) => (
            <Link
              key={v.title}
              href="/videos"
              className="group relative aspect-[9/16] w-56 flex-shrink-0 snap-start overflow-hidden bg-navy sm:w-64"
            >
              <Image src={v.thumb} alt={v.title} fill className="object-cover opacity-90 transition-opacity group-hover:opacity-70" sizes="256px" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream/90 text-navy">
                  <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
                </span>
              </span>
              <span className="absolute bottom-4 left-4 right-4 text-left text-sm text-cream">{v.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
