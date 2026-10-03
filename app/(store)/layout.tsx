import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";

// The storefront reads live data (products, settings, prices, stock) straight
// from the database on every page. Without this, Next.js would statically
// freeze pages like the homepage at build time and keep serving that same
// snapshot forever — database/seed updates would never show up without a
// brand new deployment. This trades a little caching performance for always
// showing current data, which matters more for a store.
export const dynamic = "force-dynamic";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
