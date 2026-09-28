import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/products";
import { prisma } from "@/lib/db/prisma";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductActions } from "@/components/product/product-actions";
import { VideoPlayer } from "@/components/product/video-player";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";
import { resolveImage, realImage } from "@/lib/media";

async function getWhatsAppNumber() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "whatsapp_number" } });
  return setting?.value ?? "";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const firstImage = product.images.find((img) => realImage(img.url));
  return {
    title: product.name,
    description: product.shortDescription ?? product.description.slice(0, 155),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: firstImage ? [{ url: firstImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, whatsappNumber] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId),
    getWhatsAppNumber(),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price.toString(),
      availability:
        (product.inventory?.stockMeters ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: "https://mafabrics.com/shop" },
      ...(product.category
        ? [{ "@type": "ListItem", position: 2, name: product.category.name, item: `https://mafabrics.com/shop?category=${product.category.slug}` }]
        : []),
      { "@type": "ListItem", position: product.category ? 3 : 2, name: product.name, item: `https://mafabrics.com/product/${product.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />

      <nav className="mb-8 text-xs text-navy/50">
        Shop / {product.category?.name} / <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs uppercase tracking-luxe text-navy/50">{product.category?.name}</p>
          <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">{product.name}</h1>
          <p className="mt-1 text-xs text-navy/40">SKU: {product.sku}</p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-navy/70">{product.description}</p>

          <div className="mt-8">
            <ProductActions
              productId={product.id}
              productSlug={product.slug}
              productName={product.name}
              sku={product.sku}
              imageUrl={resolveImage(product.images[0]?.url)}
              price={Number(product.price)}
              colors={product.colors.map((pc) => ({ name: pc.color.name, hex: pc.color.hex }))}
              stockMeters={product.inventory?.stockMeters ?? 0}
              whatsappNumber={whatsappNumber}
            />
          </div>

          <div className="mt-12 border-t border-navy/10 pt-8">
            <h2 className="mb-4 font-display text-lg text-navy">Fabric specifications</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <Spec label="Fabric type" value={product.fabricType} />
              <Spec label="Texture" value={product.texture} />
              <Spec label="Season" value={product.season.replace("_", " ")} />
              <Spec label="Recommended use" value={product.recommendedUse} />
            </dl>
          </div>

          <div className="mt-8 border-t border-navy/10 pt-8 text-sm text-navy/60">
            <h2 className="mb-2 font-display text-lg text-navy">Shipping</h2>
            <p>Dispatched within 2–3 business days. Delivery across Pakistan in 3–7 business days.</p>
          </div>
        </div>
      </div>

      {product.videos.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-6 font-display text-2xl text-navy">Fabric video</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {product.videos.map((video) => (
              <div key={video.id} className="relative aspect-video overflow-hidden bg-navy">
                <VideoPlayer url={video.url} thumbnailUrl={video.thumbnailUrl} title={video.title} />
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-2xl text-navy">Related fabrics</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {related.map((p) => {
              const card: ProductCardData = {
                slug: p.slug,
                name: p.name,
                category: product.category?.name ?? "",
                price: Number(p.price),
                imageUrl: resolveImage(p.images[0]?.url),
                colors: p.colors.map((pc) => ({ name: pc.color.name, hex: pc.color.hex })),
                inStock: true,
              };
              return <ProductCard key={p.id} product={card} />;
            })}
          </div>
        </section>
      )}

      <section className="mt-24 max-w-2xl">
        <h2 className="mb-8 font-display text-2xl text-navy">Customer reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-sm text-navy/50">No reviews yet for this fabric.</p>
        ) : (
          <div className="space-y-6">
            {product.reviews.map((r) => (
              <div key={r.id} className="border-t border-navy/10 pt-5">
                <div className="mb-2 flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill={i < r.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-sm text-navy/75">{r.comment}</p>
                <p className="mt-1 text-xs text-navy/50">{r.customerName}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-navy/50">{label}</dt>
      <dd className="text-navy">{value}</dd>
    </div>
  );
}
