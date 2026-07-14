import { NextResponse } from "next/server";
import { z } from "zod";
import { cartItemSchema } from "@/lib/validation/checkout";
import { validateCartItems } from "@/lib/cart-validation";

const bodySchema = z.object({ items: z.array(cartItemSchema).min(1) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
  }

  const result = await validateCartItems(parsed.data.items);
  return NextResponse.json(result, { status: result.valid ? 200 : 409 });
}
