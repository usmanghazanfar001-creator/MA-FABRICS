import { prisma } from "@/lib/db/prisma";

const DEFAULT_SHIPPING_FEE = 250;

export async function getPublicShippingFee() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "shipping_flat_rate" } });
  const parsed = setting ? Number(setting.value) : NaN;
  return Number.isFinite(parsed) ? parsed : DEFAULT_SHIPPING_FEE;
}
