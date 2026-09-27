import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const [orderCount, productCount, pendingCount] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="min-h-screen bg-cream px-8 py-10">
      <h1 className="mb-1 font-display text-2xl text-navy">Dashboard</h1>
      <p className="mb-10 text-sm text-navy/60">Signed in as {session?.email}</p>

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard label="Total orders" value={orderCount} />
        <StatCard label="Pending orders" value={pendingCount} />
        <StatCard label="Products" value={productCount} />
      </div>

      <p className="mt-12 text-sm text-navy/50">
        Product, order, customer, and settings management build into this dashboard in Stage 7.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-navy/10 bg-white p-6">
      <p className="text-sm text-navy/60">{label}</p>
      <p className="mt-2 font-display text-3xl text-navy">{value}</p>
    </div>
  );
}
