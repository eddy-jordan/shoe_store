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
