import { prisma } from "@/lib/prisma";
import type { Prisma, PrismaClient } from "@prisma/client";

interface RequestedItem {
  variantId: string;
  quantity: number;
}

export interface ValidatedItem {
  variantId: string;
  productId: string;
  productName: string;
  size: string;
  quantity: number;
  unitPriceKobo: number;
}

export interface CartValidationResult {
  valid: boolean;
  items: ValidatedItem[];
  errors: { variantId: string; reason: string }[];
  totalKobo: number;
}

export async function validateCartItems(
  requested: RequestedItem[],
  client: PrismaClient | Prisma.TransactionClient = prisma,
): Promise<CartValidationResult> {
  const errors: CartValidationResult["errors"] = [];
  const items: ValidatedItem[] = [];

  for (const { variantId, quantity } of requested) {
    const variant = await client.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant || !variant.product.isActive) {
      errors.push({ variantId, reason: "This product is no longer available" });
      continue;
    }

    if (variant.stock < quantity) {
      errors.push({ variantId, reason: `Only ${variant.stock} left in size ${variant.size}` });
      continue;
    }

    items.push({
      variantId: variant.id,
      productId: variant.productId,
      productName: variant.product.name,
      size: variant.size,
      quantity,
      unitPriceKobo: variant.product.priceKobo,
    });
  }

  const totalKobo = items.reduce((sum, item) => sum + item.unitPriceKobo * item.quantity, 0);

  return { valid: errors.length === 0, items, errors, totalKobo };
}
