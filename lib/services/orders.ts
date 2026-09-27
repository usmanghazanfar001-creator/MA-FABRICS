"use server";

import { prisma } from "@/lib/db/prisma";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/checkout";
import { rateLimit } from "@/lib/security/rate-limit";

const DEFAULT_SHIPPING_FEE = 250; // used only if "shipping_flat_rate" isn't set in SiteSetting

async function getShippingFee(client: typeof prisma) {
  const setting = await client.siteSetting.findUnique({ where: { key: "shipping_flat_rate" } });
  const parsed = setting ? Number(setting.value) : NaN;
  return Number.isFinite(parsed) ? parsed : DEFAULT_SHIPPING_FEE;
}

async function generateOrderNumber(year: number) {
  // Sequential per year. In very high-concurrency production use, back this with
  // a dedicated counter row + row-level lock; fine for MA Fabrics' order volume.
  const count = await prisma.order.count({
    where: { orderNumber: { startsWith: `MA-${year}-` } },
  });
  const sequence = String(count + 1).padStart(6, "0");
  return `MA-${year}-${sequence}`;
}

export interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid order details" };
  }
  const data = parsed.data;

  const limit = rateLimit(`order:${data.customer.phone}`, 10, 60 * 60);
  if (!limit.allowed) {
    return { success: false, error: "Too many orders placed recently. Please try again later." };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Never trust client-sent prices — re-fetch and verify server-side.
      const products = await tx.product.findMany({
        where: { id: { in: data.items.map((i) => i.productId) }, isPublished: true, deletedAt: null },
        include: { inventory: true },
      });

      let subtotal = 0;
      const orderItemsData = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product no longer available.`);

        const available = product.inventory?.stockMeters ?? 0;
        if (available < item.quantity) {
          throw new Error(`${product.name} only has ${available}m in stock.`);
        }

        const unitPrice = Number(product.price);
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        return {
          productId: product.id,
          colorName: item.color,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
        };
      });

      // Coupon validation (server-side)
      let discount = 0;
      let couponId: string | undefined;
      if (data.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: data.couponCode } });
        const now = new Date();
        if (
          coupon &&
          coupon.isActive &&
          coupon.startsAt <= now &&
          coupon.endsAt >= now &&
          (!coupon.usageLimit || coupon.timesUsed < coupon.usageLimit) &&
          (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount))
        ) {
          discount =
            coupon.discountType === "PERCENTAGE"
              ? (subtotal * Number(coupon.value)) / 100
              : Number(coupon.value);
          if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
          couponId = coupon.id;
        }
      }

      const shippingFee = await getShippingFee(tx as unknown as typeof prisma);
      const total = Math.max(0, subtotal + shippingFee - discount);
      const orderNumber = await generateOrderNumber(new Date().getFullYear());

      const order = await tx.order.create({
        data: {
          orderNumber,
          guestName: data.customer.name,
          guestPhone: data.customer.phone,
          guestEmail: data.customer.email || undefined,
          shippingLine1: data.shipping.line1,
          shippingCity: data.shipping.city,
          shippingProvince: data.shipping.province,
          shippingPostalCode: data.shipping.postalCode,
          subtotal,
          shippingFee,
          discount,
          total,
          paymentMethod: data.paymentMethod,
          status: "PENDING",
          couponId,
          items: { create: orderItemsData },
        },
      });

      // Decrement inventory now that stock has been verified inside the transaction.
      for (const item of data.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: { stockMeters: { decrement: item.quantity } },
        });
      }

      if (couponId) {
        await tx.coupon.update({ where: { id: couponId }, data: { timesUsed: { increment: 1 } } });
        await tx.couponUsage.create({ data: { couponId } });
      }

      await tx.notification.create({
        data: { type: "NEW_ORDER", message: `New order ${order.orderNumber} received.` },
      });

      return order;
    });

    return { success: true, orderNumber: result.orderNumber };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not place order." };
  }
}

export async function getOrderForTracking(orderNumber: string, phone: string) {
  return prisma.order.findFirst({
    where: { orderNumber, guestPhone: phone },
    include: { items: { include: { product: true } } },
  });
}
