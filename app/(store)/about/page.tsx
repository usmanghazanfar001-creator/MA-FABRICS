import type { Metadata } from "next";
import Image from "next/image";
import { IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind MA Fabrics — premium Pakistani textile and suiting.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-32 lg:px-10">
      <h1 className="mb-10 font-display text-4xl text-navy">About MA Fabrics</h1>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src={IMAGES.boutique} alt="MA Fabrics workshop" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-navy/70 sm:text-base">
          <p>
            MA Fabrics began with a simple belief: that fabric is the foundation of how people
            present themselves. We work with skilled weavers across Pakistan to bring together
            premium suiting and everyday fabrics that are built to be worn, not just displayed.
          </p>
          <p>
            Every piece is chosen for its hand-feel, drape, and durability — from the deep formal
            tones of our suiting range to the light, breathable cottons made for warm-weather
            comfort. Our aim is straightforward: fabric that holds up to a tailor's hand and to
            years of wear.
          </p>
          <p>
            Today MA Fabrics serves customers across Pakistan, with fabric selected, cut, and
            shipped from our shop in Karkhana Bazar, Faisalabad — and a growing catalogue built
            one season at a time.
          </p>
        </div>
      </div>

      <div className="mt-20 grid gap-10 border-t border-navy/10 pt-14 sm:grid-cols-3">
        <div>
          <h2 className="mb-2 font-display text-lg text-navy">Premium quality</h2>
          <p className="text-sm text-navy/60">Carefully selected fabrics for refined style and lasting comfort.</p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-lg text-navy">Made to be worn</h2>
          <p className="text-sm text-navy/60">Every fabric is chosen with tailoring and everyday wear in mind.</p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-lg text-navy">Direct from Faisalabad</h2>
          <p className="text-sm text-navy/60">Selected, cut, and shipped from our home base in Pakistan.</p>
        </div>
      </div>
    </div>
  );
}
