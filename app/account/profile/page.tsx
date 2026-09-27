import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function AccountProfilePage() {
  const session = await getSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        include: { customer: { include: { addresses: true } } },
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 lg:px-10">
      <h1 className="mb-8 font-display text-3xl text-navy">Profile & addresses</h1>

      <div className="mb-12 max-w-sm space-y-4">
        <Field label="Full name" defaultValue={user?.name ?? ""} />
        <Field label="Email" defaultValue={user?.email ?? ""} />
        <Field label="Phone" defaultValue={user?.phone ?? ""} />
      </div>

      <h2 className="mb-4 font-display text-lg text-navy">Saved addresses</h2>
      {user?.customer?.addresses.length ? (
        <div className="space-y-3">
          {user.customer.addresses.map((a) => (
            <div key={a.id} className="border border-navy/10 p-4 text-sm text-navy/70">
              {a.line1}, {a.city}, {a.province} {a.postalCode}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-navy/60">No saved addresses yet.</p>
      )}
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-navy">{label}</label>
      <input
        defaultValue={defaultValue}
        className="w-full border border-navy/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-gold"
      />
    </div>
  );
}
