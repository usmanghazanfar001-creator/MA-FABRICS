import { listColors, createColor, toggleColorActive } from "@/lib/services/admin-catalog";

export default async function AdminColorsPage() {
  const colors = await listColors();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Colors</h1>

      <form action={createColor} className="mb-10 flex max-w-md items-center gap-3">
        <input name="name" required placeholder="Color name" className="flex-1 border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold" />
        <input name="hex" type="color" defaultValue="#111111" className="h-10 w-14 border border-navy/20 bg-white" />
        <button className="bg-navy px-5 py-2 text-sm text-cream">Add</button>
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {colors.map((c) => (
          <div key={c.id} className="flex items-center gap-3 border border-navy/10 bg-white px-3 py-2.5">
            <span className="h-6 w-6 flex-shrink-0 rounded-full border border-navy/10" style={{ backgroundColor: c.hex }} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-navy">{c.name}</p>
              <p className="text-xs text-navy/40">{c._count.productColors} products</p>
            </div>
            <form action={async () => { "use server"; await toggleColorActive(c.id, !c.isActive); }}>
              <button className={`text-xs ${c.isActive ? "text-green-700" : "text-navy/40"}`}>
                {c.isActive ? "Active" : "Off"}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
