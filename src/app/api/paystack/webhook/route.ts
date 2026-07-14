import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { markOrderPaid, markOrderFailed } from "@/lib/order-fulfillment";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const reference = event.data?.reference;

  if (reference) {
    if (event.event === "charge.success") {
      await markOrderPaid(reference, event.data.id);
    } else if (event.event === "charge.failed") {
      await markOrderFailed(reference);
    }
  }

  return NextResponse.json({ received: true });
}
