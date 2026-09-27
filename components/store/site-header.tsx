"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, Search, Heart, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";

const NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Videos", href: "/videos" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-navy text-cream shadow-sm" : "bg-transparent text-cream"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <button
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="MA Fabrics" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="hidden font-display text-lg sm:inline">MA Fabrics</span>
        </Link>

        <nav className="hidden gap-8 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm hover:text-gold transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button aria-label="Search"><Search className="h-4.5 w-4.5" /></button>
          <Link href="/account" aria-label="Wishlist" className="hidden sm:block"><Heart className="h-4.5 w-4.5" /></Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="h-4.5 w-4.5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-navy">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-navy text-cream lg:hidden">
          <div className="flex items-center justify-between px-6 py-4">
            <span className="font-display text-lg">MA Fabrics</span>
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-6 px-6 py-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-display text-2xl"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
