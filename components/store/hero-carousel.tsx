"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slide {
  image: string;
  eyebrow: string;
  heading: string;
  text: string;
  primaryHref: string;
  primaryLabel: string;
}

const AUTO_ADVANCE_MS = 6000;

export function HeroCarousel({ heading, text }: { heading?: string; text?: string }) {
  const reduceMotion = useReducedMotion();

  const slides: Slide[] = [
    {
      image: "/placeholder-hero-fabric.jpg",
      eyebrow: "New season",
      heading: heading ?? "Crafted for\ndistinction",
      text: text ?? "Discover premium fabrics designed for refined style, comfort and lasting quality.",
      primaryHref: "/collections",
      primaryLabel: "Explore collection",
    },
    {
      image: "/placeholder-suiting.jpg",
      eyebrow: "Premium suiting",
      heading: "Tailored for\nevery occasion",
      text: "Formal suiting fabric in 10 shades, cut and shipped across Pakistan.",
      primaryHref: "/shop?category=suiting",
      primaryLabel: "Shop suiting",
    },
    {
      image: "/placeholder-winter.jpg",
      eyebrow: "Winter collection",
      heading: "Weight and warmth,\nwithout the bulk",
      text: "Heavier weaves built for the cold season, still light enough to tailor cleanly.",
      primaryHref: "/collections/winter-collection",
      primaryLabel: "Shop winter",
    },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, next]);

  const slide = slides[index];
  if (!slide) return null;

  return (
    <section
      className="relative flex h-[88vh] min-h-[560px] items-end overflow-hidden bg-navy sm:h-[92vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0"
        >
          <Image src={slide.image} alt={slide.heading.replace("\n", " ")} fill priority className="object-cover opacity-70" sizes="100vw" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 sm:pb-20 lg:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xl"
          >
            <p className="mb-3 text-xs uppercase tracking-luxe text-gold">{slide.eyebrow}</p>
            <h1 className="font-display text-5xl leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
              {slide.heading.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < slide.heading.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-md text-base text-cream/80 sm:text-lg">{slide.text}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href={slide.primaryHref}><Button variant="gold">{slide.primaryLabel}</Button></Link>
              <Link href="/shop"><Button variant="outline" className="text-cream border-cream/60 hover:bg-cream hover:text-navy">Shop now</Button></Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-4">
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-gold" : "w-1.5 bg-cream/40"}`}
              />
            ))}
          </div>
          <button
            aria-label="Next slide"
            onClick={next}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream hover:border-gold hover:text-gold"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
