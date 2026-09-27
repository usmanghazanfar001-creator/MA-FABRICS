import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await prisma.customer.findMany({
    include: { user: true, orders: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Customers</h1>
      <div className="overflow-x-auto border border-navy/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy/10 text-navy/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-navy">{c.user.name}</td>
                <td className="px-4 py-3 text-navy/60">{c.user.email}</td>
                <td className="px-4 py-3 text-navy/60">{c.user.phone ?? "—"}</td>
                <td className="px-4 py-3 text-navy/60">{c.orders.length}</td>
                <td className="px-4 py-3 text-navy/60">{c.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
