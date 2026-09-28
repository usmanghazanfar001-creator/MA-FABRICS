import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/lib/media";

export function AboutSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-28">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={IMAGES.boutique} alt="MA Fabrics workshop" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="font-display text-3xl text-navy sm:text-4xl">About MA</h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-navy/70 sm:text-base">
          MA Fabrics began with a simple belief: that fabric is the foundation of how
          people present themselves. We work with skilled weavers across Pakistan to
          bring together premium suiting and everyday fabrics that are built to be worn,
          not just displayed — chosen for their hand-feel, drape, and durability, season after season.
        </p>
        <div className="mt-8">
          <Button variant="outline" className="text-navy border-navy">Our story</Button>
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  { name: "Ahmed R.", rating: 5, text: "The suiting fabric drapes beautifully and the color was exactly as shown. Ordered a second length within a week." },
  { name: "Sana K.", rating: 5, text: "Stitched two kameez from the summer cotton — light, breathable, holds its shape well after washing." },
  { name: "Bilal H.", rating: 4, text: "Good quality for the price. Delivery took a couple of days longer than expected but worth the wait." },
];

export function ReviewsSection() {
  return (
    <section className="bg-cream px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 font-display text-3xl text-navy sm:text-4xl">What customers say</h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="border-t border-navy/15 pt-6">
              <div className="mb-3 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5" fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-navy/75">"{r.text}"</p>
              <p className="text-xs text-navy/50">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhatsAppCTA({ whatsappNumber }: { whatsappNumber: string }) {
  const digitsOnly = whatsappNumber.replace(/[^\d]/g, "");
  return (
    <section className="section-navy px-6 py-16 text-center lg:px-10">
      <div className="mx-auto max-w-lg">
        <h2 className="font-display text-2xl sm:text-3xl">Need help choosing your fabric?</h2>
        <p className="mt-3 text-sm text-cream/70">
          Send us your requirements and we'll help you pick the right fabric, color and quantity.
        </p>
        <a
          href={`https://wa.me/${digitsOnly}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-block"
        >
          <Button variant="gold">Chat with MA on WhatsApp</Button>
        </a>
      </div>
    </section>
  );
}
