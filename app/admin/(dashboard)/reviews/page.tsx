import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { Star } from "lucide-react";

async function setApproved(id: string, isApproved: boolean) {
  "use server";
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { isApproved } });
  revalidatePath("/admin/reviews");
}

async function deleteReview(id: string) {
  "use server";
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
}

export default async function AdminReviewsPage() {
  await requireAdmin();
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Reviews</h1>
      <div className="divide-y divide-navy/5 border-y border-navy/10 bg-white">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 px-4 py-4">
            <div>
              <div className="mb-1 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5" fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-sm text-navy">{r.comment}</p>
              <p className="mt-1 text-xs text-navy/50">{r.customerName} · {r.product.name}</p>
            </div>
            <div className="flex flex-shrink-0 gap-3 text-sm">
              <form action={setApproved.bind(null, r.id, true)}>
                <button className={r.isApproved ? "text-green-700" : "text-navy/50"}>Approve</button>
              </form>
              <form action={setApproved.bind(null, r.id, false)}>
                <button className={!r.isApproved ? "text-red-700" : "text-navy/50"}>Reject</button>
              </form>
              <form action={deleteReview.bind(null, r.id)}>
                <button className="text-navy/40">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
