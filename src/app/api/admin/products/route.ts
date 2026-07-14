import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation/product";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { variants, ...product } = parsed.data;

  const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
  if (existing) {
    return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
  }

  const created = await prisma.product.create({
    data: { ...product, variants: { create: variants } },
  });

  return NextResponse.json({ id: created.id });
}
