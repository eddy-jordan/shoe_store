import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  brand: z.string().min(1),
  description: z.string().min(1),
  priceKobo: z.number().int().positive(),
  imageUrl: z.string().url(),
  categoryId: z.string().min(1),
  isActive: z.boolean().default(true),
  variants: z
    .array(
      z.object({
        size: z.string().min(1),
        stock: z.number().int().min(0),
      }),
    )
    .min(1),
});
