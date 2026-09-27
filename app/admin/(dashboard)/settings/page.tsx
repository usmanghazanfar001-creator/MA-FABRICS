import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

const KEYS = [
  { key: "whatsapp_number", label: "WhatsApp number", placeholder: "+92XXXXXXXXXX" },
  { key: "shop_address", label: "Shop address", placeholder: "Shop #, Street, City" },
  { key: "shipping_flat_rate", label: "Flat shipping rate (PKR)", placeholder: "250" },
  { key: "currency", label: "Currency", placeholder: "PKR" },
  { key: "homepage_hero_heading", label: "Homepage hero heading", placeholder: "Crafted for distinction" },
  { key: "homepage_hero_text", label: "Homepage hero subtext", placeholder: "Discover premium fabrics..." },
] as const;

async function saveSettings(formData: FormData) {
  "use server";
  await requireAdmin();
  await Promise.all(
    KEYS.map(({ key }) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(formData.get(key) ?? "") },
        create: { key, value: String(formData.get(key) ?? "") },
      })
    )
  );
  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await prisma.siteSetting.findMany();
  const valueFor = (key: string) => settings.find((s) => s.key === key)?.value ?? "";

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl text-navy">Settings</h1>
      <form action={saveSettings} className="max-w-lg space-y-5">
        {KEYS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="mb-1.5 block text-sm text-navy">{label}</label>
            <input
              name={key}
              defaultValue={valueFor(key)}
              placeholder={placeholder}
              className="w-full border border-navy/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
        ))}
        <button className="bg-navy px-6 py-2.5 text-sm text-cream">Save settings</button>
      </form>
      <p className="mt-6 max-w-lg text-xs text-navy/50">
        These values are read at request time by the storefront (WhatsApp buttons, checkout shipping
        fee) — nothing here is hard-coded in source.
      </p>
    </div>
  );
}
