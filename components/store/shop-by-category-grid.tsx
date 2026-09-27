"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

interface Category {
  slug: string;
  name: string;
  imageUrl: string | null;
}

export function ShopByCategoryGrid({ categories }: { categories: Category[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {categories.map((c, i) => (
        <motion.div
          key={c.slug}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.06 }}
        >
          <Link href={`/shop?category=${c.slug}`} className="group relative block aspect-square overflow-hidden bg-navy-light">
            {c.imageUrl && (
              <Image
                src={c.imageUrl}
                alt={c.name}
                fill
                className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-110"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-navy/40 transition-colors group-hover:bg-navy/20" />
            <span className="absolute inset-x-0 bottom-4 text-center font-display text-lg tracking-wide text-cream">
              {c.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
