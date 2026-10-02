"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HERO_VIDEOS } from "@/lib/media";

interface Slide {
  video: string;
  poster: string;
  eyebrow: string;
  heading: string;
  text: string;
  primaryHref: string;
  primaryLabel: string;
}

const AUTO_ADVANCE_MS = 7000;

export function HeroCarousel({ heading, text }: { heading?: string; text?: string }) {
  const reduceMotion = useReducedMotion();

  const slides: Slide[] = [
    {
      video: HERO_VIDEOS.fabricTouch.src,
      poster: HERO_VIDEOS.fabricTouch.poster,
      eyebrow: "New season",
      heading: heading ?? "Crafted for\ndistinction",
      text: text ?? "Discover premium fabrics designed for refined style, comfort and lasting quality.",
      primaryHref: "/collections",
      primaryLabel: "Explore collection",
    },
    {
      video: HERO_VIDEOS.velvetSwatches.src,
      poster: HERO_VIDEOS.velvetSwatches.poster,
      eyebrow: "Fabric first",
      heading: "Texture you can\nfeel",
      text: "Smooth, durable fabrics selected for comfort and a clean drape.",
      primaryHref: "/shop",
      primaryLabel: "Shop fabrics",
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
  const headingLines = slide.heading.split("\n");

  return (
    <section
      className="relative flex h-[88vh] min-h-[560px] items-end overflow-hidden bg-navy sm:h-[92vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0"
        >
          {reduceMotion ? (
            <Image src={slide.poster} alt="" fill priority className="object-cover opacity-70" sizes="100vw" />
          ) : (
            // Decorative background clip: muted + looping + inline so it autoplays on every browser.
            <video
              key={slide.video}
              src={slide.video}
              poster={slide.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              className="h-full w-full object-cover opacity-70"
            />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-navy/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />

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
              {headingLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < headingLines.length - 1 && <br />}
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
      </div>
    </section>
  );
}
