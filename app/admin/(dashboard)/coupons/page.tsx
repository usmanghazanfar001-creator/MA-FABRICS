import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

async function createCoupon(formData: FormData) {
  "use server";
  await requireAdmin();
  await prisma.coupon.create({
    data: {
      code: String(formData.get("code")).toUpperCase(),
      discountType: formData.get("discountType") as "PERCENTAGE" | "FIXED",
      value: Number(formData.get("value")),
      minOrderAmount: formData.get("minOrderAmount") ? Number(formData.get("minOrderAmount")) : undefined,
      maxDiscount: formData.get("maxDiscount") ? Number(formData.get("maxDiscount")) : undefined,
      startsAt: new Date(String(formData.get("startsAt"))),
      endsAt: new Date(String(formData.get("endsAt"))),
      usageLimit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : undefined,
    },
  });
  revalidatePath("/admin/coupons");
}

async function toggleActive(id: string, isActive: boolean) {
  "use server";
  await requireAdmin();
  await prisma.coupon.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/coupons");
}

export default async function AdminCouponsPage() {
  await requireAdmin();
  const coupons = await prisma.coupon.findMany({ orderBy: { startsAt: "desc" } });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Coupons</h1>

      <form action={createCoupon} className="mb-10 grid max-w-2xl gap-3 sm:grid-cols-3">
        <input name="code" required placeholder="Code (e.g. MA10)" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <select name="discountType" className="border border-navy/20 bg-white px-3 py-2 text-sm">
          <option value="PERCENTAGE">Percentage</option>
          <option value="FIXED">Fixed amount</option>
        </select>
        <input name="value" type="number" required placeholder="Value" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <input name="minOrderAmount" type="number" placeholder="Min order (PKR)" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <input name="maxDiscount" type="number" placeholder="Max discount (PKR)" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <input name="usageLimit" type="number" placeholder="Usage limit" className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <input name="startsAt" type="date" required className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <input name="endsAt" type="date" required className="border border-navy/20 bg-white px-3 py-2 text-sm" />
        <button className="bg-navy px-5 py-2 text-sm text-cream">Create coupon</button>
      </form>

      <div className="divide-y divide-navy/5 border-y border-navy/10 bg-white">
        {coupons.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="text-navy">{c.code}</p>
              <p className="text-xs text-navy/50">
                {c.discountType === "PERCENTAGE" ? `${c.value}% off` : `PKR ${c.value} off`} · used {c.timesUsed}
                {c.usageLimit ? `/${c.usageLimit}` : ""} times
              </p>
            </div>
            <form action={async () => { "use server"; await toggleActive(c.id, !c.isActive); }}>
              <button className={c.isActive ? "text-green-700" : "text-navy/40"}>
                {c.isActive ? "Active" : "Inactive"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
