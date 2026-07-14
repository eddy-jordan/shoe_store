import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation/checkout";
import { validateCartItems } from "@/lib/cart-validation";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
  }

  const { items, address } = parsed.data;
  const userId = session.user.id;

  class StockError extends Error {
    constructor(public errors: { variantId: string; reason: string }[]) {
      super("Cart validation failed");
    }
  }

  let result: { order: { id: string; totalKobo: number }; reference: string };
  try {
    result = await prisma.$transaction(async (tx) => {
      const validation = await validateCartItems(items, tx);
      if (!validation.valid) {
        throw new StockError(validation.errors);
      }

      const createdAddress = await tx.address.create({
        data: { ...address, userId },
      });

      const reference = `shoe_${randomUUID()}`;

      const order = await tx.order.create({
        data: {
          userId,
          addressId: createdAddress.id,
          totalKobo: validation.totalKobo,
          paystackRef: reference,
          items: {
            create: validation.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPriceKobo: item.unitPriceKobo,
            })),
          },
        },
      });

      return { order, reference };
    });
  } catch (err) {
    if (err instanceof StockError) {
      return NextResponse.json(
        { error: "Some items in your cart are no longer available", details: err.errors },
        { status: 409 },
      );
    }
    throw err;
  }

  const paystackRes = await initializeTransaction({
    email: session.user.email!,
    amountKobo: result.order.totalKobo,
    reference: result.reference,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/callback`,
  });

  if (!paystackRes.status || !paystackRes.data) {
    return NextResponse.json({ error: paystackRes.message ?? "Failed to initialize payment" }, { status: 502 });
  }

  return NextResponse.json({ authorizationUrl: paystackRes.data.authorization_url });
}
