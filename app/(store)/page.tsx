import { HeroCarousel } from "@/components/store/hero-carousel";
import { FeaturedCollections } from "@/components/store/featured-collections";
import { ShopByCategory } from "@/components/store/shop-by-category";
import { FeaturedProducts } from "@/components/store/featured-products";
import { ExperienceSection } from "@/components/store/experience-section";
import { ColorCollection } from "@/components/store/color-collection";
import { VideoShowcase } from "@/components/store/video-showcase";
import { AboutSection, ReviewsSection, WhatsAppCTA } from "@/components/store/about-reviews-whatsapp";
import { PromoBanners } from "@/components/store/promo-banners";
import { RevealOnScroll } from "@/components/store/reveal-on-scroll";
import { prisma } from "@/lib/db/prisma";

export default async function HomePage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["whatsapp_number", "homepage_hero_heading", "homepage_hero_text"] } },
  });
  const valueFor = (key: string) => settings.find((s) => s.key === key)?.value;

  return (
    <>
      <HeroCarousel heading={valueFor("homepage_hero_heading")} text={valueFor("homepage_hero_text")} />
      <RevealOnScroll><FeaturedCollections /></RevealOnScroll>
      <RevealOnScroll><ShopByCategory /></RevealOnScroll>
      <PromoBanners />
      <RevealOnScroll><FeaturedProducts /></RevealOnScroll>
      <RevealOnScroll><ExperienceSection /></RevealOnScroll>
      <RevealOnScroll><ColorCollection /></RevealOnScroll>
      <RevealOnScroll><VideoShowcase /></RevealOnScroll>
      <RevealOnScroll><AboutSection /></RevealOnScroll>
      <RevealOnScroll><ReviewsSection /></RevealOnScroll>
      <WhatsAppCTA whatsappNumber={valueFor("whatsapp_number") ?? ""} />
    </>
  );
}
