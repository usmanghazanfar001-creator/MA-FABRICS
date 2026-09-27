"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPKR } from "@/lib/utils";

export interface ProductCardData {
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl: string;
  hoverImageUrl?: string;
  colors: { name: string; hex: string }[];
  inStock: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <div className="group">
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-cream">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
        {product.hoverImageUrl && (
          <Image
            src={product.hoverImageUrl}
            alt=""
            fill
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        )}
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center bg-cream/90 text-navy opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>
        {!product.inStock && (
          <span className="absolute bottom-3 left-3 bg-navy px-3 py-1 text-xs text-cream">
            Sold out
          </span>
        )}
      </Link>

      <div className="mt-4 space-y-1">
        <p className="text-xs text-navy/60">{product.category}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display text-lg leading-snug text-navy">{product.name}</h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-navy">{formatPKR(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-navy/40 line-through">
              {formatPKR(product.compareAtPrice)}
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 6).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-navy/10"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
