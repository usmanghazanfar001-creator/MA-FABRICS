import { Bell, Search } from "lucide-react";
import { LogoutButton } from "@/components/store/logout-button";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function AdminTopbar() {
  const session = await getSession();
  const unreadCount = await prisma.notification.count({ where: { isRead: false } });

  return (
    <header className="flex items-center justify-between border-b border-navy/10 bg-white px-6 py-4">
      <div className="flex items-center gap-2 text-navy/40">
        <Search className="h-4 w-4" />
        <input placeholder="Search orders, products..." className="bg-transparent text-sm outline-none placeholder:text-navy/40" />
      </div>
      <div className="flex items-center gap-5">
        <div className="relative">
          <Bell className="h-4.5 w-4.5 text-navy/60" />
          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-navy">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-sm text-navy/70">{session?.email}</span>
        <LogoutButton />
      </div>
    </header>
  );
}
