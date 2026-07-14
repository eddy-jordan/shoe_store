import { z } from "zod";

export const cartItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1),
});

export const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  line1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1).default("Nigeria"),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  address: addressSchema,
});
