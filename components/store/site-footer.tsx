import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db/prisma";

export async function SiteFooter() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "shop_address" } });
  const address = setting?.value ?? "Lahore, Pakistan";
  return (
    <footer className="section-navy">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/logo.png" alt="MA Fabrics" width={44} height={44} className="mb-4 h-11 w-11 object-contain" />
            <p className="max-w-xs text-sm text-cream/70">
              Premium fabrics. Timeless style. Crafted for comfort, designed for distinction.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display text-base">Shop</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link href="/shop">All fabrics</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/videos">Fabric videos</Link></li>
              <li><Link href="/track-order">Track your order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-base">Company</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li><Link href="/about">About MA</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-base">Stay in touch</h4>
            <p className="mb-3 text-sm text-cream/70">New fabrics and seasonal drops, occasionally.</p>
            <form className="flex border-b border-cream/30 pb-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent text-sm placeholder:text-cream/40 outline-none"
              />
              <button type="submit" className="text-sm text-gold">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MA Fabrics. All rights reserved.</p>
          <p>{address}</p>
          <p>
            Powered by{" "}
            <a
              href="https://usmanghazanfar.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              Noviqoagency
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
