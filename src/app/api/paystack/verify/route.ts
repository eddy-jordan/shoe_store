import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";
import { markOrderPaid, markOrderFailed } from "@/lib/order-fulfillment";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const existingOrder = await prisma.order.findUnique({ where: { paystackRef: reference } });
  if (!existingOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (existingOrder.status === "PAID") {
    return NextResponse.json({ orderId: existingOrder.id, status: "PAID" });
  }

  const result = await verifyTransaction(reference);

  if (result.data?.status === "success") {
    const order = await markOrderPaid(reference, result.data.id);
    return NextResponse.json({ orderId: order?.id, status: order?.status });
  }

  const order = await markOrderFailed(reference);
  return NextResponse.json({ orderId: order?.id, status: order?.status ?? "FAILED" });
}
