import Link from "next/link";
import {
  LayoutDashboard, Package, FolderTree, Palette, Video, ShoppingCart,
  Users, Star, Image as ImageIcon, Images, Tag, Settings, Layers,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/colors", label: "Colors", icon: Palette },
  { href: "/admin/photos", label: "Photos", icon: Images },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden w-56 flex-shrink-0 border-r border-navy/10 bg-white lg:block">
      <div className="px-6 py-6">
        <span className="font-display text-lg text-navy">MA Fabrics</span>
        <p className="text-xs text-navy/40">Admin</p>
      </div>
      <nav className="space-y-1 px-3">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded px-3 py-2 text-sm text-navy/70 hover:bg-cream hover:text-navy"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
