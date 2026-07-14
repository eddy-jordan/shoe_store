import { prisma } from "@/lib/prisma";

export async function markOrderPaid(reference: string, paystackTxId?: number) {
  const order = await prisma.order.findUnique({
    where: { paystackRef: reference },
    include: { items: true },
  });

  if (!order || order.status === "PAID") return order;

  return prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paystackTxId: paystackTxId ? String(paystackTxId) : undefined,
      },
    });
  });
}

export async function markOrderFailed(reference: string) {
  const order = await prisma.order.findUnique({ where: { paystackRef: reference } });
  if (!order || order.status === "PAID") return order;

  return prisma.order.update({
    where: { id: order.id },
    data: { status: "FAILED" },
  });
}

/**
 * Orders left PENDING (checkout started, Paystack never confirmed success or failure -
 * e.g. the customer closed the tab) would otherwise sit as PENDING forever, since nothing
 * else transitions them out of that state. Sweeping them to FAILED after a grace period
 * keeps the order list honest; stock was never decremented for PENDING orders so there's
 * nothing to restore.
 */
export async function expireStalePendingOrders(olderThanHours = 1) {
  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);

  const result = await prisma.order.updateMany({
    where: { status: "PENDING", createdAt: { lt: cutoff } },
    data: { status: "FAILED" },
  });

  return result.count;
}
