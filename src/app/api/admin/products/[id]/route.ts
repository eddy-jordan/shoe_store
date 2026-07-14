import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation/product";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  if (typeof body.isActive === "boolean" && Object.keys(body).length === 1) {
    await prisma.product.update({ where: { id }, data: { isActive: body.isActive } });
    return NextResponse.json({ success: true });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { variants, ...product } = parsed.data;

  await prisma.$transaction([
    prisma.product.update({ where: { id }, data: product }),
    ...variants.map((variant) =>
      prisma.productVariant.upsert({
        where: { productId_size: { productId: id, size: variant.size } },
        update: { stock: variant.stock },
        create: { productId: id, size: variant.size, stock: variant.stock },
      }),
    ),
  ]);

  return NextResponse.json({ success: true });
}
