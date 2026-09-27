import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart/cart-context";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://mafabrics.com"),
  title: {
    default: "MA Fabrics — Premium Fabrics. Timeless Style.",
    template: "%s | MA Fabrics",
  },
  description:
    "Premium Pakistani textile and suiting brand. Crafted for comfort. Designed for distinction.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    siteName: "MA Fabrics",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "MA Fabrics",
      url: "https://mafabrics.com",
      logo: "https://mafabrics.com/logo.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MA Fabrics",
      url: "https://mafabrics.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://mafabrics.com/shop?q={search_term_string}",
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
