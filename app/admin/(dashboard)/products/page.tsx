import Link from "next/link";
import { listAdminProducts, deleteAdminProduct, toggleProductField } from "@/lib/services/admin-products";
import { formatPKR } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl text-navy">Products</h1>
        <Link href="/admin/products/new" className="bg-navy px-5 py-2.5 text-sm text-cream">
          + New product
        </Link>
      </div>

      <div className="overflow-x-auto border border-navy/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy/10 text-navy/50">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-navy">{p.name}</td>
                <td className="px-4 py-3 text-navy/60">{p.sku}</td>
                <td className="px-4 py-3 text-navy/60">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 text-navy/60">{formatPKR(Number(p.price))}</td>
                <td className="px-4 py-3 text-navy/60">
                  {p.inventory?.stockMeters ?? 0}m
                  {(p.inventory?.stockMeters ?? 0) <= (p.inventory?.lowStockThreshold ?? 5) && (
                    <span className="ml-2 text-xs text-red-600">Low</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await toggleProductField(p.id, "isPublished", !p.isPublished); }}>
                    <button className={p.isPublished ? "text-green-700" : "text-navy/40"}>
                      {p.isPublished ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={async () => { "use server"; await toggleProductField(p.id, "isFeatured", !p.isFeatured); }}>
                    <button className={p.isFeatured ? "text-gold-dark" : "text-navy/40"}>
                      {p.isFeatured ? "Yes" : "No"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/products/${p.id}`} className="text-navy underline">Edit</Link>
                    <form action={async () => { "use server"; await deleteAdminProduct(p.id); }}>
                      <button className="text-red-700">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
