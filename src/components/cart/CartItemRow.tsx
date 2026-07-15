"use client";

import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/types";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 border-b border-zinc-200 py-6">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="96px" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link href={`/products/${item.slug}`} className="font-semibold text-zinc-900 hover:underline">
            {item.name}
          </Link>
          <p className="text-sm text-zinc-500">Size EU {item.size}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
              className="h-8 w-8 shrink-0 rounded-full border border-zinc-300 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="h-8 w-8 shrink-0 rounded-full border border-zinc-300 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold whitespace-nowrap text-zinc-900">
              {formatNaira(item.unitPriceKobo * item.quantity)}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.variantId)}
              className="text-sm whitespace-nowrap text-zinc-400 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
