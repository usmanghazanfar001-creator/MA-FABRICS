import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { LogoutButton } from "@/components/store/logout-button";

export default async function AccountPage() {
  const session = await getSession();
  const user = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 lg:px-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-display text-3xl text-navy">My account</h1>
        <LogoutButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <p className="text-sm text-navy/70">Name: <span className="text-navy">{user?.name}</span></p>
        <p className="text-sm text-navy/70">Email: <span className="text-navy">{user?.email}</span></p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link href="/account/orders" className="border border-navy/15 p-6 hover:border-gold">
          <h2 className="font-display text-lg text-navy">Order history</h2>
          <p className="mt-1 text-sm text-navy/60">View past and current orders.</p>
        </Link>
        <Link href="/account/profile" className="border border-navy/15 p-6 hover:border-gold">
          <h2 className="font-display text-lg text-navy">Profile & addresses</h2>
          <p className="mt-1 text-sm text-navy/60">Update your details and saved addresses.</p>
        </Link>
      </div>
    </div>
  );
}
