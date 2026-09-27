"use client";

import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp/generate-order-message";
import { useCart } from "@/lib/cart/cart-context";

interface ProductActionsProps {
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  imageUrl: string;
  price: number;
  colors: { name: string; hex: string }[];
  stockMeters: number;
  whatsappNumber: string;
}

export function ProductActions({
  productId,
  productSlug,
  productName,
  sku,
  imageUrl,
  price,
  colors,
  stockMeters,
  whatsappNumber,
}: ProductActionsProps) {
  const { addItem } = useCart();
  const [color, setColor] = useState(colors[0]?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const inStock = stockMeters > 0;

  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, {
    productName,
    sku,
    color,
    quantityMeters: quantity,
    orderTotal: price * quantity,
  });

  return (
    <div className="space-y-8">
      {colors.length > 0 && (
        <div>
          <p className="mb-3 text-sm text-navy">
            Color: <span className="text-navy/60">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                title={c.name}
                className={`h-9 w-9 rounded-full border-2 transition-transform ${
                  color === c.name ? "scale-110 border-gold" : "border-transparent"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-sm text-navy">Quantity (meters)</p>
        <div className="inline-flex items-center border border-navy/20">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 text-navy hover:text-gold-dark"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-sm text-navy">{quantity}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(stockMeters || 1, q + 1))}
            className="p-3 text-navy hover:text-gold-dark"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {!inStock && <p className="mt-2 text-xs text-navy/50">Currently out of stock.</p>}
      </div>

      <p className="font-display text-2xl text-navy">{formatPKR(price * quantity)}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          className="flex-1"
          disabled={!inStock}
          onClick={() => {
            addItem({ productId, slug: productSlug, name: productName, sku, imageUrl, price, color, quantity });
            setAdded(true);
          }}
        >
          {added ? "Added to cart" : "Add to cart"}
        </Button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" className="w-full text-navy border-navy">
            Order on WhatsApp
          </Button>
        </a>
        <button
          aria-label="Add to wishlist"
          className="flex items-center justify-center border border-navy/20 px-4 text-navy hover:text-gold-dark"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
