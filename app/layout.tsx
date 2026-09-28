import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart/cart-context";
import { SITE_URL } from "@/lib/seo/site";
import { prisma } from "@/lib/db/prisma";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_TITLE = "MA Fabrics — Premium Fabrics. Timeless Style.";
const SITE_DESCRIPTION =
  "Premium Pakistani textile and suiting brand. Crafted for comfort. Designed for distinction.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | MA Fabrics",
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.png" },
  openGraph: {
    siteName: "MA Fabrics",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "en_PK",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "MA Fabrics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSetting
    .findMany({ where: { key: { in: ["whatsapp_number", "shop_address"] } } })
    .catch(() => []);
  const whatsapp = settings.find((s) => s.key === "whatsapp_number")?.value;
  const address = settings.find((s) => s.key === "shop_address")?.value;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "MA Fabrics",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      ...(whatsapp && {
        contactPoint: {
          "@type": "ContactPoint",
          telephone: whatsapp,
          contactType: "customer service",
        },
      }),
      ...(address && {
        address: { "@type": "PostalAddress", streetAddress: address, addressCountry: "PK" },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MA Fabrics",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/shop?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
