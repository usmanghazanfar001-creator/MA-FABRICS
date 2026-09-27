"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import type { OrderStatus } from "@prisma/client";

export async function listAdminOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, customer: { include: { user: true } } },
  });
}

export async function getAdminOrder(id: string) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, customer: { include: { user: true } } },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function addOrderNote(id: string, notes: string) {
  await requireAdmin();
  await prisma.order.update({ where: { id }, data: { notes } });
  revalidatePath(`/admin/orders/${id}`);
}
